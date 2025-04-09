import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { DifficultyDAO } from '../../../interfaces/interfaces'
import { getDifficulties, putDifficulty, deleteDifficulty, postDifficulty } from '../../../lib/api_gymhouse'
import { useAuth } from '../../../context/AuthStore'
import { router } from 'expo-router'

const DifficultyExercise = () => {
  const { checkAuth } = useAuth()
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyDAO | null>(null)
  const [newDifficulty, setNewDifficulty] = useState<Omit<DifficultyDAO, 'id'>>({
    name: ''
  })
  const [loading, setLoading] = useState(true)
  const [difficulties, setDifficulties] = useState<DifficultyDAO[]>([])
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState({
    name: ''
  });

  useEffect(() => {
    fetchDifficulties()
  }, [])

  const fetchDifficulties = async () => {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    const response = await getDifficulties()
    setDifficulties(response)
    setLoading(false)
  }

  const validateDifficulty = (difficulty: Partial<DifficultyDAO>) => {
    const newErrors = {
      name: ''
    };

    if (!difficulty.name) {
      newErrors.name = 'El nombre es requerido';
    } else if (difficulty.name.length > 20) {
      newErrors.name = 'El nombre no puede exceder 20 caracteres';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleAddDifficulty = async () => {
    if (!validateDifficulty(newDifficulty)) {
      return;
    }
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    await postDifficulty(newDifficulty)
    await fetchDifficulties()
    setNewDifficulty({ name: '' })
    setAddModalVisible(false)
    Alert.alert('Éxito', 'Dificultad creada correctamente')
  }

  const handleDeleteDifficulty = async (id: number) => {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    await deleteDifficulty(id)
    await fetchDifficulties()
    Alert.alert('Éxito', 'Dificultad eliminada correctamente')
  }

  const handleEditDifficulty = (difficulty: DifficultyDAO) => {
    setSelectedDifficulty(difficulty)
    setEditModalVisible(true)
  }

  const handleUpdateDifficulty = async () => {
    if (!selectedDifficulty || !validateDifficulty(selectedDifficulty)) {
      return;
    }
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    if (typeof selectedDifficulty.id !== 'number') return;
    await putDifficulty(selectedDifficulty.id, selectedDifficulty)
    await fetchDifficulties()
    setEditModalVisible(false)
    Alert.alert('Éxito', 'Dificultad actualizada correctamente')
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
          onPress={fetchDifficulties}
        >
          <Text className="text-white font-bold">Reintentar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View className="flex-1 p-5 bg-gray-100">
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-2xl font-bold">Dificultades</Text>
        <TouchableOpacity 
          className="bg-blue-500 p-2.5 rounded-lg"
          onPress={() => setAddModalVisible(true)}
        >
          <Text className="text-white font-bold">Agregar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {difficulties.map(difficulty => (
          <View key={difficulty.id} className="bg-white p-4 rounded-lg mb-2.5 flex-row justify-between items-center shadow-md">
            <View className="flex-1">
              <Text className="text-lg font-bold">{difficulty.name}</Text>
            </View>
            <View className="flex-row">
              <TouchableOpacity 
                onPress={() => handleEditDifficulty(difficulty)}
                className="mr-2.5"
              >
                <Ionicons name="pencil" size={24} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => difficulty.id && handleDeleteDifficulty(difficulty.id)}
                className="ml-2.5"
              >
                <Ionicons name="trash" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal para agregar dificultad */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-5 rounded-lg w-4/5">
            <Text className="text-xl font-bold mb-4">Nueva Dificultad</Text>
            <TextInput
              className="border border-gray-300 p-2.5 rounded-lg mb-1"
              placeholder="Nombre de la dificultad"
              value={newDifficulty.name}
              onChangeText={(text) => setNewDifficulty({...newDifficulty, name: text})}
              maxLength={20}
            />
            {errors.name ? <Text className="text-red-500 text-sm mb-2">{errors.name}</Text> : null}
            <View className="flex-row justify-end mt-4">
              <TouchableOpacity 
                className="bg-red-500 p-2.5 rounded-lg mr-2.5"
                onPress={() => {
                  setAddModalVisible(false);
                  setErrors({ name: '' });
                }}
              >
                <Text className="text-white font-bold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-blue-500 p-2.5 rounded-lg"
                onPress={handleAddDifficulty}
              >
                <Text className="text-white font-bold">Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para editar dificultad */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-5 rounded-lg w-4/5">
            <Text className="text-xl font-bold mb-4">Editar Dificultad</Text>
            <TextInput
              className="border border-gray-300 p-2.5 rounded-lg mb-1"
              placeholder="Nombre de la dificultad"
              value={selectedDifficulty?.name}
              onChangeText={(text) => selectedDifficulty && setSelectedDifficulty({...selectedDifficulty, name: text})}
              maxLength={20}
            />
            {errors.name ? <Text className="text-red-500 text-sm mb-2">{errors.name}</Text> : null}
            <View className="flex-row justify-end mt-4">
              <TouchableOpacity 
                className="bg-red-500 p-2.5 rounded-lg mr-2.5"
                onPress={() => {
                  setEditModalVisible(false);
                  setErrors({ name: '' });
                }}
              >
                <Text className="text-white font-bold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-blue-500 p-2.5 rounded-lg"
                onPress={handleUpdateDifficulty}
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

export default DifficultyExercise