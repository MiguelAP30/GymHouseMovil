import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, TextInput, Alert, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useLocalSearchParams, router } from 'expo-router'
import { useAuth } from '../../../../context/AuthStore'
import { 
  getWorkoutDayExerciseById,
  deleteWorkoutDayExercise
} from '../../../../lib/training'
import {  
  getExerciseById,
  getWeekDayById,
  getExerciseConfigurations,
  createExerciseConfiguration,
  updateExerciseConfiguration,
  deleteExerciseConfiguration,
  getExercises,
  getDifficulties
} from '../../../../lib/exercise'
import { getMachines } from '../../../../lib/machine'
import {
  createHistoryPRExercise,
  createSeriesPRExercise,
  createDropsetPRExercise,
  updateSeriesPRExercise,
  updateDropsetPRExercise,
  deleteSeriesPRExercise,
  deleteDropsetPRExercise,
  getHistoryPRExerciseByExerciseAndUser,
  getSeriesPRExerciseByHistory,
  getDropsetPRExerciseBySeries
} from '../../../../lib/pr_exercise'
import { ExerciseConfigurationDAO, ExerciseDAO, WeekDayDAO, DifficultyDAO } from '../../../../interfaces/exercise'
import { ROLES } from '../../../../interfaces/user'
import { WorkoutDayExerciseDAO } from '../../../../interfaces/training'
import { HistoryPRExercise, SeriesPRExercise, DropsetPRExercise } from '../../../../interfaces/pr_exercise'
import { Picker } from '@react-native-picker/picker'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import Pagination from '../../../../components/organisms/paginacion'
import ExerciseList from '../../../../components/ecosystems/ExerciseList'

interface Machine {
  id: number;
  name: string;
  description: string;
}

interface SeriesWithDropsets extends SeriesPRExercise {
  id?: number;
  dropsets?: DropsetPRExercise[];
}

interface ExerciseWithConfig {
  exercise: ExerciseDAO;
  config: ExerciseConfigurationDAO;
  historyPR?: HistoryPRExercise;
  series?: SeriesWithDropsets[];
  lastSession?: HistoryPRExercise;
}

