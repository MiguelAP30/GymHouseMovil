import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { MuscleDAO } from '../../../interfaces/interfaces'
import { getMuscles, putMuscle, deleteMuscle, postMuscle } from '../../../lib/api_gymhouse'
import { useAuth } from '../../../context/AuthStore'

const Muscles = () => {
  const { checkAuth } = useAuth()
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleDAO | null>(null)
  const [newMuscle, setNewMuscle] = useState<Omit<MuscleDAO, 'id'>>({
    name: '',
    description: ''
  })
  const [loading, setLoading] = useState(true)
  const [muscles, setMuscles] = useState<MuscleDAO[]>([])
  const [filteredMuscles, setFilteredMuscles] = useState<MuscleDAO[]>([])
  const [searchName, setSearchName] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMuscles()
  }, [])

  useEffect(() => {
    filterMuscles()
  }, [muscles, searchName])

  const filterMuscles = () => {
    let filtered = [...muscles]

    if (searchName.trim()) {
      filtered = filtered.filter(muscle => 
        muscle.name.toLowerCase().includes(searchName.toLowerCase())
      )
    }

    setFilteredMuscles(filtered)
  }

  const fetchMuscles = async () => {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    const response = await getMuscles()
    setMuscles(response)
    setLoading(false)
  }

  const handleAddMuscle = async () => {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    await postMuscle(newMuscle)
    await fetchMuscles()
    setNewMuscle({
      name: '',
      description: ''
    })
    setAddModalVisible(false)
    Alert.alert('Éxito', 'Músculo creado correctamente')
  }

  const handleDeleteMuscle = async (id: number) => {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    await deleteMuscle(id)
    await fetchMuscles()
    Alert.alert('Éxito', 'Músculo eliminado correctamente')
  }

  const handleEditMuscle = (muscle: MuscleDAO) => {
    setSelectedMuscle(muscle)
    setEditModalVisible(true)
  }

  const handleUpdateMuscle = async () => {
    if (!selectedMuscle?.id) return
    
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    await putMuscle(selectedMuscle.id, selectedMuscle)
    await fetchMuscles()
    setEditModalVisible(false)
    Alert.alert('Éxito', 'Músculo actualizado correctamente')
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
          onPress={fetchMuscles}
        >
          <Text className="text-white font-bold">Reintentar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View className="flex-1 p-5 bg-gray-100">
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-2xl font-bold">Músculos</Text>
        <TouchableOpacity 
          className="bg-blue-500 p-2.5 rounded-lg"
          onPress={() => setAddModalVisible(true)}
        >
          <Text className="text-white font-bold">Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Search Section */}
      <View className="bg-white p-4 rounded-lg mb-4 shadow-md">
        <TextInput
          className="border border-gray-300 p-2.5 rounded-lg mb-2.5"
          placeholder="Buscar por nombre..."
          value={searchName}
          onChangeText={setSearchName}
        />
        
        <TouchableOpacity 
          className="bg-gray-500 p-2.5 rounded-lg"
          onPress={() => setSearchName('')}
        >
          <Text className="text-white font-bold text-center">Limpiar filtros</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {filteredMuscles.map(muscle => (
          <View key={muscle.id} className="bg-white p-4 rounded-lg mb-2.5 flex-row justify-between items-center shadow-md">
            <View className="flex-1">
              <Text className="text-lg font-bold">{muscle.name}</Text>
              <Text className="text-gray-600">{muscle.description}</Text>
            </View>
            <View className="flex-row">
              <TouchableOpacity 
                onPress={() => handleEditMuscle(muscle)}
                className="mr-2.5"
              >
                <Ionicons name="pencil" size={24} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => muscle.id && handleDeleteMuscle(muscle.id)}
                className="ml-2.5"
              >
                <Ionicons name="trash" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal para agregar músculo */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-5 rounded-lg w-4/5">
            <Text className="text-xl font-bold mb-4">Nuevo Músculo</Text>
            <TextInput
              className="border border-gray-300 p-2.5 rounded-lg mb-2.5"
              placeholder="Nombre del músculo"
              value={newMuscle.name}
              onChangeText={(text) => setNewMuscle({...newMuscle, name: text})}
            />
            <TextInput
              className="border border-gray-300 p-2.5 rounded-lg mb-2.5 h-24"
              placeholder="Descripción"
              value={newMuscle.description}
              onChangeText={(text) => setNewMuscle({...newMuscle, description: text})}
              multiline={true}
              numberOfLines={4}
            />
            <View className="flex-row justify-end mt-4">
              <TouchableOpacity 
                className="bg-red-500 p-2.5 rounded-lg mr-2.5"
                onPress={() => setAddModalVisible(false)}
              >
                <Text className="text-white font-bold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-blue-500 p-2.5 rounded-lg"
                onPress={handleAddMuscle}
              >
                <Text className="text-white font-bold">Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para editar músculo */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-5 rounded-lg w-4/5">
            <Text className="text-xl font-bold mb-4">Editar Músculo</Text>
            <TextInput
              className="border border-gray-300 p-2.5 rounded-lg mb-2.5"
              placeholder="Nombre del músculo"
              value={selectedMuscle?.name}
              onChangeText={(text) => selectedMuscle && setSelectedMuscle({...selectedMuscle, name: text})}
            />
            <TextInput
              className="border border-gray-300 p-2.5 rounded-lg mb-2.5 h-24"
              placeholder="Descripción"
              value={selectedMuscle?.description}
              onChangeText={(text) => selectedMuscle && setSelectedMuscle({...selectedMuscle, description: text})}
              multiline={true}
              numberOfLines={4}
            />
            <View className="flex-row justify-end mt-4">
              <TouchableOpacity 
                className="bg-red-500 p-2.5 rounded-lg mr-2.5"
                onPress={() => setEditModalVisible(false)}
              >
                <Text className="text-white font-bold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-blue-500 p-2.5 rounded-lg"
                onPress={handleUpdateMuscle}
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

export default Muscles