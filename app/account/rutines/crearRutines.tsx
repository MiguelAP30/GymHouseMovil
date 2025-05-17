import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useAuth } from '../../../context/AuthStore'
import { createTrainingPlan, getTagOfTrainingPlans } from '../../../lib/training'
import { TagOfTrainingPlanDAO } from '../../../interfaces/training'
import { Picker } from '@react-native-picker/picker'
import { Ionicons } from '@expo/vector-icons'

const CrearRutines = () => {
  const router = useRouter()
  const { checkAuth, user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<TagOfTrainingPlanDAO[]>([])
  const [newRoutine, setNewRoutine] = useState({
    name: '',
    description: '',
    is_visible: true,
    tag_of_training_plan_id: null as number | null,
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    const response = await getTagOfTrainingPlans()
    setTags(response)
    if (response.length > 0) {
      setNewRoutine(prev => ({
        ...prev,
        tag_of_training_plan_id: response[0].id
      }))
    }
  }

  const validateForm = () => {
    if (!newRoutine.name.trim()) {
      setError('El nombre es requerido')
      return false
    }
    if (newRoutine.name.length > 50) {
      setError('El nombre no puede tener más de 50 caracteres')
      return false
    }
    if (newRoutine.description.length > 500) {
      setError('La descripción no puede tener más de 500 caracteres')
      return false
    }
    if (!newRoutine.tag_of_training_plan_id) {
      setError('Debes seleccionar una etiqueta')
      return false
    }
    return true
  }

  const handleCreateRoutine = async () => {
    if (!validateForm()) return

    setLoading(true)
    setError(null)

    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      setError('No estás autenticado')
      setLoading(false)
      return
    }

    const response = await createTrainingPlan({
      name: newRoutine.name,
      description: newRoutine.description,
      is_visible: newRoutine.is_visible,
      tag_of_training_plan_id: newRoutine.tag_of_training_plan_id!,
      user_email: user?.email || ''
    })

    if (response) {
      Alert.alert(
        'Éxito',
        'Rutina creada correctamente',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      )
    } else {
      setError('Error al crear la rutina')
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 p-5 bg-gray-100">
      <View className="flex-row items-center mb-5">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mr-4"
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold">Crear Nueva Rutina</Text>
      </View>

      {error && (
        <View className="bg-red-100 p-4 rounded-lg mb-4">
          <Text className="text-red-500">{error}</Text>
        </View>
      )}

      <View className="bg-white p-4 rounded-lg shadow-md">
        <Text className="text-lg font-bold mb-2">Nombre</Text>
        <TextInput
          className="border border-gray-300 p-2.5 rounded-lg mb-4"
          placeholder="Nombre de la rutina"
          value={newRoutine.name}
          onChangeText={(text) => setNewRoutine(prev => ({ ...prev, name: text }))}
          maxLength={50}
        />

        <Text className="text-lg font-bold mb-2">Descripción</Text>
        <TextInput
          className="border border-gray-300 p-2.5 rounded-lg mb-4"
          placeholder="Descripción de la rutina"
          value={newRoutine.description}
          onChangeText={(text) => setNewRoutine(prev => ({ ...prev, description: text }))}
          multiline
          numberOfLines={4}
          maxLength={500}
        />

        <Text className="text-lg font-bold mb-2">Etiqueta</Text>
        <View className="border border-gray-300 rounded-lg mb-4">
          <Picker
            selectedValue={newRoutine.tag_of_training_plan_id}
            onValueChange={(value) => setNewRoutine(prev => ({ ...prev, tag_of_training_plan_id: value }))}
            style={{ height: 50 }}
            mode="dropdown"
          >
            <Picker.Item label="Selecciona una etiqueta" value={null} />
            {tags.map(tag => (
              <Picker.Item 
                key={tag.id} 
                label={tag.name} 
                value={tag.id} 
              />
            ))}
          </Picker>
        </View>

        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => setNewRoutine(prev => ({ ...prev, is_visible: !prev.is_visible }))}
            className="flex-row items-center"
          >
            <View className={`w-6 h-6 rounded-md mr-2 ${newRoutine.is_visible ? 'bg-blue-500' : 'bg-gray-300'}`}>
              {newRoutine.is_visible && (
                <Ionicons name="checkmark" size={20} color="white" />
              )}
            </View>
            <Text>Rutina visible para otros usuarios</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          className="bg-blue-500 p-3 rounded-lg"
          onPress={handleCreateRoutine}
        >
          <Text className="text-white font-bold text-center">Crear Rutina</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default CrearRutines