const WorkoutDayDetail = () => {
  const { id } = useLocalSearchParams()
  const { token, user, role } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [workoutDay, setWorkoutDay] = useState<WorkoutDayExerciseDAO | null>(null)
  const [weekDay, setWeekDay] = useState<WeekDayDAO | null>(null)
  const [exercises, setExercises] = useState<ExerciseWithConfig[]>([])
  const [allExercises, setAllExercises] = useState<ExerciseDAO[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedConfig, setSelectedConfig] = useState<ExerciseConfigurationDAO | null>(null)
  const [isTraining, setIsTraining] = useState(false)
  const [isSeriesModalVisible, setIsSeriesModalVisible] = useState(false)
  const [isDropsetModalVisible, setIsDropsetModalVisible] = useState(false)
  const [selectedHistoryPR, setSelectedHistoryPR] = useState<HistoryPRExercise | null>(null)
  const [selectedSeries, setSelectedSeries] = useState<SeriesWithDropsets | null>(null)
  const [isLastSessionModalVisible, setIsLastSessionModalVisible] = useState(false)
  const [selectedLastSession, setSelectedLastSession] = useState<{
    history: HistoryPRExercise;
    series: SeriesWithDropsets[];
  } | null>(null)
  const [newExercise, setNewExercise] = useState({
    exercise_id: 0,
    sets: 3,
    repsHigh: 10,
    repsLow: 8,
    rest: 60,
    notes: '',
    exercise_name: ''
  })
  const [newSeries, setNewSeries] = useState({
    history_pr_exercise_id: 0,
    notas_serie: '',
    orden_serie: 1,
    reps: 10,
    rpe: 8.5,
    tipo_serie: 'Principal',
    weight: 100
  })
  const [newDropset, setNewDropset] = useState({
    serie_pr_exercise_id: 0,
    orden_dropset: 1,
    reps: 8,
    weight: 0
  })
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null)
  const [isExerciseSelectionModalVisible, setIsExerciseSelectionModalVisible] = useState(false)
  const [searchExerciseName, setSearchExerciseName] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null)
  const [selectedMachine, setSelectedMachine] = useState<number | null>(null)
  const [filteredExercises, setFilteredExercises] = useState<ExerciseDAO[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [difficulties, setDifficulties] = useState<DifficultyDAO[]>([])
  const [machines, setMachines] = useState<Machine[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize] = useState(10)

  const isOwnerOrAdmin = () => {
    return workoutDay?.permissions?.can_edit || false;
  }

  const canDelete = () => {
    return workoutDay?.permissions?.can_delete || false;
  }

  useEffect(() => {
    if (id) {
      console.log('Cargando detalles del workout day:', id);
      loadWorkoutDayDetails()
    }
  }, [id])

  useEffect(() => {
    if (isExerciseSelectionModalVisible) {
      loadFilterData()
    }
  }, [isExerciseSelectionModalVisible])

  const loadAllExercises = async () => {
    try {
      const response = await getExercises(1, 50)
      if (response && response.items) {
        setAllExercises(response.items)
      }
    } catch (error) {
      console.error('Error al cargar ejercicios:', error)
    }
  }

  const loadWorkoutDayDetails = async () => {
    try {
      setLoading(true)
      console.log('Obteniendo workout day con ID:', id);
      const workoutDayData = await getWorkoutDayExerciseById(Number(id))
      console.log('Workout day obtenido:', workoutDayData);
      setWorkoutDay(workoutDayData)

      const weekDayData = await getWeekDayById(workoutDayData.week_day_id)
      setWeekDay(weekDayData)

      const configs = await getExerciseConfigurations()
      const dayConfigs = configs.filter((config: ExerciseConfigurationDAO) => 
        config.workout_day_exercise_id === workoutDayData.id
      )

      const exerciseConfigs = await Promise.all(
        dayConfigs.map(async (config: ExerciseConfigurationDAO) => {
          const exercise = await getExerciseById(config.exercise_id)
          // Get last session for this exercise
          const sessions = await getHistoryPRExerciseByExerciseAndUser(exercise.id!, user?.email || '')
          // Sort by date and ID to get the most recent
          const sortedSessions = sessions.sort((a: HistoryPRExercise, b: HistoryPRExercise) => {
            const dateA = new Date(a.date).getTime()
            const dateB = new Date(b.date).getTime()
            if (dateA === dateB) {
              return (b.id || 0) - (a.id || 0)
            }
            return dateB - dateA
          })
          return {
            exercise,
            config,
            lastSession: sortedSessions[0] // Get the most recent session
          }
        })
      )

      setExercises(exerciseConfigs)
    } catch (error) {
      console.error('Error al cargar detalles:', error)
      setError('Error al cargar los detalles del día de entrenamiento')
    } finally {
      setLoading(false)
    }
  }

  const handleAddExercise = async () => {
    if (!newExercise.exercise_id) {
      Alert.alert('Error', 'Por favor selecciona un ejercicio')
      return
    }

    // Verificar si el ejercicio ya existe en la lista
    const exerciseExists = exercises.some(
      exerciseData => exerciseData.exercise.id === newExercise.exercise_id
    )

    if (exerciseExists) {
      Alert.alert('Error', 'Este ejercicio ya está agregado a la rutina')
      return
    }

    try {
      await createExerciseConfiguration({
        ...newExercise,
        workout_day_exercise_id: Number(id)
      })

      await loadWorkoutDayDetails()
      setIsModalVisible(false)
      setNewExercise({
        exercise_id: 0,
        sets: 3,
        repsHigh: 10,
        repsLow: 8,
        rest: 60,
        notes: '',
        exercise_name: ''
      })
    } catch (error) {
      console.error('Error al agregar ejercicio:', error)
      Alert.alert('Error', 'No se pudo agregar el ejercicio')
    }
  }

  const handleUpdateExercise = async () => {
    if (!selectedConfig?.id) return

    try {
      await updateExerciseConfiguration(selectedConfig.id, selectedConfig)
      await loadWorkoutDayDetails()
      setIsModalVisible(false)
      setSelectedConfig(null)
    } catch (error) {
      console.error('Error al actualizar ejercicio:', error)
      Alert.alert('Error', 'No se pudo actualizar el ejercicio')
    }
  }

  const handleDeleteExercise = async (configId: number) => {
    try {
      await deleteExerciseConfiguration(configId)
      await loadWorkoutDayDetails()
    } catch (error) {
      console.error('Error al eliminar ejercicio:', error)
      Alert.alert('Error', 'No se pudo eliminar el ejercicio')
    }
  }

  const openEditModal = (exerciseData: ExerciseWithConfig) => {
    setSelectedConfig(exerciseData.config)
    setNewExercise({
      exercise_id: exerciseData.exercise.id!,
      sets: exerciseData.config.sets,
      repsHigh: exerciseData.config.repsHigh,
      repsLow: exerciseData.config.repsLow || 8,
      rest: exerciseData.config.rest,
      notes: exerciseData.config.notes || '',
      exercise_name: exerciseData.exercise.name
    })
    setIsEditing(true)
    setIsModalVisible(true)
  }

  const startTraining = () => {
    setIsTraining(true)
    // Inicializar el estado local para cada ejercicio
    setExercises(exercises.map(exercise => ({
      ...exercise,
      historyPR: {
        date: new Date().toISOString().split('T')[0],
        exercise_id: exercise.exercise.id!,
        notas: '',
        tipo_sesion: 'Fuerza',
        user_email: user?.email || '',
        series: []
      },
      series: []
    })))
  }

  const endTraining = async () => {
    try {
      // Crear todos los HistoryPRExercise con sus series y dropsets
      const results = await Promise.all(
        exercises.map(async (exercise) => {
          if (!exercise.historyPR || !exercise.series || exercise.series.length === 0) return null;

          const historyData = {
            date: exercise.historyPR.date,
            exercise_id: exercise.historyPR.exercise_id,
            notas: exercise.historyPR.notas,
            tipo_sesion: exercise.historyPR.tipo_sesion,
            series: exercise.series.map(series => ({
              notas_serie: series.notas_serie,
              orden_serie: series.orden_serie,
              reps: series.reps,
              rpe: series.rpe,
              tipo_serie: series.tipo_serie,
              weight: series.weight,
              dropsets: series.dropsets?.map(dropset => ({
                orden_dropset: dropset.orden_dropset,
                reps: dropset.reps,
                weight: dropset.weight
              })) || []
            }))
          };

          console.log('Enviando datos del historial:', historyData);
          return await createHistoryPRExercise(historyData);
        })
      );

      setIsTraining(false);
      Alert.alert('Éxito', 'Entrenamiento guardado correctamente');
      
      // Recargar los datos después de guardar
      await loadWorkoutDayDetails();
    } catch (error) {
      console.error('Error al terminar entrenamiento:', error);
      Alert.alert('Error', 'No se pudo guardar el entrenamiento');
    }
  }

  const handleAddSeries = async (exerciseId: number) => {
    try {
      // Obtener el número de series existentes para este ejercicio específico
      const currentExercise = exercises.find(ex => ex.exercise.id === exerciseId);
      if (!currentExercise) {
        console.error('Ejercicio no encontrado:', exerciseId);
        return;
      }

      const existingSeries = currentExercise.series || [];
      
      const newSeriesData: SeriesWithDropsets = {
        id: Date.now(), // Temporal, idealmente usar uuid
        history_pr_exercise_id: 0,
        notas_serie: newSeries.notas_serie,
        orden_serie: existingSeries.length + 1,
        reps: Number(newSeries.reps),
        rpe: Number(newSeries.rpe),
        tipo_serie: newSeries.tipo_serie,
        weight: Number(newSeries.weight),
        dropsets: []
      };

      setExercises(prevExercises => 
        prevExercises.map(ex => {
          if (ex.exercise.id === exerciseId) {
            return {
              ...ex,
              series: [...(ex.series || []), newSeriesData]
            };
          }
          return ex;
        })
      );
      
      setIsSeriesModalVisible(false);
      setNewSeries({
        history_pr_exercise_id: 0,
        notas_serie: '',
        orden_serie: 1,
        reps: 10,
        rpe: 8.5,
        tipo_serie: 'Principal',
        weight: 100
      });
    } catch (error) {
      console.error('Error al agregar serie:', error);
      Alert.alert('Error', 'No se pudo agregar la serie');
    }
  };

  const handleAddDropset = async (seriesId: number) => {
    try {
      const newDropsetData = {
        id: Date.now(), // ID temporal para el estado local
        serie_pr_exercise_id: seriesId,
        orden_dropset: (newDropset.orden_dropset || 1),
        reps: Number(newDropset.reps),
        weight: Number(newDropset.weight)
      };
      
      setExercises(exercises.map(ex => {
        if (ex.series?.some(s => s.id === seriesId)) {
          return {
            ...ex,
            series: ex.series.map(s => {
              if (s.id === seriesId) {
                return {
                  ...s,
                  dropsets: [...(s.dropsets || []), newDropsetData]
                }
              }
              return s
            })
          }
        }
        return ex
      }))
      
      setIsDropsetModalVisible(false)
      setNewDropset({
        serie_pr_exercise_id: 0,
        orden_dropset: 1,
        reps: 8,
        weight: 0
      })
    } catch (error) {
      console.error('Error al agregar dropset:', error)
      Alert.alert('Error', 'No se pudo agregar el dropset')
    }
  }

  const handleUpdateSeries = async (seriesId: number, updatedData: Partial<SeriesWithDropsets>) => {
    try {
      await updateSeriesPRExercise(seriesId, updatedData)
      setExercises(exercises.map(ex => {
        if (ex.series?.some(s => s.id === seriesId)) {
          return {
            ...ex,
            series: ex.series.map(s => {
              if (s.id === seriesId) {
                return { ...s, ...updatedData }
              }
              return s
            })
          }
        }
        return ex
      }))
    } catch (error) {
      console.error('Error al actualizar serie:', error)
      Alert.alert('Error', 'No se pudo actualizar la serie')
    }
  }

  const handleUpdateDropset = async (dropsetId: number, updatedData: Partial<DropsetPRExercise>) => {
    try {
      await updateDropsetPRExercise(dropsetId, updatedData)
      setExercises(exercises.map(ex => {
        if (ex.series?.some(s => s.dropsets?.some((d: DropsetPRExercise) => d.id === dropsetId))) {
          return {
            ...ex,
            series: ex.series.map(s => {
              if (s.dropsets?.some((d: DropsetPRExercise) => d.id === dropsetId)) {
                return {
                  ...s,
                  dropsets: s.dropsets.map((d: DropsetPRExercise) => {
                    if (d.id === dropsetId) {
                      return { ...d, ...updatedData }
                    }
                    return d
                  })
                }
              }
              return s
            })
          }
        }
        return ex
      }))
    } catch (error) {
      console.error('Error al actualizar dropset:', error)
      Alert.alert('Error', 'No se pudo actualizar el dropset')
    }
  }

  const handleDeleteSeries = async (seriesId: number) => {
    try {
      await deleteSeriesPRExercise(seriesId)
      setExercises(exercises.map(ex => {
        if (ex.series?.some(s => s.id === seriesId)) {
          return {
            ...ex,
            series: ex.series.filter(s => s.id !== seriesId)
          }
        }
        return ex
      }))
    } catch (error) {
      console.error('Error al eliminar serie:', error)
      Alert.alert('Error', 'No se pudo eliminar la serie')
    }
  }

  const handleDeleteDropset = async (dropsetId: number) => {
    try {
      await deleteDropsetPRExercise(dropsetId)
      setExercises(exercises.map(ex => {
        if (ex.series?.some(s => s.dropsets?.some((d: DropsetPRExercise) => d.id === dropsetId))) {
          return {
            ...ex,
            series: ex.series.map(s => {
              if (s.dropsets?.some((d: DropsetPRExercise) => d.id === dropsetId)) {
                return {
                  ...s,
                  dropsets: s.dropsets.filter((d: DropsetPRExercise) => d.id !== dropsetId)
                }
              }
              return s
            })
          }
        }
        return ex
      }))
    } catch (error) {
      console.error('Error al eliminar dropset:', error)
      Alert.alert('Error', 'No se pudo eliminar el dropset')
    }
  }

  const handleViewLastSession = async (exerciseId: number, historyId: number) => {
    try {
      const series = await getSeriesPRExerciseByHistory(historyId)
      const seriesWithDropsets = await Promise.all(
        series.map(async (serie: SeriesPRExercise) => {
          const dropsets = await getDropsetPRExerciseBySeries(serie.id!)
          return { ...serie, dropsets }
        })
      )
      setSelectedLastSession({
        history: exercises.find(ex => ex.exercise.id === exerciseId)?.lastSession!,
        series: seriesWithDropsets
      })
      setIsLastSessionModalVisible(true)
    } catch (error) {
      console.error('Error al cargar detalles de la última sesión:', error)
      Alert.alert('Error', 'No se pudieron cargar los detalles de la última sesión')
    }
  }

  const loadFilterData = async () => {
    try {
      const [difficultiesData, machinesData] = await Promise.all([
        getDifficulties(),
        getMachines()
      ])
      setDifficulties(difficultiesData)
      setMachines(machinesData)
    } catch (error) {
      console.error('Error al cargar datos de filtro:', error)
    }
  }

  const searchExercises = async () => {
    if (!searchExerciseName && !selectedDifficulty && !selectedMachine) {
      setFilteredExercises([])
      setTotalPages(1)
      return
    }

    setIsSearching(true)
    try {
      const response = await getExercises(
        currentPage,
        pageSize,
        searchExerciseName || undefined,
        selectedDifficulty || undefined,
        selectedMachine || undefined
      )
      setFilteredExercises(response.items)
      setTotalPages(response.pages)
    } catch (error) {
      console.error('Error al buscar ejercicios:', error)
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setCurrentPage(1)
      searchExercises()
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchExerciseName, selectedDifficulty, selectedMachine])

  useEffect(() => {
    if (currentPage > 1) {
      searchExercises()
    }
  }, [currentPage])

  const handleExerciseSelect = (exercise: ExerciseDAO) => {
    setNewExercise(prev => ({
      ...prev,
      exercise_id: exercise.id!,
      exercise_name: exercise.name
    }))
    setIsExerciseSelectionModalVisible(false)
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500">{error}</Text>
        <TouchableOpacity 
          className="bg-blue-500 p-2.5 rounded-lg mt-4"
          onPress={loadWorkoutDayDetails}
        >
          <Text className="text-white font-bold">Reintentar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1F2937' }}>
      <ScrollView className="flex-1 p-5 bg-gray-100">
        <View className="mb-6">
          <View className="flex-row justify-between items-center">
            <Text className="text-2xl font-bold text-black">{weekDay?.name}</Text>
            <View className="flex-row space-x-2">
              {!isTraining ? (
                <TouchableOpacity 
                  className="bg-green-500 p-2 rounded-lg"
                  onPress={startTraining}
                >
                  <Text className="text-white font-bold">Empezar Entrenamiento</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  className="bg-red-500 p-2 rounded-lg"
                  onPress={endTraining}
                >
                  <Text className="text-white font-bold">Terminar Entrenamiento</Text>
                </TouchableOpacity>
              )}
              {workoutDay?.permissions?.can_edit && (
                <TouchableOpacity 
                  className="bg-blue-500 p-2 rounded-lg"
                  onPress={() => {
                    setIsEditing(false)
                    setSelectedConfig(null)
                    setNewExercise({
                      exercise_id: 0,
                      sets: 3,
                      repsHigh: 10,
                      repsLow: 8,
                      rest: 60,
                      notes: '',
                      exercise_name: ''
                    })
                    setIsModalVisible(true)
                  }}
                >
                  <Ionicons name="add" size={20} color="white" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {exercises.map((exerciseData, index) => (
          <View key={index} className="mb-4 p-3 bg-gray-50 rounded-lg">
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="text-lg font-semibold">{exerciseData.exercise.name}</Text>
                <Text className="text-gray-600 mb-2">{exerciseData.exercise.description}</Text>
              </View>
              {exerciseData.config.permissions && (
                <View className="flex-row space-x-2">
                  {exerciseData.config.permissions.can_edit && (
                    <TouchableOpacity 
                      onPress={() => openEditModal(exerciseData)}
                      className="bg-blue-500 p-1 rounded-full"
                    >
                      <Ionicons name="pencil" size={16} color="white" />
                    </TouchableOpacity>
                  )}
                  {exerciseData.config.permissions.can_delete && (
                    <TouchableOpacity 
                      onPress={() => handleDeleteExercise(exerciseData.config.id!)}
                      className="bg-red-500 p-1 rounded-full"
                    >
                      <Ionicons name="trash" size={16} color="white" />
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
            
            <View className="flex-row justify-between">
              <View>
                <Text className="text-gray-500">Series: {exerciseData.config.sets}</Text>
                <Text className="text-gray-500">Repeticiones: {exerciseData.config.repsHigh}-{exerciseData.config.repsLow}</Text>
              </View>
              <View>
                <Text className="text-gray-500">Descanso: {exerciseData.config.rest}s</Text>
              </View>
            </View>
            {exerciseData.config.notes && (
              <View className="mt-2">
                <Text className="text-gray-500 italic">Notas: {exerciseData.config.notes}</Text>
              </View>
            )}

            {exerciseData.lastSession && (
              <View className="mt-4 flex-row justify-between items-center">
                <Text className="text-gray-700 font-semibold">Última Sesión</Text>
                <TouchableOpacity 
                  onPress={() => handleViewLastSession(exerciseData.exercise.id!, exerciseData.lastSession!.id!)}
                  className="bg-blue-500 p-2 rounded-full"
                >
                  <Ionicons name="eye" size={20} color="white" />
                </TouchableOpacity>
              </View>
            )}

            {isTraining && exerciseData.historyPR && (
              <View className="mt-4">
                <View className="mb-4">
                  <Text className="font-bold mb-2">Notas de la Sesión</Text>
                  <TextInput
                    className="border border-gray-300 p-2 rounded-lg"
                    value={exerciseData.historyPR.notas}
                    onChangeText={(text) => {
                      setExercises(prevExercises => 
                        prevExercises.map(ex => {
                          if (ex.exercise.id === exerciseData.exercise.id) {
                            return {
                              ...ex,
                              historyPR: {
                                ...ex.historyPR!,
                                notas: text
                              }
                            };
                          }
                          return ex;
                        })
                      );
                    }}
                    placeholder="Agrega notas sobre la sesión"
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View className="flex-row justify-between items-center mb-2">
                  <Text className="font-bold">Series del Entrenamiento</Text>
                  <TouchableOpacity 
                    className="bg-green-500 p-2 rounded-lg"
                    onPress={() => {
                      setSelectedExerciseId(exerciseData.exercise.id!);
                      setNewSeries({
                        ...newSeries,
                        history_pr_exercise_id: exerciseData.historyPR!.id!
                      });
                      setIsSeriesModalVisible(true);
                    }}
                  >
                    <Text className="text-white">Agregar Serie</Text>
                  </TouchableOpacity>
                </View>

                {exerciseData.series?.map((series, seriesIndex) => (
                  <View key={seriesIndex} className="mb-2 p-2 bg-white rounded-lg">
                    <View className="flex-row justify-between items-center">
                      <Text>Serie {series.orden_serie}</Text>
                      <View className="flex-row space-x-2">
                        <TouchableOpacity 
                          className="bg-blue-500 p-1 rounded-full"
                          onPress={() => {
                            setSelectedSeries(series)
                            setIsSeriesModalVisible(true)
                          }}
                        >
                          <Ionicons name="pencil" size={16} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          className="bg-red-500 p-1 rounded-full"
                          onPress={() => handleDeleteSeries(series.id!)}
                        >
                          <Ionicons name="trash" size={16} color="white" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Text>Tipo: {series.tipo_serie}</Text>
                    <Text>Reps: {series.reps}</Text>
                    <Text>Peso: {series.weight}kg</Text>
                    <Text>RPE: {series.rpe}</Text>
                    {series.notas_serie && (
                      <Text className="italic">Notas: {series.notas_serie}</Text>
                    )}

                    <View className="mt-2">
                      <View className="flex-row justify-between items-center mb-2">
                        <Text className="font-bold">Dropsets</Text>
                        <TouchableOpacity 
                          className="bg-green-500 p-1 rounded-lg"
                          onPress={() => {
                            setNewDropset({
                              ...newDropset,
                              serie_pr_exercise_id: series.id!
                            })
                            setIsDropsetModalVisible(true)
                          }}
                        >
                          <Text className="text-white">Agregar Dropset</Text>
                        </TouchableOpacity>
                      </View>

                      {series.dropsets?.map((dropset, dropsetIndex) => (
                        <View key={dropsetIndex} className="ml-4 p-2 bg-gray-100 rounded-lg mb-2">
                          <View className="flex-row justify-between items-center">
                            <Text>Dropset {dropset.orden_dropset}</Text>
                            <View className="flex-row space-x-2">
                              <TouchableOpacity 
                                className="bg-blue-500 p-1 rounded-full"
                                onPress={() => {
                                  setSelectedSeries(series)
                                  setNewDropset(dropset)
                                  setIsDropsetModalVisible(true)
                                }}
                              >
                                <Ionicons name="pencil" size={16} color="white" />
                              </TouchableOpacity>
                              <TouchableOpacity 
                                className="bg-red-500 p-1 rounded-full"
                                onPress={() => handleDeleteDropset(dropset.id!)}
                              >
                                <Ionicons name="trash" size={16} color="white" />
                              </TouchableOpacity>
                            </View>
                          </View>
                          <Text>Reps: {dropset.reps}</Text>
                          <Text>Peso: {dropset.weight}kg</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        <Modal
          visible={isSeriesModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsSeriesModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-4 rounded-lg w-[90%] max-h-[80%]">
              <ScrollView>
                <Text className="text-xl font-bold mb-4">
                  {selectedSeries ? 'Editar Serie' : 'Agregar Serie'}
                </Text>

                <View className="mb-2">
                  <Text className="text-gray-600 mb-1">Tipo de Serie</Text>
                  <View className="border border-gray-300 rounded-lg">
                    <Picker
                      selectedValue={newSeries.tipo_serie}
                      onValueChange={(value) => setNewSeries({...newSeries, tipo_serie: value})}
                    >
                      <Picker.Item label="Principal" value="Principal" />
                      <Picker.Item label="Calentamiento" value="Calentamiento" />
                    </Picker>
                  </View>
                </View>

                <View className="mb-2">
                  <Text className="text-gray-600 mb-1">Repeticiones</Text>
                  <TextInput
                    className="border border-gray-300 p-2 rounded-lg"
                    value={newSeries.reps.toString()}
                    onChangeText={(value) => {
                      const num = value ? parseInt(value) : 0;
                      if (!isNaN(num)) {
                        setNewSeries({...newSeries, reps: num});
                      }
                    }}
                    keyboardType="numeric"
                    placeholder="Ingrese el número de repeticiones"
                  />
                </View>

                <View className="mb-2">
                  <Text className="text-gray-600 mb-1">Peso (kg)</Text>
                  <TextInput
                    className="border border-gray-300 p-2 rounded-lg"
                    value={newSeries.weight.toString()}
                    onChangeText={(value) => {
                      const num = value ? parseFloat(value) : 0;
                      if (!isNaN(num)) {
                        setNewSeries({...newSeries, weight: num});
                      }
                    }}
                    keyboardType="numeric"
                    placeholder="Ingrese el peso"
                  />
                </View>

                <View className="mb-2">
                  <Text className="text-gray-600 mb-1">RPE (1-10)</Text>
                  <TextInput
                    className="border border-gray-300 p-2 rounded-lg"
                    value={newSeries.rpe.toString()}
                    onChangeText={(value) => {
                      const num = value ? parseFloat(value) : 0;
                      if (num >= 0 && num <= 10) {
                        setNewSeries({...newSeries, rpe: num});
                      }
                    }}
                    keyboardType="numeric"
                    placeholder="Ingrese el RPE (1-10)"
                  />
                </View>

                <View className="mb-4">
                  <Text className="text-gray-600 mb-1">Notas</Text>
                  <TextInput
                    className="border border-gray-300 p-2 rounded-lg"
                    value={newSeries.notas_serie}
                    onChangeText={(value) => setNewSeries({...newSeries, notas_serie: value})}
                    multiline
                    numberOfLines={3}
                    placeholder="Agregue notas sobre la serie"
                  />
                </View>

                <View className="flex-row space-x-2">
                  <TouchableOpacity 
                    className="bg-green-500 p-2 rounded-lg flex-1"
                    onPress={() => {
                      if (selectedSeries) {
                        handleUpdateSeries(selectedSeries.id!, newSeries);
                      } else if (selectedExerciseId) {
                        handleAddSeries(selectedExerciseId);
                      }
                    }}
                  >
                    <Text className="text-white font-bold text-center">
                      {selectedSeries ? 'Guardar' : 'Agregar'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="bg-red-500 p-2 rounded-lg flex-1"
                    onPress={() => {
                      setIsSeriesModalVisible(false);
                      setSelectedSeries(null);
                      setSelectedExerciseId(null);
                      setNewSeries({
                        history_pr_exercise_id: 0,
                        notas_serie: '',
                        orden_serie: 1,
                        reps: 10,
                        rpe: 8.5,
                        tipo_serie: 'Principal',
                        weight: 100
                      });
                    }}
                  >
                    <Text className="text-white font-bold text-center">Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Modal
          visible={isDropsetModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsDropsetModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-4 rounded-lg w-[90%] max-h-[80%]">
              <ScrollView>
                <Text className="text-xl font-bold mb-4">
                  {selectedSeries ? 'Editar Dropset' : 'Agregar Dropset'}
                </Text>

                <View className="mb-2">
                  <Text className="text-gray-600 mb-1">Repeticiones</Text>
                  <TextInput
                    className="border border-gray-300 p-2 rounded-lg"
                    value={newDropset.reps.toString()}
                    onChangeText={(value) => setNewDropset({...newDropset, reps: parseInt(value) || 0})}
                    keyboardType="numeric"
                  />
                </View>

                <View className="mb-2">
                  <Text className="text-gray-600 mb-1">Peso (kg)</Text>
                  <TextInput
                    className="border border-gray-300 p-2 rounded-lg"
                    value={newDropset.weight.toString()}
                    onChangeText={(value) => setNewDropset({...newDropset, weight: parseFloat(value) || 0})}
                    keyboardType="numeric"
                  />
                </View>

                <View className="flex-row space-x-2">
                  <TouchableOpacity 
                    className="bg-green-500 p-2 rounded-lg flex-1"
                    onPress={() => {
                      if (selectedSeries) {
                        handleUpdateDropset(selectedSeries.id!, newDropset);
                      } else {
                        handleAddDropset(newDropset.serie_pr_exercise_id);
                      }
                    }}
                  >
                    <Text className="text-white font-bold text-center">
                      {selectedSeries ? 'Guardar' : 'Agregar'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="bg-red-500 p-2 rounded-lg flex-1"
                    onPress={() => {
                      setIsDropsetModalVisible(false);
                      setSelectedSeries(null);
                      setNewDropset({
                        serie_pr_exercise_id: 0,
                        orden_dropset: 1,
                        reps: 8,
                        weight: 0
                      });
                    }}
                  >
                    <Text className="text-white font-bold text-center">Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-4 rounded-lg w-[90%] max-h-[80%]">
              <ScrollView>
                <Text className="text-xl font-bold mb-4">
                  {isEditing ? 'Editar Ejercicio' : 'Agregar Ejercicio'}
                </Text>
                
                <View className="mb-4">
                  <Text className="text-gray-600 mb-1">Ejercicio</Text>
                  <TouchableOpacity 
                    className="border border-gray-300 p-2 rounded-lg flex-row justify-between items-center"
                    onPress={() => setIsExerciseSelectionModalVisible(true)}
                  >
                    <Text className="text-gray-700">
                      {newExercise.exercise_name || 'Selecciona un ejercicio'}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="gray" />
                  </TouchableOpacity>
                </View>

                <View className="mb-2">
                  <Text className="text-gray-600 mb-1">Series (1-10)</Text>
                  <TextInput
                    className="border border-gray-300 p-2 rounded-lg"
                    value={newExercise.sets.toString()}
                    onChangeText={(value) => {
                      const num = parseInt(value) || 0;
                      if (num >= 1 && num <= 10) {
                        setNewExercise({...newExercise, sets: num});
                      }
                    }}
                    keyboardType="numeric"
                  />
                </View>

                <View className="mb-2">
                  <Text className="text-gray-600 mb-1">Repeticiones Máximas (1-100)</Text>
                  <TextInput
                    className="border border-gray-300 p-2 rounded-lg"
                    value={newExercise.repsHigh.toString()}
                    onChangeText={(value) => {
                      const num = parseInt(value) || 0;
                      if (num >= 0 && num <= 100) {
                        setNewExercise({...newExercise, repsHigh: num});
                      }
                    }}
                    keyboardType="numeric"
                  />
                </View>

                <View className="mb-2">
                  <Text className="text-gray-600 mb-1">Repeticiones Mínimas (1-100)</Text>
                  <TextInput
                    className="border border-gray-300 p-2 rounded-lg"
                    value={newExercise.repsLow.toString()}
                    onChangeText={(value) => {
                      const num = parseInt(value) || 0;
                      if (num >= 0 && num <= 100) {
                        setNewExercise({...newExercise, repsLow: num});
                      }
                    }}
                    keyboardType="numeric"
                  />
                </View>

                <View className="mb-2">
                  <Text className="text-gray-600 mb-1">Descanso (segundos)</Text>
                  <TextInput
                    className="border border-gray-300 p-2 rounded-lg"
                    value={newExercise.rest.toString()}
                    onChangeText={(value) => {
                      const num = parseFloat(value) || 0;
                      if (num >= 0 && num <= 1000) {
                        setNewExercise({...newExercise, rest: num});
                      }
                    }}
                    keyboardType="numeric"
                  />
                </View>

                <View className="mb-4">
                  <Text className="text-gray-600 mb-1">Notas</Text>
                  <TextInput
                    className="border border-gray-300 p-2 rounded-lg"
                    value={newExercise.notes}
                    onChangeText={(value) => setNewExercise({...newExercise, notes: value})}
                    multiline
                    numberOfLines={3}
                    placeholder="Agrega notas o instrucciones especiales"
                  />
                </View>

                <View className="flex-row space-x-2">
                  <TouchableOpacity 
                    className="bg-green-500 p-2 rounded-lg flex-1"
                    onPress={isEditing ? handleUpdateExercise : handleAddExercise}
                  >
                    <Text className="text-white font-bold text-center">
                      {isEditing ? 'Guardar' : 'Agregar'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="bg-red-500 p-2 rounded-lg flex-1"
                    onPress={() => {
                      setIsModalVisible(false);
                      setSelectedConfig(null);
                      setIsEditing(false);
                    }}
                  >
                    <Text className="text-white font-bold text-center">Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Modal de selección de ejercicio */}
        <Modal
          visible={isExerciseSelectionModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsExerciseSelectionModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-4 rounded-lg w-[95%] h-[90%]">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold">Seleccionar Ejercicio</Text>
                <TouchableOpacity 
                  onPress={() => setIsExerciseSelectionModalVisible(false)}
                  className="bg-red-500 p-2 rounded-full"
                >
                  <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>

              <View className="flex-1">
                <ExerciseList onExerciseSelect={handleExerciseSelect} isSelectionMode={true} />
              </View>
            </View>
          </View>
        </Modal>

        {/* Last Session Modal */}
        <Modal
          visible={isLastSessionModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsLastSessionModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-4 rounded-lg w-[90%] max-h-[80%]">
              <ScrollView>
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-xl font-bold">Detalles de la Última Sesión</Text>
                  <TouchableOpacity 
                    onPress={() => setIsLastSessionModalVisible(false)}
                    className="bg-red-500 p-2 rounded-full"
                  >
                    <Ionicons name="close" size={20} color="white" />
                  </TouchableOpacity>
                </View>

                {selectedLastSession && (
                  <>
                    <View className="mb-4">
                      <Text className="text-lg font-semibold mb-2">
                        {new Date(selectedLastSession.history.date).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </Text>
                      <Text className="text-gray-600 mb-1">
                        Tipo de Sesión: {selectedLastSession.history.tipo_sesion}
                      </Text>
                      {selectedLastSession.history.notas && (
                        <Text className="text-gray-600 italic">
                          Notas: {selectedLastSession.history.notas}
                        </Text>
                      )}
                    </View>

                    <View className="mb-4">
                      <Text className="text-lg font-semibold mb-2">Series</Text>
                      {selectedLastSession.series.map((serie, index) => (
                        <View key={index} className="bg-gray-50 p-3 rounded-lg mb-2">
                          <Text className="font-semibold">Serie {serie.orden_serie}</Text>
                          <Text>Tipo: {serie.tipo_serie}</Text>
                          <Text>Reps: {serie.reps}</Text>
                          <Text>Peso: {serie.weight}kg</Text>
                          <Text>RPE: {serie.rpe}</Text>
                          {serie.notas_serie && (
                            <Text className="italic">Notas: {serie.notas_serie}</Text>
                          )}

                          {serie.dropsets && serie.dropsets.length > 0 && (
                            <View className="mt-2 ml-4">
                              <Text className="font-semibold mb-1">Dropsets</Text>
                              {serie.dropsets.map((dropset, dIndex) => (
                                <View key={dIndex} className="bg-gray-100 p-2 rounded-lg mb-1">
                                  <Text>Dropset {dropset.orden_dropset}</Text>
                                  <Text>Reps: {dropset.reps}</Text>
                                  <Text>Peso: {dropset.weight}kg</Text>
                                </View>
                              ))}
                            </View>
                          )}
                        </View>
                      ))}
                    </View>
                  </>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  )
}

export default WorkoutDayDetail
