import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions, Linking } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useAuth } from '../../../../context/AuthStore'
import { 
  getAllHistoryPRExercise, 
  getSeriesPRExerciseByHistory,
  getDropsetPRExerciseBySeries 
} from '../../../../lib/pr_exercise'
import { 
  getExerciseById, 
  getDifficultyById, 
  getMuscleById, 
  getSpecificMuscleById 
} from '../../../../lib/exercise'
import { DropsetPRExercise, HistoryPRExercise, SeriesPRExercise } from '../../../../interfaces/pr_exercise'
import { ExerciseDAO, DifficultyDAO, MuscleDAO, SpecificMuscleDAO } from '../../../../interfaces/exercise'
import { Picker } from '@react-native-picker/picker'
import { LineChart } from 'react-native-chart-kit'

type TabType = 'resumen' | 'historia' | 'indicaciones'
type TimeFilter = 'all' | 'week' | 'month' | 'sixMonths' | 'year'
type MetricType = 'totalReps' | 'maxWeight' | 'sessionVolume' | 'oneRM'

interface HistoryWithDetails extends HistoryPRExercise {
  series?: (SeriesPRExercise & {
    dropsets?: DropsetPRExercise[]
  })[]
}

interface MetricData {
  date: string;
  value: number;
}

interface BestSeries {
  reps: number;
  weight: number;
}

