import { View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { router } from 'expo-router'
import { useAuth } from '../../../context/AuthStore'
import { getTrainingPlans, getTagOfTrainingPlans,  } from '../../../lib/training'
import {getUserDataByEmail } from '../../../lib/user'
import { TrainingPlanDAO, TagOfTrainingPlanDAO } from '../../../interfaces/training'
import { ROLES, UserDAO } from '../../../interfaces/user'
import { Picker } from '@react-native-picker/picker'
import Pagination from '../../../components/organisms/paginacion'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context';

const Rutinas = () => {
  const { user } = useAuth()
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
  const [userRoles, setUserRoles] = useState<{[key: string]: number}>({})

  useEffect(() => {
    loadData()
  }, [currentPage, searchName, selectedTag, selectedRole, maxDays])

  const loadData = async () => {
    if (!user) {
      router.replace('/login')
      return
    }
    await fetchRoutines()
    await fetchTags()
  }

  const fetchRoutines = async () => {
    setLoading(true)
    try {
      const response = await getTrainingPlans(
        currentPage,
        pageSize,
        searchName || undefined,
        selectedRole === null ? undefined : selectedRole,
        selectedTag || undefined,
        maxDays || undefined
      )
      
      if (response && response.items) {
        setRoutines(response.items)
        setTotalPages(response.total_pages)

        // Obtener los roles de los usuarios que crearon las rutinas
        const uniqueEmails = [...new Set(response.items
          .map((routine: TrainingPlanDAO) => routine.user_email)
          .filter((email: unknown): email is string => typeof email === 'string')
        )];
        
        const roles: Record<string, number> = {};
        
        for (const email of uniqueEmails) {
          try {
            const userData = await getUserDataByEmail(email as any) as UserDAO;
            if (userData && 'role_id' in userData && typeof userData.role_id === 'number') {
              roles[email as any] = userData.role_id;
            }
          } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
          }
        }
        
        setUserRoles(roles)
      } else {
        setRoutines([])
        setTotalPages(1)
      }
    } catch (error) {
      console.error('Error al cargar rutinas:', error)
      setError('Error al cargar las rutinas')
    } finally {
      setLoading(false)
    }
  }

  const fetchTags = async () => {
    const response = await getTagOfTrainingPlans()
    setTags(response)
  }

  const handleSearch = async () => {
    setLoading(true)
    setSearchName(tempSearchName)
    setSelectedTag(tempSelectedTag === -1 ? null : tempSelectedTag)
    setSelectedRole(tempSelectedRole === -1 ? null : tempSelectedRole)
    
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

  const handleViewRoutine = (id: number) => {
    router.push(`/account/rutines/${id}`)
  }

  const getRoleName = (roleId: number | undefined) => {
    if (!roleId) return 'Desconocido'
    
    switch (roleId) {
      case 4: return 'Administrador'
      case 3: return 'Gimnasio'
      case 2: return 'Premium'
      case 1: return 'Usuario'
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1F2937' }}>
      <View className="flex-1 p-5 bg-gray-100">
        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-2xl font-bold">Rutinas</Text>
          <View className="flex-row space-x-2">
            <TouchableOpacity 
              className="bg-blue-500 p-2.5 rounded-lg"
              onPress={() => router.push('/account/rutines/misRutinas')}
            >
              <Text className="text-white font-bold">Mis Rutinas</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="bg-blue-500 p-2.5 rounded-lg"
              onPress={() => router.push('/account/rutines/crearRutines')}
            >
              <Text className="text-white font-bold">Crear</Text>
            </TouchableOpacity>
          </View>
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
              <Picker.Item label="Sin filtro" value={null} />
              <Picker.Item label="Todas las etiquetas" value={-1} />
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
              <Picker.Item label="Sin filtro" value={null} />
              <Picker.Item label="Todos los roles" value={-1} />
              {Object.entries(ROLES)
                .filter(([_, value]) => value !== ROLES.logued)
                .map(([key, value]) => (
                  <Picker.Item 
                    key={value} 
                    label={key} 
                    value={value} 
                  />
                ))}
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
                          {getRoleName(routine.user_email ? userRoles[routine.user_email] : undefined)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                
                <View className="flex-row justify-end mt-3">
                  <TouchableOpacity 
                    onPress={() => routine.id && handleViewRoutine(routine.id)}
                  >
                    <Ionicons name="eye" size={24} color="#007AFF" />
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
    </SafeAreaView>
  )
}

export default Rutinas