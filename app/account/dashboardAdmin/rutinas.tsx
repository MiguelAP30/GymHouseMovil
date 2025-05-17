import { View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useAuth } from '../../../context/AuthStore'
import { getTrainingPlans, deleteTrainingPlan, getTagOfTrainingPlans } from '../../../lib/training'
import { TrainingPlanDAO, TagOfTrainingPlanDAO, PaginatedResponse } from '../../../interfaces/training'
import { Picker } from '@react-native-picker/picker'
import Pagination from '../../../components/organisms/paginacion'
import { Ionicons } from '@expo/vector-icons'

const RutinasAdmin = () => {
  const router = useRouter()
  const { checkAuth, user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [routines, setRoutines] = useState<TrainingPlanDAO[]>([])
  const [tags, setTags] = useState<TagOfTrainingPlanDAO[]>([])
  const [searchName, setSearchName] = useState('')
  const [selectedTag, setSelectedTag] = useState<number | null>(null)
  const [maxDays, setMaxDays] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize] = useState(10)
  const [tempSearchName, setTempSearchName] = useState('')
  const [tempSelectedTag, setTempSelectedTag] = useState<number | null>(null)
  const [tempMaxDays, setTempMaxDays] = useState<string>('')
  const [selectedRole, setSelectedRole] = useState<number | null>(null)
  const [tempSelectedRole, setTempSelectedRole] = useState<number | null>(null)

  useEffect(() => {
    const loadData = async () => {
      const isAuthenticated = await checkAuth()
      if (!isAuthenticated) return

      await Promise.all([
        fetchRoutines(),
        fetchTags()
      ])
    }
    loadData()
  }, [currentPage, searchName, selectedTag, maxDays, selectedRole])

  const fetchRoutines = async () => {
    setLoading(true)
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    const response: PaginatedResponse<TrainingPlanDAO> = await getTrainingPlans(
      currentPage,
      pageSize,
      searchName.trim() || undefined,
      selectedRole || user?.role_id,
      selectedTag || undefined,
      maxDays || undefined
    )
    
    setRoutines(response.items)
    setTotalPages(response.pages)
    setError(null)
    setLoading(false)
  }

  const fetchTags = async () => {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    const response = await getTagOfTrainingPlans()
    setTags(response)
  }

  const handleSearch = async () => {
    setLoading(true)
    setSearchName(tempSearchName)
    setSelectedTag(tempSelectedTag)
    setSelectedRole(tempSelectedRole)
    
    // Convertir el valor de maxDays a número o null
    const maxDaysValue = tempMaxDays.trim() ? parseInt(tempMaxDays) : null
    setMaxDays(maxDaysValue)
    
    setCurrentPage(1)
    await fetchRoutines()
  }

  const handleClearFilters = async () => {
    setLoading(true)
    setTempSearchName('')
    setTempSelectedTag(null)
    setTempMaxDays('')
    setTempSelectedRole(null)
    setSearchName('')
    setSelectedTag(null)
    setMaxDays(null)
    setSelectedRole(null)
    setCurrentPage(1)
    await fetchRoutines()
  }

  const handleDeleteRoutine = async (id: number) => {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar esta rutina?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTrainingPlan(id)
              Alert.alert('Éxito', 'Rutina eliminada correctamente')
              await fetchRoutines()
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la rutina')
            }
          }
        }
      ]
    )
  }

  const handleEditRoutine = (id: number) => {
    // Aquí se implementaría la navegación a la pantalla de edición
    // Por ahora solo mostramos un mensaje
    Alert.alert('Editar', `Editar rutina con ID: ${id}`)
  }

  const handleViewRoutine = (id: number) => {
    // Aquí se implementaría la navegación a la pantalla de detalles
    // Por ahora solo mostramos un mensaje
    Alert.alert('Ver detalles', `Ver detalles de la rutina con ID: ${id}`)
  }

  const getRoleName = (roleId: number | undefined) => {
    if (!roleId) return 'Desconocido'
    
    switch (roleId) {
      case 4: return 'Administrativa'
      case 3: return 'Profesional'
      case 2: return 'Usuarios'
      default: return 'Desconocido'
    }
  }

  if (loading && routines.length === 0) {
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
          onPress={fetchRoutines}
        >
          <Text className="text-white font-bold">Reintentar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View className="flex-1 p-5 bg-gray-100">
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-2xl font-bold">Administrar Rutinas</Text>
        <TouchableOpacity 
          className="bg-blue-500 p-2.5 rounded-lg"
          onPress={() => router.push('/account/rutines/crearRutines')}
        >
          <Text className="text-white font-bold">Crear</Text>
        </TouchableOpacity>
      </View>

      {/* Search Section */}
      <View className="bg-white p-4 rounded-lg mb-4 shadow-md">
        <TextInput
          className="border border-gray-300 p-2.5 rounded-lg mb-2.5"
          placeholder="Buscar por nombre..."
          value={tempSearchName}
          onChangeText={setTempSearchName}
        />
        
        <View className="border border-gray-300 rounded-lg mb-2.5">
          <Picker
            selectedValue={tempSelectedTag}
            onValueChange={setTempSelectedTag}
            style={{ height: 50 }}
            mode="dropdown"
          >
            <Picker.Item label="Todas las etiquetas" value={null} />
            {tags.map(tag => (
              <Picker.Item 
                key={tag.id} 
                label={tag.name} 
                value={tag.id} 
              />
            ))}
          </Picker>
        </View>

        <View className="border border-gray-300 rounded-lg mb-2.5">
          <Picker
            selectedValue={tempSelectedRole}
            onValueChange={setTempSelectedRole}
            style={{ height: 50 }}
            mode="dropdown"
          >
            <Picker.Item label="Todos los roles" value={null} />
            <Picker.Item label="Administrativa" value={4} />
            <Picker.Item label="Profesional" value={3} />
            <Picker.Item label="Usuarios" value={2} />
          </Picker>
        </View>

        <TextInput
          className="border border-gray-300 p-2.5 rounded-lg mb-2.5"
          placeholder="Máximo de días (opcional)"
          value={tempMaxDays}
          onChangeText={setTempMaxDays}
          keyboardType="numeric"
        />

        <View className="flex-row space-x-2">
          <TouchableOpacity 
            className="flex-1 bg-blue-500 p-2.5 rounded-lg"
            onPress={handleSearch}
          >
            <Text className="text-white font-bold text-center">Buscar</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="flex-1 bg-gray-500 p-2.5 rounded-lg"
            onPress={handleClearFilters}
          >
            <Text className="text-white font-bold text-center">Limpiar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1">
        {routines.length === 0 ? (
          <View className="bg-white p-4 rounded-lg shadow-md">
            <Text className="text-center text-gray-500">No se encontraron rutinas</Text>
          </View>
        ) : (
          routines.map(routine => (
            <View key={routine.id} className="bg-white p-4 rounded-lg mb-2.5 shadow-md">
              <View className="flex-row justify-between">
                <View className="flex-1">
                  <Text className="text-lg font-bold">{routine.name}</Text>
                  <Text className="text-gray-600 mt-1">{routine.description}</Text>
                  <View className="flex-row items-center mt-2">
                    <View className="bg-blue-100 px-2 py-1 rounded-full">
                      <Text className="text-blue-800 text-xs">
                        {tags.find(t => t.id === routine.tag_of_training_plan_id)?.name || 'Sin etiqueta'}
                      </Text>
                    </View>
                    {!routine.is_visible && (
                      <View className="bg-gray-100 px-2 py-1 rounded-full ml-2">
                        <Text className="text-gray-800 text-xs">Privada</Text>
                      </View>
                    )}
                    <View className="bg-purple-100 px-2 py-1 rounded-full ml-2">
                      <Text className="text-purple-800 text-xs">
                        {getRoleName(user?.role_id)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              
              <View className="flex-row justify-end mt-3">
                <TouchableOpacity 
                  onPress={() => routine.id && handleViewRoutine(routine.id)}
                  className="mr-3"
                >
                  <Ionicons name="eye" size={24} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => routine.id && handleEditRoutine(routine.id)}
                  className="mr-3"
                >
                  <Ionicons name="pencil" size={24} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => routine.id && handleDeleteRoutine(routine.id)}
                >
                  <Ionicons name="trash" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </View>
  )
}

export default RutinasAdmin