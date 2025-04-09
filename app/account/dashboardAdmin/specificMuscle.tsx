import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { SpecificMuscleDAO, MuscleDAO } from '../../../interfaces/interfaces'
import { getSpecificMuscles, putSpecificMuscle, deleteSpecificMuscle, postSpecificMuscle, getMuscles } from '../../../lib/api_gymhouse'
import { useAuth } from '../../../context/AuthStore'

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
  const [filteredSpecificMuscles, setFilteredSpecificMuscles] = useState<SpecificMuscleDAO[]>([])
  const [muscles, setMuscles] = useState<MuscleDAO[]>([])
  const [searchName, setSearchName] = useState('')
  const [selectedMuscle, setSelectedMuscle] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    muscle_id: ''
  });

  useEffect(() => {
    fetchSpecificMuscles()
    fetchMuscles()
  }, [])

  useEffect(() => {
    filterSpecificMuscles()
  }, [specificMuscles, searchName, selectedMuscle])

  const filterSpecificMuscles = () => {
    let filtered = [...specificMuscles]

    if (searchName.trim()) {
      filtered = filtered.filter(specificMuscle => 
        specificMuscle.name.toLowerCase().includes(searchName.toLowerCase())
      )
    }

    if (selectedMuscle) {
      filtered = filtered.filter(specificMuscle => 
        specificMuscle.muscle_id === selectedMuscle
      )
    }

    setFilteredSpecificMuscles(filtered)
  }

  const fetchSpecificMuscles = async () => {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    const response = await getSpecificMuscles()
    setSpecificMuscles(response)
    setLoading(false)
  }

  const fetchMuscles = async () => {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    const response = await getMuscles()
    setMuscles(response)
  }

  const validateSpecificMuscle = (muscle: Partial<SpecificMuscleDAO>) => {
    const newErrors = {
      name: '',
      description: '',
      muscle_id: ''
    };

    if (!muscle.name) {
      newErrors.name = 'El nombre es requerido';
    } else if (muscle.name.length > 40) {
      newErrors.name = 'El nombre no puede exceder 40 caracteres';
    }

    if (!muscle.description) {
      newErrors.description = 'La descripción es requerida';
    } else if (muscle.description.length > 200) {
      newErrors.description = 'La descripción no puede exceder 200 caracteres';
    }

    if (!muscle.muscle_id) {
      newErrors.muscle_id = 'Debe seleccionar un músculo';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleAddSpecificMuscle = async () => {
    if (!validateSpecificMuscle(newSpecificMuscle)) {
      return;
    }
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    await postSpecificMuscle(newSpecificMuscle)
    await fetchSpecificMuscles()
    setNewSpecificMuscle({
      name: '',
      description: '',
      muscle_id: 1
    })
    setAddModalVisible(false)
    Alert.alert('Éxito', 'Músculo específico creado correctamente')
  }

  const handleDeleteSpecificMuscle = async (id: number) => {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    await deleteSpecificMuscle(id)
    await fetchSpecificMuscles()
    Alert.alert('Éxito', 'Músculo específico eliminado correctamente')
  }

  const handleEditSpecificMuscle = (specificMuscle: SpecificMuscleDAO) => {
    setSelectedSpecificMuscle(specificMuscle)
    setEditModalVisible(true)
  }

  const handleUpdateSpecificMuscle = async () => {
    if (!selectedSpecificMuscle || !validateSpecificMuscle(selectedSpecificMuscle)) {
      return;
    }
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    if (typeof selectedSpecificMuscle.id !== 'number') return;
    await putSpecificMuscle(selectedSpecificMuscle.id, selectedSpecificMuscle)
    await fetchSpecificMuscles()
    setEditModalVisible(false)
    Alert.alert('Éxito', 'Músculo específico actualizado correctamente')
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
          onPress={fetchSpecificMuscles}
        >
          <Text className="text-white font-bold">Reintentar</Text>
        </TouchableOpacity>
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
        
        <View className="border border-gray-300 rounded-lg mb-2.5">
          <Picker
            selectedValue={selectedMuscle}
            onValueChange={(value: number | null) => setSelectedMuscle(value)}
            style={{ height: 50 }}
            mode="dropdown"
          >
            <Picker.Item label="Todos los músculos" value={null} />
            {muscles.map(muscle => (
              <Picker.Item 
                key={muscle.id} 
                label={muscle.name} 
                value={muscle.id} 
              />
            ))}
          </Picker>
        </View>

        <TouchableOpacity 
          className="bg-gray-500 p-2.5 rounded-lg"
          onPress={() => {
            setSearchName('')
            setSelectedMuscle(null)
          }}
        >
          <Text className="text-white font-bold text-center">Limpiar filtros</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {filteredSpecificMuscles.map(specificMuscle => (
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
              className="border border-gray-300 p-2.5 rounded-lg mb-1"
              placeholder="Nombre del músculo específico"
              value={newSpecificMuscle.name}
              onChangeText={(text) => setNewSpecificMuscle({...newSpecificMuscle, name: text})}
              maxLength={40}
            />
            {errors.name ? <Text className="text-red-500 text-sm mb-2">{errors.name}</Text> : null}
            <TextInput
              className="border border-gray-300 p-2.5 rounded-lg mb-1 h-24"
              placeholder="Descripción"
              value={newSpecificMuscle.description}
              onChangeText={(text) => setNewSpecificMuscle({...newSpecificMuscle, description: text})}
              multiline={true}
              numberOfLines={4}
              maxLength={200}
            />
            {errors.description ? <Text className="text-red-500 text-sm mb-2">{errors.description}</Text> : null}
            <View className="border border-gray-300 rounded-lg mb-1">
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
            {errors.muscle_id ? <Text className="text-red-500 text-sm mb-2">{errors.muscle_id}</Text> : null}
            <View className="flex-row justify-end mt-4">
              <TouchableOpacity 
                className="bg-red-500 p-2.5 rounded-lg mr-2.5"
                onPress={() => {
                  setAddModalVisible(false);
                  setErrors({ name: '', description: '', muscle_id: '' });
                }}
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
              className="border border-gray-300 p-2.5 rounded-lg mb-1"
              placeholder="Nombre del músculo específico"
              value={selectedSpecificMuscle?.name}
              onChangeText={(text) => selectedSpecificMuscle && setSelectedSpecificMuscle({...selectedSpecificMuscle, name: text})}
              maxLength={40}
            />
            {errors.name ? <Text className="text-red-500 text-sm mb-2">{errors.name}</Text> : null}
            <TextInput
              className="border border-gray-300 p-2.5 rounded-lg mb-1 h-24"
              placeholder="Descripción"
              value={selectedSpecificMuscle?.description}
              onChangeText={(text) => selectedSpecificMuscle && setSelectedSpecificMuscle({...selectedSpecificMuscle, description: text})}
              multiline={true}
              numberOfLines={4}
              maxLength={200}
            />
            {errors.description ? <Text className="text-red-500 text-sm mb-2">{errors.description}</Text> : null}
            <View className="border border-gray-300 rounded-lg mb-1">
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
            {errors.muscle_id ? <Text className="text-red-500 text-sm mb-2">{errors.muscle_id}</Text> : null}
            <View className="flex-row justify-end mt-4">
              <TouchableOpacity 
                className="bg-red-500 p-2.5 rounded-lg mr-2.5"
                onPress={() => {
                  setEditModalVisible(false);
                  setErrors({ name: '', description: '', muscle_id: '' });
                }}
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