const ExerciseHistory = () => {
  const { id } = useLocalSearchParams()
  const { checkAuth } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryWithDetails[]>([])
  const [exercise, setExercise] = useState<ExerciseDAO | null>(null)
  const [difficulty, setDifficulty] = useState<DifficultyDAO | null>(null)
  const [muscle, setMuscle] = useState<MuscleDAO | null>(null)
  const [specificMuscle, setSpecificMuscle] = useState<SpecificMuscleDAO | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('resumen')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('totalReps')
  const screenWidth = Dimensions.get('window').width

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const calculateMetric = (history: HistoryWithDetails[], metric: MetricType): MetricData[] => {
    return history.map(record => {
      let value = 0;
      const series = record.series || [];

      switch (metric) {
        case 'totalReps':
          value = series.reduce((total, serie) => {
            const serieReps = serie.reps;
            const dropsetReps = (serie.dropsets || []).reduce((sum, dropset) => sum + dropset.reps, 0);
            return total + serieReps + dropsetReps;
          }, 0);
          break;

        case 'maxWeight':
          value = Math.max(
            ...series.map(serie => [
              serie.weight,
              ...(serie.dropsets || []).map(dropset => dropset.weight)
            ]).flat()
          );
          break;

        case 'sessionVolume':
          value = series.reduce((total, serie) => {
            const serieVolume = serie.weight * serie.reps;
            const dropsetVolume = (serie.dropsets || []).reduce(
              (sum, dropset) => sum + (dropset.weight * dropset.reps),
              0
            );
            return total + serieVolume + dropsetVolume;
          }, 0);
          break;

        case 'oneRM':
          value = Math.max(
            ...series.map(serie => {
              const oneRM = serie.weight / (1.0278 - (0.0278 * serie.reps));
              return oneRM;
            })
          );
          break;
      }

      return {
        date: record.date,
        value: Number(value.toFixed(2))
      };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const calculatePersonalRecords = (history: HistoryWithDetails[]) => {
    let maxWeight = 0;
    let bestOneRM = 0;
    let bestVolume = 0;
    let bestVolumeDetails = { weight: 0, reps: 0 };

    history.forEach(record => {
      const series = record.series || [];
      
      // Calculate max weight
      const currentMaxWeight = Math.max(
        ...series.map(serie => [
          serie.weight,
          ...(serie.dropsets || []).map(dropset => dropset.weight)
        ]).flat()
      );
      maxWeight = Math.max(maxWeight, currentMaxWeight);

      // Calculate best 1RM
      const currentBestOneRM = Math.max(
        ...series.map(serie => {
          const oneRM = serie.weight / (1.0278 - (0.0278 * serie.reps));
          return oneRM;
        })
      );
      bestOneRM = Math.max(bestOneRM, currentBestOneRM);

      // Calculate best volume
      series.forEach(serie => {
        const volume = serie.weight * serie.reps;
        if (volume > bestVolume) {
          bestVolume = volume;
          bestVolumeDetails = { weight: serie.weight, reps: serie.reps };
        }
      });
    });

    return {
      maxWeight: Number(maxWeight.toFixed(2)),
      bestOneRM: Number(bestOneRM.toFixed(2)),
      bestVolume: Number(bestVolume.toFixed(2)),
      bestVolumeDetails
    };
  };

  const calculateBestSeries = (history: HistoryWithDetails[]): BestSeries[] => {
    const bestSeriesByReps = new Map<number, number>();

    history.forEach(record => {
      const series = record.series || [];
      series.forEach(serie => {
        const currentBest = bestSeriesByReps.get(serie.reps) || 0;
        if (serie.weight > currentBest) {
          bestSeriesByReps.set(serie.reps, serie.weight);
        }
      });
    });

    return Array.from(bestSeriesByReps.entries())
      .map(([reps, weight]) => ({ reps, weight }))
      .sort((a, b) => b.reps - a.reps);
  };

  useEffect(() => {
    const loadData = async () => {
      const isAuthenticated = await checkAuth()
      if (!isAuthenticated) return

      try {
        const exerciseId = Number(id)
        const [exerciseData, historyData] = await Promise.all([
          getExerciseById(exerciseId),
          getAllHistoryPRExercise()
        ])

        // Filter history by exercise ID
        const filteredHistory = historyData.filter((h: HistoryPRExercise) => h.exercise_id === exerciseId)

        // Get series and dropsets for each history record
        const historyWithDetails = await Promise.all(
          filteredHistory.map(async (historyRecord: HistoryPRExercise) => {
            const series = await getSeriesPRExerciseByHistory(historyRecord.id!)
            const seriesWithDropsets = await Promise.all(
              series.map(async (serie: SeriesPRExercise) => {
                const dropsets = await getDropsetPRExerciseBySeries(serie.id!)
                return { ...serie, dropsets }
              })
            )
            return { ...historyRecord, series: seriesWithDropsets }
          })
        )

        // Load additional exercise information
        const [difficultyData, muscleData, specificMuscleData] = await Promise.all([
          getDifficultyById(exerciseData.dificulty_id),
          getMuscleById(exerciseData.machine_id),
          getSpecificMuscleById(exerciseData.machine_id)
        ])

        setExercise(exerciseData)
        setDifficulty(difficultyData)
        setMuscle(muscleData)
        setSpecificMuscle(specificMuscleData)
        setHistory(historyWithDetails)
        setLoading(false)
      } catch (err) {
        setError('Error al cargar la información del ejercicio')
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  const filterHistoryByTime = (history: HistoryWithDetails[]) => {
    const now = new Date()
    const filterDate = new Date()

    switch (timeFilter) {
      case 'week':
        filterDate.setDate(now.getDate() - 7)
        break
      case 'month':
        filterDate.setMonth(now.getMonth() - 1)
        break
      case 'sixMonths':
        filterDate.setMonth(now.getMonth() - 6)
        break
      case 'year':
        filterDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        return history
    }

    return history.filter(record => new Date(record.date) >= filterDate)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'resumen':
        const metricData = calculateMetric(history, selectedMetric);
        const chartData = {
          labels: metricData.map(item => formatDate(item.date)),
          datasets: [{
            data: metricData.map(item => item.value)
          }]
        };

        const personalRecords = calculatePersonalRecords(history);
        const bestSeries = calculateBestSeries(history);

        return (
          <View>
            {metricData.length === 0 ? (
              <View className="bg-white p-6 rounded-lg shadow-md mb-8">
                <Text className="text-gray-600 text-center text-lg">
                  No hay datos registrados para este ejercicio
                </Text>
              </View>
            ) : (
              <>
                {/* Graph Section */}
                <View className="bg-white p-6 rounded-lg shadow-md mb-8">
                  <Text className="text-lg font-bold text-gray-800 mb-3">
                    {selectedMetric === 'totalReps' && 'Total de Repeticiones'}
                    {selectedMetric === 'maxWeight' && 'Mayor Peso'}
                    {selectedMetric === 'sessionVolume' && 'Volumen de la Sesión'}
                    {selectedMetric === 'oneRM' && '1 Repetición Máxima'}
                  </Text>
                  <LineChart
                    data={chartData}
                    width={screenWidth - 48}
                    height={220}
                    chartConfig={{
                      backgroundColor: '#ffffff',
                      backgroundGradientFrom: '#ffffff',
                      backgroundGradientTo: '#ffffff',
                      decimalPlaces: 2,
                      color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      style: {
                        borderRadius: 16
                      },
                      propsForDots: {
                        r: '6',
                        strokeWidth: '2',
                        stroke: '#007AFF'
                      }
                    }}
                    bezier
                    style={{
                      marginVertical: 8,
                      borderRadius: 16
                    }}
                  />

                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    className="mt-4"
                  >
                    <View className="flex-row space-x-3">
                      <TouchableOpacity
                        onPress={() => setSelectedMetric('totalReps')}
                        className={`px-4 py-2 rounded-full ${
                          selectedMetric === 'totalReps' 
                            ? 'bg-blue-500' 
                            : 'bg-gray-100'
                        }`}
                      >
                        <Text className={`font-medium ${
                          selectedMetric === 'totalReps' 
                            ? 'text-white' 
                            : 'text-gray-700'
                        }`}>
                          Total Repeticiones
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => setSelectedMetric('maxWeight')}
                        className={`px-4 py-2 rounded-full ${
                          selectedMetric === 'maxWeight' 
                            ? 'bg-blue-500' 
                            : 'bg-gray-100'
                        }`}
                      >
                        <Text className={`font-medium ${
                          selectedMetric === 'maxWeight' 
                            ? 'text-white' 
                            : 'text-gray-700'
                        }`}>
                          Mayor Peso
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => setSelectedMetric('sessionVolume')}
                        className={`px-4 py-2 rounded-full ${
                          selectedMetric === 'sessionVolume' 
                            ? 'bg-blue-500' 
                            : 'bg-gray-100'
                        }`}
                      >
                        <Text className={`font-medium ${
                          selectedMetric === 'sessionVolume' 
                            ? 'text-white' 
                            : 'text-gray-700'
                        }`}>
                          Volumen de la Sesión
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => setSelectedMetric('oneRM')}
                        className={`px-4 py-2 rounded-full ${
                          selectedMetric === 'oneRM' 
                            ? 'bg-blue-500' 
                            : 'bg-gray-100'
                        }`}
                      >
                        <Text className={`font-medium ${
                          selectedMetric === 'oneRM' 
                            ? 'text-white' 
                            : 'text-gray-700'
                        }`}>
                          1 RM
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </View>

                {/* Personal Records Card */}
                <View className="bg-white p-6 rounded-lg shadow-md mb-8">
                  <Text className="text-xl font-bold text-gray-800 mb-4">
                    Records Personales
                  </Text>
                  <View className="space-y-3">
                    <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
                      <Text className="text-gray-600 font-medium">Mayor Peso</Text>
                      <Text className="text-gray-800 font-bold">{personalRecords.maxWeight} kg</Text>
                    </View>
                    <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
                      <Text className="text-gray-600 font-medium">Mejor 1RM</Text>
                      <Text className="text-gray-800 font-bold">{personalRecords.bestOneRM} kg</Text>
                    </View>
                    <View className="flex-row justify-between items-center py-2">
                      <Text className="text-gray-600 font-medium">Mejor Volumen</Text>
                      <Text className="text-gray-800 font-bold">
                        {personalRecords.bestVolumeDetails.weight} kg × {personalRecords.bestVolumeDetails.reps} reps
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Best Series Card */}
                <View className="bg-white p-6 rounded-lg shadow-md mb-8">
                  <Text className="text-xl font-bold text-gray-800 mb-4">
                    Mejor Serie
                  </Text>
                  <View className="space-y-2">
                    {bestSeries.map((series, index) => (
                      <View key={index} className="flex-row justify-between items-center py-2 border-b border-gray-200">
                        <Text className="text-gray-600 font-medium">{series.reps} reps</Text>
                        <Text className="text-gray-800 font-bold">{series.weight} kg</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </>
            )}
          </View>
        )
      case 'historia':
        const filteredHistory = filterHistoryByTime(history)
        return (
          <View>
            <View className="bg-white p-5 rounded-lg shadow-md mb-8">
              <Text className="text-base font-semibold text-gray-700 mb-3">Filtrar por tiempo:</Text>
              <View className="border-2 border-gray-200 rounded-lg overflow-hidden">
                <Picker
                  selectedValue={timeFilter}
                  onValueChange={(value: TimeFilter) => setTimeFilter(value)}
                  style={{ height: 50 }}
                >
                  <Picker.Item label="Todos los registros" value="all" />
                  <Picker.Item label="Última semana" value="week" />
                  <Picker.Item label="Último mes" value="month" />
                  <Picker.Item label="Últimos 6 meses" value="sixMonths" />
                  <Picker.Item label="Último año" value="year" />
                </Picker>
              </View>
            </View>

            {filteredHistory.length === 0 ? (
              <View className="bg-white p-8 rounded-lg shadow-md mb-8">
                <Text className="text-gray-600 text-center text-lg font-medium">
                  No hay registros en el período seleccionado
                </Text>
              </View>
            ) : (
              filteredHistory.map((record, index) => (
                <View key={index} className="bg-white p-5 rounded-lg shadow-md mb-8">
                  <View className="flex-row justify-between items-start mb-3">
                    <Text className="text-xl font-bold text-gray-800">
                      {formatDate(record.date)}
                    </Text>
                    <View className="bg-blue-100 px-4 py-1.5 rounded-full">
                      <Text className="text-blue-800 font-semibold">
                        {record.tipo_sesion}
                      </Text>
                    </View>
                  </View>

                  {record.notas && (
                    <View className="mb-4 bg-gray-50 p-3 rounded-lg">
                      <Text className="text-gray-700 font-medium mb-1">Notas:</Text>
                      <Text className="text-gray-600 italic">
                        "{record.notas}"
                      </Text>
                    </View>
                  )}

                  {record.series && record.series.length > 0 && (
                    <View className="mt-5">
                      <Text className="text-lg font-bold text-gray-800 mb-3">Series:</Text>
                      {record.series.map((serie, serieIndex) => (
                        <View key={serieIndex} className="bg-gray-50 p-4 rounded-lg mb-3 border border-gray-200">
                          <View className="flex-row justify-between items-center mb-2">
                            <Text className="font-bold text-gray-800">Serie {serie.orden_serie}</Text>
                            <Text className="text-gray-700 font-semibold">
                              {serie.reps} reps × {serie.weight}kg
                            </Text>
                          </View>
                          <View className="flex-row items-center mb-2">
                            <Text className="text-gray-700 font-medium">RPE:</Text>
                            <Text className="text-gray-600 ml-2">{serie.rpe}</Text>
                          </View>
                          {serie.notas_serie && (
                            <View className="mt-2 bg-white p-2 rounded">
                              <Text className="text-gray-700 font-medium mb-1">Notas:</Text>
                              <Text className="text-gray-600 italic text-sm">
                                {serie.notas_serie}
                              </Text>
                            </View>
                          )}

                          {serie.dropsets && serie.dropsets.length > 0 && (
                            <View className="mt-3 pl-4 border-l-2 border-blue-200">
                              <Text className="font-bold text-gray-800 mb-2">Dropsets:</Text>
                              {serie.dropsets.map((dropset, dropsetIndex) => (
                                <View key={dropsetIndex} className="bg-white p-3 rounded mb-2 border border-gray-100">
                                  <Text className="text-gray-700 font-medium">
                                    {dropset.reps} reps × {dropset.weight}kg
                                  </Text>
                                </View>
                              ))}
                            </View>
                          )}
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        )
      case 'indicaciones':
        return (
          <View className="space-y-6">
            {/* Description Card */}
            <View className="bg-white p-6 rounded-lg shadow-md mb-4">
              <Text className="text-2xl font-bold text-gray-800 mb-2">
                {exercise?.name}
              </Text>
              <Text className="text-gray-600 text-lg leading-relaxed">
                {exercise?.description}
              </Text>
            </View>

            {/* Exercise Details Card */}
            <View className="bg-white p-6 rounded-lg shadow-md mb-8">
              <Text className="text-2xl font-bold text-gray-800 mb-4">
                Detalles del Ejercicio
              </Text>
              <View className="space-y-4">
                <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
                  <Text className="text-gray-600 font-medium">Dificultad</Text>
                  <Text className="text-gray-800 font-bold">{difficulty?.name}</Text>
                </View>
                <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
                  <Text className="text-gray-600 font-medium">Músculo Principal</Text>
                  <Text className="text-gray-800 font-bold">{muscle?.name}</Text>
                </View>
              </View>
            </View>

            {/* Links Card */}
            <View className="bg-white p-6 rounded-lg shadow-md mb-8">
              <Text className="text-2xl font-bold text-gray-800 mb-4">
                Recursos
              </Text>
              <View className="space-y-4">
                {exercise?.video && (
                  <TouchableOpacity 
                    onPress={() => Linking.openURL(exercise.video)}
                    className="bg-blue-50 p-4 rounded-lg"
                  >
                    <Text className="text-blue-600 font-medium">Ver Video del Ejercicio</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        )
    }
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-gray-100">
        <Text className="text-red-500 text-lg">{error}</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-gray-100">
      {/* Tab Bar */}
      <View className="bg-[#1F2937] flex-row">
        <TouchableOpacity 
          className={`flex-1 py-3 ${activeTab === 'resumen' ? 'border-b-2 border-blue-500' : ''}`}
          onPress={() => setActiveTab('resumen')}
        >
          <Text className={`text-center font-medium ${activeTab === 'resumen' ? 'text-blue-500' : 'text-white'}`}>
            Resumen
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={`flex-1 py-3 ${activeTab === 'historia' ? 'border-b-2 border-blue-500' : ''}`}
          onPress={() => setActiveTab('historia')}
        >
          <Text className={`text-center font-medium ${activeTab === 'historia' ? 'text-blue-500' : 'text-white'}`}>
            Historia
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={`flex-1 py-3 ${activeTab === 'indicaciones' ? 'border-b-2 border-blue-500' : ''}`}
          onPress={() => setActiveTab('indicaciones')}
        >
          <Text className={`text-center font-medium ${activeTab === 'indicaciones' ? 'text-blue-500' : 'text-white'}`}>
            Indicaciones
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        <View className="p-4">
          {renderTabContent()}
        </View>
      </ScrollView>
    </View>
  )
}

export default ExerciseHistory
