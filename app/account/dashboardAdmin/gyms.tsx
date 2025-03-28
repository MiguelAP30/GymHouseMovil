import { View, Text, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { getGym } from '../../../lib/api_gymhouse'
import { useAuth } from '../../../context/AuthStore'

interface Gym {
  email: string;
  id_number: string;
  website: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  is_active: boolean;
  open_time: string;
  close_time: string;
  role_id: number;
  price: number;
}

const Gyms = () => {
  const { checkAuth } = useAuth()
  const [gyms, setGyms] = useState<Gym[]>([])
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGyms = async () => {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    const response = await getGym()
    if (response) {
      setGyms(Array.isArray(response) ? response : [response])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchGyms()
  }, [])

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
          onPress={fetchGyms}
        >
          <Text className="text-white font-bold">Reintentar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const ContactInfoModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showContactModal}
      onRequestClose={() => setShowContactModal(false)}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-xl w-11/12 max-w-md">
          <Text className="text-2xl font-bold text-gray-800 mb-4">{selectedGym?.name}</Text>
          <View className="space-y-3">
            <View className="flex-row items-center">
              <Ionicons name="person-outline" size={24} color="#4B5563" />
              <Text className="text-gray-600 ml-3 text-lg">Sitio web: {selectedGym?.website}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="mail-outline" size={24} color="#4B5563" />
              <Text className="text-gray-600 ml-3 text-lg">Correo: {selectedGym?.email}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="call-outline" size={24} color="#4B5563" />
              <Text className="text-gray-600 ml-3 text-lg">Teléfono: {selectedGym?.phone}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={24} color="#4B5563" />
              <Text className="text-gray-600 ml-3 text-lg">Dirección: {selectedGym?.address}</Text>
            </View>
          </View>
          <TouchableOpacity 
            className="bg-blue-500 p-3 rounded-lg mt-6"
            onPress={() => setShowContactModal(false)}
          >
            <Text className="text-white text-center font-bold">Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )

  const DetailsModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showDetailsModal}
      onRequestClose={() => setShowDetailsModal(false)}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-xl w-11/12 max-w-md">
          <Text className="text-2xl font-bold text-gray-800 mb-4">{selectedGym?.name}</Text>
          <View className="space-y-3">
            <View className="flex-row items-center">
              <Ionicons name="globe-outline" size={24} color="#4B5563" />
              <Text className="text-gray-600 ml-3 text-lg">País: {selectedGym?.country}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={24} color="#4B5563" />
              <Text className="text-gray-600 ml-3 text-lg">Ciudad: {selectedGym?.city}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="cash-outline" size={24} color="#4B5563" />
              <Text className="text-gray-600 ml-3 text-lg">Precio: ${selectedGym?.price}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons 
                name="checkmark-circle" 
                size={24} 
                color={selectedGym?.is_active ? "#10B981" : "#EF4444"} 
              />
              <Text className={`ml-3 text-lg ${selectedGym?.is_active ? "text-green-600" : "text-red-600"}`}>
                Estado: {selectedGym?.is_active ? 'Activo' : 'Inactivo'}
              </Text>
            </View>
            {selectedGym?.open_time && (
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={24} color="#4B5563" />
                <Text className="text-gray-600 ml-3 text-lg">Apertura: {selectedGym.open_time}</Text>
              </View>
            )}
            {selectedGym?.close_time && (
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={24} color="#4B5563" />
                <Text className="text-gray-600 ml-3 text-lg">Cierre: {selectedGym.close_time}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity 
            className="bg-blue-500 p-3 rounded-lg mt-6"
            onPress={() => setShowDetailsModal(false)}
          >
            <Text className="text-white text-center font-bold">Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )

  return (
    <View className="flex-1 p-5 bg-gray-50">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-3xl font-bold text-gray-800">Gimnasios</Text>
      </View>

      <ScrollView className="flex-1">
        {gyms.map((gym, index) => (
          <View key={`gym-${index}`} className="bg-white p-6 rounded-xl mb-4 shadow-lg">
            <View className="flex-row justify-between items-center">
              <Text className="text-xl font-bold text-gray-800 flex-1 mr-4">{gym.name}</Text>
              <View className="flex-row space-x-4">
                <TouchableOpacity 
                  className="bg-blue-500 px-3 py-1.5 rounded-lg"
                  onPress={() => {
                    setSelectedGym(gym)
                    setShowContactModal(true)
                  }}
                >
                  <Text className="text-white text-sm">Contacto</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  className="bg-green-500 px-3 py-1.5 rounded-lg"
                  onPress={() => {
                    setSelectedGym(gym)
                    setShowDetailsModal(true)
                  }}
                >
                  <Text className="text-white text-sm">Detalles</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <ContactInfoModal />
      <DetailsModal />
    </View>
  )
}

export default Gyms