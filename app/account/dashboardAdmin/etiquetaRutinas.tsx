import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { TagOfTrainingPlanDAO } from '../../../interfaces/interfaces'
import { getTagsOfTrainingPlan, postTagOfTrainingPlan, putTagOfTrainingPlan, deleteTagOfTrainingPlan } from '../../../lib/api_gymhouse'
import { useAuth } from '../../../context/AuthStore'
import { router } from 'expo-router'

const EtiquetaRutinas = () => {
  const { checkAuth } = useAuth()
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [selectedTag, setSelectedTag] = useState<TagOfTrainingPlanDAO | null>(null)
  const [newTag, setNewTag] = useState<Omit<TagOfTrainingPlanDAO, 'id'>>({
    name: ''
  })
  const [loading, setLoading] = useState(true)
  const [tags, setTags] = useState<TagOfTrainingPlanDAO[]>([])
  const [filteredTags, setFilteredTags] = useState<TagOfTrainingPlanDAO[]>([])
  const [searchName, setSearchName] = useState('')

  useEffect(() => {
    fetchTags()
  }, [])

  useEffect(() => {
    filterTags()
  }, [tags, searchName])

  const filterTags = () => {
    let filtered = [...tags]

    // Filter by name
    if (searchName.trim()) {
      filtered = filtered.filter(tag => 
        tag.name.toLowerCase().includes(searchName.toLowerCase())
      )
    }

    setFilteredTags(filtered)
  }

  const fetchTags = async () => {
    try {
      setLoading(true)
      const isAuthenticated = await checkAuth()
      if (!isAuthenticated) {
        router.replace('/')
        return
      }

      const response = await getTagsOfTrainingPlan()
      setTags(response)
    } catch (error) {
      console.error('Error al obtener etiquetas:', error)
      if (error instanceof Error && error.message.includes('Sesión expirada')) {
        router.replace('/')
      } else {
        Alert.alert('Error', 'No se pudieron cargar las etiquetas. Por favor, intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddTag = async () => {
    try {
      await postTagOfTrainingPlan(newTag)
      await fetchTags()
      setNewTag({ name: '' })
      setAddModalVisible(false)
      Alert.alert('Éxito', 'Etiqueta creada correctamente')
    } catch (error) {
      console.error('Error al crear etiqueta:', error)
      Alert.alert('Error', 'No se pudo crear la etiqueta. Por favor, intenta de nuevo.')
    }
  }

  const handleDeleteTag = async (id: number) => {
    try {
      await deleteTagOfTrainingPlan(id)
      await fetchTags()
      Alert.alert('Éxito', 'Etiqueta eliminada correctamente')
    } catch (error) {
      console.error('Error al eliminar etiqueta:', error)
      Alert.alert('Error', 'No se pudo eliminar la etiqueta. Por favor, intenta de nuevo.')
    }
  }

  const handleEditTag = (tag: TagOfTrainingPlanDAO) => {
    setSelectedTag(tag)
    setEditModalVisible(true)
  }

  const handleUpdateTag = async () => {
    if (!selectedTag?.id) return
    
    try {
      await putTagOfTrainingPlan(selectedTag.id, selectedTag)
      await fetchTags()
      setEditModalVisible(false)
      Alert.alert('Éxito', 'Etiqueta actualizada correctamente')
    } catch (error) {
      console.error('Error al actualizar etiqueta:', error)
      Alert.alert('Error', 'No se pudo actualizar la etiqueta. Por favor, intenta de nuevo.')
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
        <Text className="text-2xl font-bold">Etiquetas de Rutinas</Text>
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
          <Text className="text-white font-bold text-center">Limpiar búsqueda</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {filteredTags.map(tag => (
          <View key={tag.id} className="bg-white p-4 rounded-lg mb-2.5 flex-row justify-between items-center shadow-md">
            <View className="flex-1">
              <Text className="text-lg font-bold">{tag.name}</Text>
            </View>
            <View className="flex-row">
              <TouchableOpacity 
                onPress={() => handleEditTag(tag)}
                className="mr-2.5"
              >
                <Ionicons name="pencil" size={24} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => tag.id && handleDeleteTag(tag.id)}
                className="ml-2.5"
              >
                <Ionicons name="trash" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal para agregar etiqueta */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-5 rounded-lg w-4/5">
            <Text className="text-xl font-bold mb-4">Nueva Etiqueta</Text>
            <TextInput
              className="border border-gray-300 p-2.5 rounded-lg mb-2.5"
              placeholder="Nombre de la etiqueta"
              value={newTag.name}
              onChangeText={(text) => setNewTag({...newTag, name: text})}
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
                onPress={handleAddTag}
              >
                <Text className="text-white font-bold">Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para editar etiqueta */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-5 rounded-lg w-4/5">
            <Text className="text-xl font-bold mb-4">Editar Etiqueta</Text>
            <TextInput
              className="border border-gray-300 p-2.5 rounded-lg mb-2.5"
              placeholder="Nombre de la etiqueta"
              value={selectedTag?.name}
              onChangeText={(text) => selectedTag && setSelectedTag({...selectedTag, name: text})}
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
                onPress={handleUpdateTag}
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

export default EtiquetaRutinas