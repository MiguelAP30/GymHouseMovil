import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useLocalSearchParams, router } from 'expo-router'
import { useAuth } from '../../../context/AuthStore'
import { 
  getTrainingPlanById, 
  getWorkoutDayExercisesByTrainingPlan,
  deleteWorkoutDayExercise,
  createWorkoutDayExercise,
  updateTrainingPlan
} from '../../../lib/training'
import {  
  getExerciseById,
  getWeekDayById,
  getExerciseConfigurations,
  createExerciseConfiguration,
  updateExerciseConfiguration,
  deleteExerciseConfiguration,
  getWeekDays,
  getExercises} from '../../../lib/exercise'
import {  ExerciseConfigurationDAO, ExerciseDAO, WeekDayDAO } from '../../../interfaces/exercise'
import { ROLES } from '../../../interfaces/user'
import {TrainingPlanDAO, WorkoutDayExerciseDAO} from '../../../interfaces/training'
import { Picker } from '@react-native-picker/picker'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context';

interface ExerciseWithConfig {
  exercise: ExerciseDAO;
  config: ExerciseConfigurationDAO;
}

interface DayWithExercises {
  weekDay: WeekDayDAO;
  exercises: ExerciseWithConfig[];
  workoutDayId: number;
}

const TrainingPlanDetail = () => {
  const { id } = useLocalSearchParams()
  const { token, user, role } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlanDAO | null>(null)
  const [daysWithExercises, setDaysWithExercises] = useState<DayWithExercises[]>([])
  const [allExercises, setAllExercises] = useState<ExerciseDAO[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [newExercise, setNewExercise] = useState({
    exercise_id: 0,
    sets: 3,
    repsHigh: 10,
    repsLow: 8,
    rest: 60,
    notes: ''
  })
  const [weekDays, setWeekDays] = useState<WeekDayDAO[]>([])
  const [editingRoutine, setEditingRoutine] = useState({
    name: '',
    description: '',
    is_visible: false
  })
  const [isAddingExercise, setIsAddingExercise] = useState(false)

  const isOwnerOrAdmin = () => {
    return trainingPlan?.permissions?.can_edit || false;
  }

  const canDelete = () => {
    return trainingPlan?.permissions?.can_delete || false;
  }

  useEffect(() => {
    console.log('ID del plan:', id)
    if (id) {
      loadTrainingPlanDetails()
      loadAllExercises()
      loadWeekDays()
    }
  }, [id])

  useEffect(() => {
    if (trainingPlan) {
      setEditingRoutine({
        name: trainingPlan.name,
        description: trainingPlan.description,
        is_visible: trainingPlan.is_visible
      })
    }
  }, [trainingPlan])

  const loadAllExercises = async () => {
    try {
      const response = await getExercises()
      if (response && response.items) {
        setAllExercises(response.items)
      } else {
        setAllExercises([])
      }
    } catch (error) {
      console.error('Error al cargar ejercicios:', error)
      setAllExercises([])
    }
  }

  const loadTrainingPlanDetails = async () => {
    try {
      setLoading(true)
      console.log('Cargando detalles del plan...')
      
      const response = await getTrainingPlanById(Number(id))
      console.log('Plan cargado:', response)
      setTrainingPlan(response.data)

      // Obtener los días de entrenamiento
      const workoutDays = await getWorkoutDayExercisesByTrainingPlan(Number(id))
      console.log('Días de entrenamiento:', workoutDays)
      
      // Obtener todas las configuraciones de ejercicios
      const allConfigs = await getExerciseConfigurations()
      console.log('Todas las configuraciones:', allConfigs)
      
      // Para cada día, obtener sus ejercicios
      const daysData = await Promise.all(
        workoutDays.map(async (workoutDay: WorkoutDayExerciseDAO) => {
          console.log('Procesando día:', workoutDay)
          
          // Obtener el nombre del día
          const weekDay = await getWeekDayById(workoutDay.week_day_id)
          console.log('Día de la semana:', weekDay)
          
          // Filtrar las configuraciones que pertenecen a este día
          const dayConfigs = allConfigs.filter((config: ExerciseConfigurationDAO) => 
            config.workout_day_exercise_id === workoutDay.id
          )
          console.log('Configuraciones del día:', dayConfigs)
          
          // Obtener los ejercicios para cada configuración
          const exerciseConfigs = await Promise.all(
            dayConfigs.map(async (config: ExerciseConfigurationDAO) => {
              console.log('Obteniendo ejercicio para configuración:', config)
              const exercise = await getExerciseById(config.exercise_id)
              console.log('Ejercicio obtenido:', exercise)
              
              return {
                exercise,
                config
              }
            })
          )

          console.log('Ejercicios del día:', exerciseConfigs)

          return {
            weekDay,
            exercises: exerciseConfigs,
            workoutDayId: workoutDay.id
          }
        })
      )

      console.log('Datos finales:', daysData)
      setDaysWithExercises(daysData)
    } catch (error) {
      console.error('Error detallado al cargar detalles del plan:', error)
      setError('Error al cargar los detalles del plan de entrenamiento')
    } finally {
      setLoading(false)
    }
  }

  const loadWeekDays = async () => {
    try {
      const days = await getWeekDays()
      setWeekDays(days)
    } catch (error) {
      console.error('Error al cargar días de la semana:', error)
    }
  }

  const handleAddExercise = async () => {
    if (!selectedDay || !newExercise.exercise_id) {
      Alert.alert('Error', 'Por favor selecciona un día y un ejercicio')
      return
    }

    try {
      const config = await createExerciseConfiguration({
        ...newExercise,
        workout_day_exercise_id: selectedDay
      })

      await loadTrainingPlanDetails()
      setIsEditing(false)
      setSelectedDay(null)
      setNewExercise({
        exercise_id: 0,
        sets: 3,
        repsHigh: 10,
        repsLow: 8,
        rest: 60,
        notes: ''
      })
    } catch (error) {
      console.error('Error al agregar ejercicio:', error)
      Alert.alert('Error', 'No se pudo agregar el ejercicio')
    }
  }

  const handleUpdateExercise = async (configId: number, updatedConfig: ExerciseConfigurationDAO) => {
    try {
      await updateExerciseConfiguration(configId, updatedConfig)
      await loadTrainingPlanDetails()
    } catch (error) {
      console.error('Error al actualizar ejercicio:', error)
      Alert.alert('Error', 'No se pudo actualizar el ejercicio')
    }
  }

  const handleDeleteExercise = async (configId: number) => {
    try {
      await deleteExerciseConfiguration(configId)
      await loadTrainingPlanDetails()
    } catch (error) {
      console.error('Error al eliminar ejercicio:', error)
      Alert.alert('Error', 'No se pudo eliminar el ejercicio')
    }
  }

  const handleAddDay = async () => {
    try {
      // Encontrar el primer día de la semana que no esté asignado
      const assignedDays = daysWithExercises.map(d => d.weekDay.id)
      const availableDay = weekDays.find(day => !assignedDays.includes(day.id))
      
      if (!availableDay) {
        Alert.alert('Error', 'No hay más días disponibles para agregar')
        return
      }

      await createWorkoutDayExercise({
        week_day_id: availableDay.id!,
        training_plan_id: Number(id)
      })

      await loadTrainingPlanDetails()
    } catch (error) {
      console.error('Error al agregar día:', error)
      Alert.alert('Error', 'No se pudo agregar el día')
    }
  }

  const handleDeleteDay = async (workoutDayId: number) => {
    try {
      await deleteWorkoutDayExercise(workoutDayId)
      await loadTrainingPlanDetails()
    } catch (error) {
      console.error('Error al eliminar día:', error)
      Alert.alert('Error', 'No se pudo eliminar el día')
    }
  }

  const sortDaysOfWeek = (days: DayWithExercises[]) => {
    const dayOrder: Record<string, number> = {
      'Lunes': 1,
      'Martes': 2,
      'Miércoles': 3,
      'Jueves': 4,
      'Viernes': 5,
      'Sábado': 6,
      'Domingo': 7
    };
    
    return [...days].sort((a, b) => {
      return dayOrder[a.weekDay.name] - dayOrder[b.weekDay.name];
    });
  };

  const handleUpdateRoutine = async () => {
    try {
      if (!trainingPlan?.id) return;

      await updateTrainingPlan(trainingPlan.id, {
        ...trainingPlan,
        name: editingRoutine.name,
        description: editingRoutine.description,
        is_visible: editingRoutine.is_visible
      })

      await loadTrainingPlanDetails()
      setIsEditing(false)
    } catch (error) {
      console.error('Error al actualizar rutina:', error)
      Alert.alert('Error', 'No se pudo actualizar la rutina')
    }
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
          onPress={loadTrainingPlanDetails}
        >
          <Text className="text-white font-bold">Reintentar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1F2937' }}>
      <ScrollView className="flex-1 p-5 bg-gray-100">
        {trainingPlan && (
          <View className="mb-6">
            <View className="flex-row justify-between items-center flex-wrap">
              <View className="flex-1 min-w-[200px]">
                {isEditing ? (
                  <View>
                    <TextInput
                      className="border border-gray-300 p-2 rounded-lg mb-2"
                      value={editingRoutine.name}
                      onChangeText={(text) => setEditingRoutine({...editingRoutine, name: text})}
                      placeholder="Nombre de la rutina"
                    />
                    <TextInput
                      className="border border-gray-300 p-2 rounded-lg mb-2"
                      value={editingRoutine.description}
                      onChangeText={(text) => setEditingRoutine({...editingRoutine, description: text})}
                      placeholder="Descripción"
                      multiline
                    />
                    <View className="flex-row items-center mb-2">
                      <Text className="mr-2">Visible:</Text>
                      <TouchableOpacity
                        onPress={() => setEditingRoutine({...editingRoutine, is_visible: !editingRoutine.is_visible})}
                        className={`p-2 rounded-lg ${editingRoutine.is_visible ? 'bg-green-500' : 'bg-red-500'}`}
                      >
                        <Ionicons 
                          name={editingRoutine.is_visible ? "eye" : "eye-off"} 
                          size={20} 
                          color="white" 
                        />
                      </TouchableOpacity>
                    </View>
                    <View className="flex-row space-x-2">
                      <TouchableOpacity 
                        className="bg-green-500 p-2 rounded-lg flex-1"
                        onPress={handleUpdateRoutine}
                      >
                        <Text className="text-white font-bold text-center">Guardar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        className="bg-red-500 p-2 rounded-lg flex-1"
                        onPress={() => setIsEditing(false)}
                      >
                        <Text className="text-white font-bold text-center">Cancelar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View>
                    <View className="flex-row items-center mb-2">
                      <Text className="text-2xl font-bold mr-2 text-black">{trainingPlan.name}</Text>
                      {trainingPlan.is_visible ? (
                        <Ionicons name="eye" size={20} color="green" />
                      ) : (
                        <Ionicons name="eye-off" size={20} color="red" />
                      )}
                    </View>
                    <Text className="text-gray-600 mb-2">{trainingPlan.description}</Text>
                    <View className="flex-row items-center">
                      <Ionicons name="person" size={16} color="gray" />
                      <Text className="text-gray-500 ml-1">{trainingPlan.user_email}</Text>
                    </View>
                  </View>
                )}
              </View>
              {isOwnerOrAdmin() && !isEditing && (
                <TouchableOpacity 
                  className="bg-blue-500 p-2 rounded-lg"
                  onPress={() => setIsEditing(true)}
                >
                  <Ionicons name="pencil" size={20} color="white" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {isOwnerOrAdmin() && (
          <View className="mb-4">
            <TouchableOpacity 
              className="bg-green-500 p-2 rounded-lg flex-row items-center justify-center"
              onPress={handleAddDay}
            >
              <Ionicons name="add" size={20} color="white" />
              <Text className="text-white font-bold ml-2">Agregar día</Text>
            </TouchableOpacity>
          </View>
        )}

        {sortDaysOfWeek(daysWithExercises).map((dayData, index) => (
          <View key={index} className="bg-white p-4 rounded-lg mb-4 shadow-md">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-xl font-bold">{dayData.weekDay.name}</Text>
              <View className="flex-row space-x-2">
                <TouchableOpacity 
                  className="bg-blue-500 p-2 rounded-lg"
                  onPress={() => {
                    console.log('Navegando a workout day:', dayData.workoutDayId);
                    router.push({
                      pathname: '/account/rutines/workout_day/[id]',
                      params: { id: dayData.workoutDayId }
                    });
                  }}
                >
                  <Ionicons name="eye" size={20} color="white" />
                </TouchableOpacity>
                {isOwnerOrAdmin() && canDelete() && (
                  <TouchableOpacity 
                    onPress={() => handleDeleteDay(dayData.workoutDayId)}
                    className="bg-red-500 p-2 rounded-lg"
                  >
                    <Ionicons name="trash" size={20} color="white" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            
            {dayData.exercises.length === 0 ? (
              <View className="p-3 bg-yellow-50 rounded-lg">
                <Text className="text-yellow-800 text-center">
                  No hay ejercicios configurados para este día
                </Text>
              </View>
            ) : (
              <View className="space-y-2">
                {dayData.exercises.map((exerciseData, exIndex) => (
                  <View key={exIndex} className="p-2 bg-gray-50 rounded-lg">
                    <Text className="text-lg font-semibold">{exerciseData.exercise.name}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

export default TrainingPlanDetail
