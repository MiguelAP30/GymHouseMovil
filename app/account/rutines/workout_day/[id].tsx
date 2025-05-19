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
  getExercises
} from '../../../../lib/exercise'
import { ExerciseConfigurationDAO, ExerciseDAO, WeekDayDAO } from '../../../../interfaces/exercise'
import { ROLES } from '../../../../interfaces/user'
import { WorkoutDayExerciseDAO } from '../../../../interfaces/training'
import { Picker } from '@react-native-picker/picker'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'

interface ExerciseWithConfig {
  exercise: ExerciseDAO;
  config: ExerciseConfigurationDAO;
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
  const [newExercise, setNewExercise] = useState({
    exercise_id: 0,
    sets: 3,
    repsHigh: 10,
    repsLow: 8,
    rest: 60,
    notes: ''
  })

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
      loadAllExercises()
    }
  }, [id])

  const loadAllExercises = async () => {
    try {
      const response = await getExercises()
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
          return {
            exercise,
            config
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
        notes: ''
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
      notes: exerciseData.config.notes || ''
    })
    setIsEditing(true)
    setIsModalVisible(true)
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
            {workoutDay?.permissions?.can_edit && (
              <TouchableOpacity 
                className="bg-green-500 p-2 rounded-lg"
                onPress={() => {
                  setIsEditing(false)
                  setSelectedConfig(null)
                  setNewExercise({
                    exercise_id: 0,
                    sets: 3,
                    repsHigh: 10,
                    repsLow: 8,
                    rest: 60,
                    notes: ''
                  })
                  setIsModalVisible(true)
                }}
              >
                <Ionicons name="add" size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {exercises.length === 0 ? (
          <View className="p-3 bg-yellow-50 rounded-lg">
            <Text className="text-yellow-800 text-center">
              No hay ejercicios configurados para este día
            </Text>
          </View>
        ) : (
          exercises.map((exerciseData, index) => (
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
            </View>
          ))
        )}

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
                
                <View className="mb-2">
                  <Text className="text-gray-600 mb-1">Ejercicio</Text>
                  <View className="border border-gray-300 rounded-lg">
                    <Picker
                      selectedValue={newExercise.exercise_id}
                      onValueChange={(value) => setNewExercise({...newExercise, exercise_id: value})}
                      enabled={!isEditing}
                    >
                      <Picker.Item label="Selecciona un ejercicio" value={0} />
                      {allExercises.map(exercise => (
                        <Picker.Item 
                          key={exercise.id} 
                          label={exercise.name} 
                          value={exercise.id} 
                        />
                      ))}
                    </Picker>
                  </View>
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
                      if (num >= 1 && num <= 100) {
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
                      if (num >= 1 && num <= 100) {
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
                      if (num >= 1 && num <= 1000) {
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
      </ScrollView>
    </SafeAreaView>
  )
}

export default WorkoutDayDetail
