import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { GymDAO, UserGymDAO } from '../../../interfaces/gym'
import { deleteGymByUser, getGymUsers, getGymByUser, deleteUserGymById } from '../../../lib/gym'
import { useAuth } from '../../../context/AuthStore'
import { router, useFocusEffect } from 'expo-router'

const MyGym = () => {
  const { checkAuth, user, fetchUserData } = useAuth()
  const [loading, setLoading] = useState(true)
  const [gym, setGym] = useState<GymDAO | null>(null)
  const [users, setUsers] = useState<UserGymDAO[]>([])

  useFocusEffect(
    React.useCallback(() => {
      fetchGym()
    }, [])
  )

  const fetchGym = async () => {
    try {
      setLoading(true)
      const isAuthenticated = await checkAuth()
      if (!isAuthenticated) {
        router.replace('/')
        return
      }

      await fetchUserData()

      if (!user?.email) {
        throw new Error('No se pudo obtener la información del usuario')
      }

      const response = await getGymByUser()
      if (response) {
        setGym(response)
        await Promise.all([
          fetchUsers(),
        ])
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

  const fetchUsers = async () => {
    try {
      const response = await getGymUsers()
      setUsers(response)
    } catch (error) {
      console.error('Error al obtener usuarios:', error)
    }
  }

  const handleDeleteGym = async () => {
    try {
      await deleteGymByUser()
      setGym(null)
      router.replace('/account/dashboardGym/createGym')
      Alert.alert('Éxito', 'Gimnasio eliminado correctamente')
    } catch (error) {
      console.error('Error al eliminar gimnasio:', error)
      Alert.alert('Error', 'No se pudo eliminar el gimnasio. Por favor, intenta de nuevo.')
    }
  }

  const handleDeleteUser = async (userEmail: string) => {
    if (!gym?.id) return

    Alert.alert(
      'Eliminar Usuario',
      '¿Estás seguro de que deseas eliminar este usuario del gimnasio?',
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
              if (!gym?.id) throw new Error('ID del gimnasio no disponible')
              await deleteUserGymById(gym.id, userEmail)
              await fetchUsers() // Recargar la lista de usuarios
              Alert.alert('Éxito', 'Usuario eliminado correctamente')
            } catch (error) {
              console.error('Error al eliminar usuario:', error)
              Alert.alert('Error', 'No se pudo eliminar el usuario. Por favor, intenta de nuevo.')
            }
          }
        }
      ]
    )
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
            <Ionicons name="people" size={20} color="#666" />
            <Text className="ml-2 text-gray-600">
              Usuarios: {gym.current_users} / {gym.max_users}
            </Text>
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

        {/* Users Section */}
        <View className="bg-white p-4 rounded-lg mb-4 shadow-md">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold">Usuarios</Text>
            <TouchableOpacity 
              className="bg-blue-500 p-2 rounded-lg"
              onPress={() => router.push('/account/dashboardGym/addUser')}
            >
              <Text className="text-white font-bold">Agregar Usuario</Text>
            </TouchableOpacity>
          </View>

          {users.length === 0 ? (
            <Text className="text-gray-500 text-center py-4">No hay usuarios registrados</Text>
          ) : (
            users.map((user, index) => (
              <View
                key={index}
                className="border-b border-gray-200 py-3"
              >
                <View className="flex-row justify-between items-center">
                  <TouchableOpacity
                    className="flex-1"
                    onPress={() => {
                      if (!user.id || isNaN(Number(user.id))) {
                        Alert.alert('Error', 'ID de usuario inválido');
                        return;
                      }
                      router.push({
                        pathname: '/account/dashboardGym/[id]',
                        params: { id: user.id }
                      });
                    }}
                  >
                    <View>
                      <Text className="font-bold">{user.user_email}</Text>
                      <Text className="text-gray-600">
                        {new Date(user.start_date).toLocaleDateString()} - {new Date(user.final_date).toLocaleDateString()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View className="flex-row items-center">
                    {user.is_premium && (
                      <View className="bg-yellow-100 px-2 py-1 rounded-full mr-2">
                        <Text className="text-yellow-800 text-xs">Premium</Text>
                      </View>
                    )}
                    <TouchableOpacity
                      onPress={() => handleDeleteUser(user.user_email)}
                      className="bg-red-500 p-2 rounded-full ml-2"
                    >
                      <Ionicons name="trash" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default MyGym