import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { SpecificMuscleDAO, MuscleDAO } from '../../../interfaces/interfaces'
import { getSpecificMuscles, putSpecificMuscle, deleteSpecificMuscle, postSpecificMuscle, getMuscles } from '../../../lib/api_gymhouse'
import { useAuth } from '../../../context/AuthStore'
import { router } from 'expo-router'

const SpecificMuscle = () => {
  const { checkAuth } = useAuth()
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [selectedSpecificMuscle, setSelectedSpecificMuscle] = useState<SpecificMuscleDAO | null>(null)
  const [newSpecificMuscle, setNewSpecificMuscle] = useState<Omit<SpecificMuscleDAO, 'id'>>({
    name: '',
    description: '',
    muscle_id: 1
  })
  const [loading, setLoading] = useState(true)
  const [specificMuscles, setSpecificMuscles] = useState<SpecificMuscleDAO[]>([])
  const [muscles, setMuscles] = useState<MuscleDAO[]>([])

  useEffect(() => {
    fetchSpecificMuscles()
    fetchMuscles()
  }, [])

  const fetchSpecificMuscles = async () => {
    try {
      setLoading(true)
      const isAuthenticated = await checkAuth()
      if (!isAuthenticated) {
        router.replace('/')
        return
      }

      const response = await getSpecificMuscles()
      setSpecificMuscles(response)
    } catch (error) {
      console.error('Error al obtener músculos específicos:', error)
      if (error instanceof Error && error.message.includes('Sesión expirada')) {
        router.replace('/')
      } else {
        Alert.alert('Error', 'No se pudieron cargar los músculos específicos. Por favor, intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchMuscles = async () => {
    try {
      const response = await getMuscles()
      setMuscles(response)
    } catch (error) {
      console.error('Error al obtener músculos:', error)
    }
  }

  const handleAddSpecificMuscle = async () => {
    try {
      await postSpecificMuscle(newSpecificMuscle)
      await fetchSpecificMuscles()
      setNewSpecificMuscle({
        name: '',
        description: '',
        muscle_id: 1
      })
      setAddModalVisible(false)
      Alert.alert('Éxito', 'Músculo específico creado correctamente')
    } catch (error) {
      console.error('Error al crear músculo específico:', error)
      Alert.alert('Error', 'No se pudo crear el músculo específico. Por favor, intenta de nuevo.')
    }
  }

  const handleDeleteSpecificMuscle = async (id: number) => {
    try {
      await deleteSpecificMuscle(id)
      await fetchSpecificMuscles()
      Alert.alert('Éxito', 'Músculo específico eliminado correctamente')
    } catch (error) {
      console.error('Error al eliminar músculo específico:', error)
      Alert.alert('Error', 'No se pudo eliminar el músculo específico. Por favor, intenta de nuevo.')
    }
  }

  const handleEditSpecificMuscle = (specificMuscle: SpecificMuscleDAO) => {
    setSelectedSpecificMuscle(specificMuscle)
    setEditModalVisible(true)
  }

  const handleUpdateSpecificMuscle = async () => {
    if (!selectedSpecificMuscle?.id) return
    
    try {
      await putSpecificMuscle(selectedSpecificMuscle.id, selectedSpecificMuscle)
      await fetchSpecificMuscles()
      setEditModalVisible(false)
      Alert.alert('Éxito', 'Músculo específico actualizado correctamente')
    } catch (error) {
      console.error('Error al actualizar músculo específico:', error)
      Alert.alert('Error', 'No se pudo actualizar el músculo específico. Por favor, intenta de nuevo.')
    }
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <View className="flex-1 p-5 bg-gray-100">
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-2xl font-bold">Músculos Específicos</Text>
        <TouchableOpacity 
          className="bg-blue-500 p-2.5 rounded-lg"
          onPress={() => setAddModalVisible(true)}
        >
          <Text className="text-white font-bold">Agregar Músculo Específico</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {specificMuscles.map(specificMuscle => (
          <View key={specificMuscle.id} className="bg-white p-4 rounded-lg mb-2.5 flex-row justify-between items-center shadow-md">
            <View className="flex-1">
              <Text className="text-lg font-bold">{specificMuscle.name}</Text>
              <Text className="text-gray-600">{specificMuscle.description}</Text>
              <Text className="text-blue-500 mt-1">
                Músculo: {muscles.find(m => m.id === specificMuscle.muscle_id)?.name || 'No especificado'}
              </Text>
            </View>
            <View className="flex-row">
              <TouchableOpacity 
                onPress={() => handleEditSpecificMuscle(specificMuscle)}
                className="mr-2.5"
              >
                <Ionicons name="pencil" size={24} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => specificMuscle.id && handleDeleteSpecificMuscle(specificMuscle.id)}
                className="ml-2.5"
              >
                <Ionicons name="trash" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal para agregar músculo específico */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-5 rounded-lg w-4/5">
            <Text className="text-xl font-bold mb-4">Nuevo Músculo Específico</Text>
            <TextInput
              className="border border-gray-300 p-2.5 rounded-lg mb-2.5"
              placeholder="Nombre del músculo específico"
              value={newSpecificMuscle.name}
              onChangeText={(text) => setNewSpecificMuscle({...newSpecificMuscle, name: text})}
            />
            <TextInput
              className="border border-gray-300 p-2.5 rounded-lg mb-2.5 h-24"
              placeholder="Descripción"
              value={newSpecificMuscle.description}
              onChangeText={(text) => setNewSpecificMuscle({...newSpecificMuscle, description: text})}
              multiline={true}
              numberOfLines={4}
            />
            <View className="border border-gray-300 rounded-lg mb-2.5">
              <Picker
                selectedValue={newSpecificMuscle.muscle_id}
                onValueChange={(value: number) => setNewSpecificMuscle({...newSpecificMuscle, muscle_id: value})}
                style={{ height: 50 }}
              >
                {muscles.map(muscle => (
                  <Picker.Item 
                    key={muscle.id} 
                    label={muscle.name} 
                    value={muscle.id} 
                  />
                ))}
              </Picker>
            </View>
            <View className="flex-row justify-end mt-4">
              <TouchableOpacity 
                className="bg-red-500 p-2.5 rounded-lg mr-2.5"
                onPress={() => setAddModalVisible(false)}
              >
                <Text className="text-white font-bold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-blue-500 p-2.5 rounded-lg"
                onPress={handleAddSpecificMuscle}
              >
                <Text className="text-white font-bold">Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para editar músculo específico */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-5 rounded-lg w-4/5">
            <Text className="text-xl font-bold mb-4">Editar Músculo Específico</Text>
            <TextInput
              className="border border-gray-300 p-2.5 rounded-lg mb-2.5"
              placeholder="Nombre del músculo específico"
              value={selectedSpecificMuscle?.name}
              onChangeText={(text) => selectedSpecificMuscle && setSelectedSpecificMuscle({...selectedSpecificMuscle, name: text})}
            />
            <TextInput
              className="border border-gray-300 p-2.5 rounded-lg mb-2.5 h-24"
              placeholder="Descripción"
              value={selectedSpecificMuscle?.description}
              onChangeText={(text) => selectedSpecificMuscle && setSelectedSpecificMuscle({...selectedSpecificMuscle, description: text})}
              multiline={true}
              numberOfLines={4}
            />
            <View className="border border-gray-300 rounded-lg mb-2.5">
              <Picker
                selectedValue={selectedSpecificMuscle?.muscle_id}
                onValueChange={(value: number) => selectedSpecificMuscle && setSelectedSpecificMuscle({...selectedSpecificMuscle, muscle_id: value})}
                style={{ height: 50 }}
              >
                {muscles.map(muscle => (
                  <Picker.Item 
                    key={muscle.id} 
                    label={muscle.name} 
                    value={muscle.id} 
                  />
                ))}
              </Picker>
            </View>
            <View className="flex-row justify-end mt-4">
              <TouchableOpacity 
                className="bg-red-500 p-2.5 rounded-lg mr-2.5"
                onPress={() => setEditModalVisible(false)}
              >
                <Text className="text-white font-bold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-blue-500 p-2.5 rounded-lg"
                onPress={handleUpdateSpecificMuscle}
              >
                <Text className="text-white font-bold">Actualizar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default SpecificMuscle