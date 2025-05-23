import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Modal, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useLocalSearchParams, router } from 'expo-router'
import { useAuth } from '../../../context/AuthStore'
import { getUserGymById, updateUserGymById, createGymTrainingPlan } from '../../../lib/gym'
import { getUserDataByEmail } from '../../../lib/user'
import { getTrainingPlansByUserEmail, getTagOfTrainingPlans } from '../../../lib/training'
import { UserGymDAO } from '../../../interfaces/gym'
import { UserDAO } from '../../../interfaces/user'
import { TrainingPlanDAO, TagOfTrainingPlanDAO } from '../../../interfaces/training'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Picker } from '@react-native-picker/picker'

const UserGymDetails = () => {
  const { id } = useLocalSearchParams()
  const { checkAuth } = useAuth()
  const [loading, setLoading] = useState(true)
  const [userGym, setUserGym] = useState<UserGymDAO | null>(null)
  const [userData, setUserData] = useState<UserDAO | null>(null)
  const [routines, setRoutines] = useState<TrainingPlanDAO[]>([])
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isCreateRoutineModalVisible, setIsCreateRoutineModalVisible] = useState(false)
  const [newFinalDate, setNewFinalDate] = useState<Date>(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [tags, setTags] = useState<TagOfTrainingPlanDAO[]>([])
  const [newRoutine, setNewRoutine] = useState({
    name: '',
    description: '',
    is_visible: true,
    tag_of_training_plan_id: null as number | null,
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      loadUserData()
      loadTags()
    }
  }, [id])

  const loadTags = async () => {
    try {
      const response = await getTagOfTrainingPlans()
      setTags(response)
      if (response.length > 0) {
        setNewRoutine(prev => ({
          ...prev,
          tag_of_training_plan_id: response[0].id
        }))
      }
    } catch (error) {
      console.error('Error al cargar etiquetas:', error)
    }
  }

  const loadUserData = async () => {
    try {
      setLoading(true)
      const isAuthenticated = await checkAuth()
      if (!isAuthenticated) {
        router.replace('/')
        return
      }

      console.log("------------------------------ \n" )
      console.log("ID recibido:", id)
      console.log("------------------------------ \n" )


      if (!id || typeof id !== 'string') {
        throw new Error('ID de usuario no proporcionado')
      }

      const userId = Number(id)
      console.log("------------------------------ \n" )
      console.log("ID convertido:", userId)
      console.log("------------------------------ \n" )

      if (isNaN(userId)) {
        throw new Error('ID de usuario inválido')
      }

      const response = await getUserGymById(userId)
      if (response && response.data) {
        setUserGym(response.data)

        if (response.data.user_email) {
          const [userResponse, routinesResponse] = await Promise.all([
            getUserDataByEmail(response.data.user_email),
            getTrainingPlansByUserEmail(response.data.user_email)
          ])
          setUserData(userResponse)
          setRoutines(routinesResponse)
        }
      } else {
        throw new Error('No se encontraron datos del usuario')
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error)
      Alert.alert(
        'Error',
        'No se pudieron cargar los datos del usuario. Por favor, intenta de nuevo.',
        [
          {
            text: 'Volver',
            onPress: () => router.back()
          }
        ]
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRoutine = async () => {
    if (!validateRoutineForm() || !userGym?.user_email) return

    try {
      const routineData = {
        name: newRoutine.name,
        description: newRoutine.description,
        is_visible: newRoutine.is_visible,
        tag_of_training_plan_id: newRoutine.tag_of_training_plan_id!,
        user_email: userGym.user_email
      }

      console.log('Enviando datos de la rutina:', routineData)
      const response = await createGymTrainingPlan(routineData)
      console.log('Respuesta del servidor:', response)
      
      if (response && response.data) {
        setIsCreateRoutineModalVisible(false)
        setNewRoutine({
          name: '',
          description: '',
          is_visible: true,
          tag_of_training_plan_id: null
        })
        Alert.alert(
          'Éxito',
          'Rutina creada correctamente',
          [
            {
              text: 'OK',
              onPress: () => {
                loadUserData() // Recargar los datos
              }
            }
          ]
        )
      } else {
        console.error('Respuesta inválida del servidor:', response)
        setError('Error al crear la rutina')
      }
    } catch (error) {
      console.error('Error al crear rutina:', error)
      setError('Error al crear la rutina')
    }
  }

  const handleViewRoutine = (routineId: number) => {
    router.push(`/account/rutines/${routineId}`)
  }

  const handleUpdateUserGym = async () => {
    if (!userGym?.id) return

    try {
      await updateUserGymById(userGym.id, {
        final_date: newFinalDate
      })
      
      // Actualizar el estado local
      setUserGym(prev => prev ? {
        ...prev,
        final_date: newFinalDate
      } : null)
      
      setIsEditModalVisible(false)
      Alert.alert('Éxito', 'Fecha de finalización actualizada correctamente')
    } catch (error) {
      console.error('Error al actualizar UserGym:', error)
      Alert.alert('Error', 'No se pudo actualizar la fecha de finalización')
    }
  }

  const validateRoutineForm = () => {
    if (!newRoutine.name.trim()) {
      setError('El nombre es requerido')
      return false
    }
    if (newRoutine.name.length > 50) {
      setError('El nombre no puede tener más de 50 caracteres')
      return false
    }
    if (newRoutine.description.length > 500) {
      setError('La descripción no puede tener más de 500 caracteres')
      return false
    }
    if (!newRoutine.tag_of_training_plan_id) {
      setError('Debes seleccionar una etiqueta')
      return false
    }
    return true
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  if (!userGym || !userData) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-gray-600 text-center mb-4">No se encontraron datos del usuario</Text>
        <TouchableOpacity 
          className="bg-blue-500 p-4 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-bold">Volver</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 p-5 bg-gray-100">
      <View className="bg-white p-4 rounded-lg mb-4 shadow-md">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold">Detalles del Usuario</Text>
          <TouchableOpacity 
            className="bg-blue-500 p-2 rounded-lg"
            onPress={() => setIsEditModalVisible(true)}
          >
            <Ionicons name="pencil" size={20} color="white" />
          </TouchableOpacity>
        </View>
        
        {/* Información del Usuario */}
        <View className="mb-4">
          <Text className="text-lg font-semibold mb-2">Información Personal</Text>
          <View className="space-y-2">
            <View className="flex-row items-center">
              <Ionicons name="person" size={20} color="#666" />
              <Text className="ml-2 text-gray-600">Nombre: {userData.name}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="mail" size={20} color="#666" />
              <Text className="ml-2 text-gray-600">Email: {userData.email}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="call" size={20} color="#666" />
              <Text className="ml-2 text-gray-600">Teléfono: {userData.phone}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="location" size={20} color="#666" />
              <Text className="ml-2 text-gray-600">Dirección: {userData.address}</Text>
            </View>
          </View>
        </View>

        {/* Información de Membresía */}
        <View className="mb-4">
          <Text className="text-lg font-semibold mb-2">Información de Membresía</Text>
          <View className="space-y-2">
            <View className="flex-row items-center">
              <Ionicons name="calendar" size={20} color="#666" />
              <Text className="ml-2 text-gray-600">
                Fecha de inicio: {new Date(userGym.start_date).toLocaleDateString()}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="calendar" size={20} color="#666" />
              <Text className="ml-2 text-gray-600">
                Fecha de finalización: {new Date(userGym.final_date).toLocaleDateString()}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="star" size={20} color={userGym.is_premium ? "#FFD700" : "#666"} />
              <Text className="ml-2 text-gray-600">
                Tipo de membresía: {userGym.is_premium ? 'Premium' : 'Regular'}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={20} color={userGym.is_active ? "#4CAF50" : "#F44336"} />
              <Text className="ml-2 text-gray-600">
                Estado: {userGym.is_active ? 'Activo' : 'Inactivo'}
              </Text>
            </View>
          </View>
        </View>

        {/* Permisos */}
        {userGym.permissions && (
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-2">Permisos</Text>
            <View className="space-y-2">
              <View className="flex-row items-center">
                <Ionicons name="create" size={20} color={userGym.permissions.can_edit ? "#4CAF50" : "#666"} />
                <Text className="ml-2 text-gray-600">
                  Puede editar: {userGym.permissions.can_edit ? 'Sí' : 'No'}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="trash" size={20} color={userGym.permissions.can_delete ? "#4CAF50" : "#666"} />
                <Text className="ml-2 text-gray-600">
                  Puede eliminar: {userGym.permissions.can_delete ? 'Sí' : 'No'}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Sección de Rutinas */}
      <View className="bg-white p-4 rounded-lg mb-4 shadow-md">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold">Rutinas del Usuario</Text>
          <TouchableOpacity 
            className="bg-green-500 p-2 rounded-lg"
            onPress={() => setIsCreateRoutineModalVisible(true)}
          >
            <Text className="text-white font-bold">Crear Rutina</Text>
          </TouchableOpacity>
        </View>

        {routines.length === 0 ? (
          <Text className="text-gray-500 text-center py-4">No hay rutinas creadas</Text>
        ) : (
          routines.map((routine, index) => (
            <View key={index} className="border-b border-gray-200 py-3">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="font-bold">{routine.name}</Text>
                  <Text className="text-gray-600">{routine.description}</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => handleViewRoutine(routine.id!)}
                  className={`p-2 rounded-full ${routine.is_gym_created ? 'bg-green-500' : 'bg-blue-500'}`}
                >
                  <Ionicons name="eye" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Modal para crear rutina */}
      <Modal
        visible={isCreateRoutineModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCreateRoutineModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-4 rounded-lg w-[90%] max-h-[80%]">
            <ScrollView>
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold">Crear Nueva Rutina</Text>
                <TouchableOpacity 
                  onPress={() => setIsCreateRoutineModalVisible(false)}
                  className="bg-red-500 p-2 rounded-full"
                >
                  <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>

              {error && (
                <View className="bg-red-100 p-4 rounded-lg mb-4">
                  <Text className="text-red-500">{error}</Text>
                </View>
              )}

              <Text className="text-lg font-bold mb-2">Nombre</Text>
              <TextInput
                className="border border-gray-300 p-2.5 rounded-lg mb-4"
                placeholder="Nombre de la rutina"
                value={newRoutine.name}
                onChangeText={(text) => setNewRoutine(prev => ({ ...prev, name: text }))}
                maxLength={50}
              />

              <Text className="text-lg font-bold mb-2">Descripción</Text>
              <TextInput
                className="border border-gray-300 p-2.5 rounded-lg mb-4"
                placeholder="Descripción de la rutina"
                value={newRoutine.description}
                onChangeText={(text) => setNewRoutine(prev => ({ ...prev, description: text }))}
                multiline
                numberOfLines={4}
                maxLength={500}
              />

              <Text className="text-lg font-bold mb-2">Etiqueta</Text>
              <View className="border border-gray-300 rounded-lg mb-4">
                <Picker
                  selectedValue={newRoutine.tag_of_training_plan_id}
                  onValueChange={(value) => setNewRoutine(prev => ({ ...prev, tag_of_training_plan_id: value }))}
                  style={{ height: 50 }}
                  mode="dropdown"
                >
                  <Picker.Item label="Selecciona una etiqueta" value={null} />
                  {tags.map(tag => (
                    <Picker.Item 
                      key={tag.id} 
                      label={tag.name} 
                      value={tag.id} 
                    />
                  ))}
                </Picker>
              </View>

              <View className="flex-row items-center mb-4">
                <TouchableOpacity
                  onPress={() => setNewRoutine(prev => ({ ...prev, is_visible: !prev.is_visible }))}
                  className="flex-row items-center"
                >
                  <View className={`w-6 h-6 rounded-md mr-2 ${newRoutine.is_visible ? 'bg-blue-500' : 'bg-gray-300'}`}>
                    {newRoutine.is_visible && (
                      <Ionicons name="checkmark" size={20} color="white" />
                    )}
                  </View>
                  <Text>Rutina visible para otros usuarios</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                className="bg-blue-500 p-3 rounded-lg"
                onPress={handleCreateRoutine}
              >
                <Text className="text-white font-bold text-center">Crear Rutina</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal para editar fecha final */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-4 rounded-lg w-[90%]">
            <Text className="text-xl font-bold mb-4">Editar Fecha de Finalización</Text>
            
            <TouchableOpacity
              className="border border-gray-300 p-2 rounded-lg mb-4"
              onPress={() => setShowDatePicker(true)}
            >
              <Text>
                {newFinalDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={newFinalDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false)
                  if (selectedDate) {
                    setNewFinalDate(selectedDate)
                  }
                }}
                minimumDate={new Date()}
              />
            )}

            <View className="flex-row space-x-2">
              <TouchableOpacity 
                className="flex-1 bg-blue-500 p-2 rounded-lg"
                onPress={handleUpdateUserGym}
              >
                <Text className="text-white font-bold text-center">Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-1 bg-red-500 p-2 rounded-lg"
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text className="text-white font-bold text-center">Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

export default UserGymDetails 