import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { GymDAO } from '../../../interfaces/interfaces'
import { getUserGym, deleteUserGym } from '../../../lib/api_gymhouse'
import { useAuth } from '../../../context/AuthStore'
import { router } from 'expo-router'

const MyGym = () => {
  const { checkAuth } = useAuth()
  const [loading, setLoading] = useState(true)
  const [gym, setGym] = useState<GymDAO | null>(null)

  useEffect(() => {
    fetchGym()
  }, [])

  const fetchGym = async () => {
    try {
      setLoading(true)
      const isAuthenticated = await checkAuth()
      if (!isAuthenticated) {
        router.replace('/')
        return
      }

      const response = await getUserGym()
      if (response) {
        setGym(response)
      } else {
        router.replace('/account/dashboardGym/createGym')
      }
    } catch (error) {
      console.error('Error al obtener gimnasio:', error)
      if (error instanceof Error && error.message.includes('Sesión expirada')) {
        router.replace('/')
      } else {
        Alert.alert('Error', 'No se pudo cargar la información del gimnasio. Por favor, intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteGym = async () => {
    try {
      await deleteUserGym()
      setGym(null)
      router.replace('/account/dashboardGym/createGym')
      Alert.alert('Éxito', 'Gimnasio eliminado correctamente')
    } catch (error) {
      console.error('Error al eliminar gimnasio:', error)
      Alert.alert('Error', 'No se pudo eliminar el gimnasio. Por favor, intenta de nuevo.')
    }
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  if (!gym) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl text-gray-600">No tienes un gimnasio registrado</Text>
        <TouchableOpacity 
          className="bg-blue-500 p-4 rounded-lg mt-4"
          onPress={() => router.push('/account/dashboardGym/createGym')}
        >
          <Text className="text-white font-bold">Crear Gimnasio</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View className="flex-1 p-5 bg-gray-100">
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-2xl font-bold">Mi Gimnasio</Text>
        <TouchableOpacity 
          className="bg-red-500 p-2.5 rounded-lg"
          onPress={() => {
            Alert.alert(
              'Eliminar Gimnasio',
              '¿Estás seguro de que deseas eliminar este gimnasio?',
              [
                {
                  text: 'Cancelar',
                  style: 'cancel'
                },
                {
                  text: 'Eliminar',
                  style: 'destructive',
                  onPress: handleDeleteGym
                }
              ]
            )
          }}
        >
          <Text className="text-white font-bold">Eliminar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        <View className="bg-white p-4 rounded-lg mb-2.5 shadow-md">
          <Text className="text-xl font-bold mb-2">{gym.name}</Text>
          <Text className="text-gray-600 mb-2">{gym.description}</Text>
          
          <View className="flex-row items-center mb-2">
            <Ionicons name="location" size={20} color="#666" />
            <Text className="ml-2 text-gray-600">{gym.address}, {gym.city}, {gym.country}</Text>
          </View>

          <View className="flex-row items-center mb-2">
            <Ionicons name="time" size={20} color="#666" />
            <Text className="ml-2 text-gray-600">{gym.open_time} - {gym.close_time}</Text>
          </View>

          <View className="flex-row items-center mb-2">
            <Ionicons name="call" size={20} color="#666" />
            <Text className="ml-2 text-gray-600">{gym.phone}</Text>
          </View>

          <View className="flex-row items-center mb-2">
            <Ionicons name="mail" size={20} color="#666" />
            <Text className="ml-2 text-gray-600">{gym.email}</Text>
          </View>

          <View className="flex-row items-center mb-2">
            <Ionicons name="globe" size={20} color="#666" />
            <Text className="ml-2 text-gray-600">{gym.website}</Text>
          </View>

          <View className="flex-row items-center mb-2">
            <Ionicons name="cash" size={20} color="#666" />
            <Text className="ml-2 text-gray-600">${gym.price}</Text>
          </View>

          <View className="flex-row items-center mb-2">
            <Ionicons name="calendar" size={20} color="#666" />
            <Text className="ml-2 text-gray-600">
              {new Date(gym.start_date).toLocaleDateString()} - {new Date(gym.final_date).toLocaleDateString()}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="checkmark-circle" size={20} color={gym.is_active ? "#4CAF50" : "#F44336"} />
            <Text className="ml-2 text-gray-600">
              {gym.is_active ? 'Activo' : 'Inactivo'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default MyGym