import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthStore'
import { router } from 'expo-router'
import { createUserGym, getGymByUser } from '../../../lib/gym'
import { UserGymDAO } from '../../../interfaces/gym'
import DateTimePicker from '@react-native-community/datetimepicker'
import { updateUserRole } from '../../../lib/user'
import { ROLES } from '../../../interfaces/user'

const AddUser = () => {
  const { checkAuth, user, fetchUserData } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showStartDatePicker, setShowStartDatePicker] = useState(false)
  const [showFinalDatePicker, setShowFinalDatePicker] = useState(false)
  const [gymId, setGymId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    user_email: '',
    gym_id: 0,
    start_date: new Date(),
    final_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
  })

  const [errors, setErrors] = useState({
    user_email: '',
    start_date: '',
    final_date: ''
  })

  useEffect(() => {
    checkGymAndAuth()
  }, [])

  const checkGymAndAuth = async () => {
    try {
      setLoading(true)
      const isAuthenticated = await checkAuth()
      if (!isAuthenticated) {
        router.replace('/')
        return
      }

      const gym = await getGymByUser()
      if (!gym) {
        Alert.alert(
          'Error',
          'No tienes un gimnasio registrado. Primero debes crear un gimnasio.',
          [
            {
              text: 'Crear Gimnasio',
              onPress: () => router.replace('/account/dashboardGym/createGym')
            }
          ]
        )
        return
      }

      setGymId(gym.id!)
      setFormData(prev => ({ ...prev, gym_id: gym.id! }))
    } catch (error) {
      console.error('Error al verificar gimnasio:', error)
      if (error instanceof Error && error.message.includes('Sesión expirada')) {
        router.replace('/')
      } else {
        Alert.alert('Error', 'No se pudo verificar tu gimnasio. Por favor, intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {
      user_email: '',
      start_date: '',
      final_date: ''
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.user_email || !emailRegex.test(formData.user_email)) {
      newErrors.user_email = 'Por favor, ingresa un email válido'
    }

    // Validar fechas
    if (!formData.start_date) {
      newErrors.start_date = 'La fecha de inicio es requerida'
    }

    if (!formData.final_date) {
      newErrors.final_date = 'La fecha final es requerida'
    }

    if (formData.start_date && formData.final_date && formData.start_date > formData.final_date) {
      newErrors.final_date = 'La fecha final debe ser posterior a la fecha de inicio'
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error !== '')
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      const isAuthenticated = await checkAuth()
      if (!isAuthenticated) {
        router.replace('/')
        return
      }

      // Verificar que el email no sea el mismo que el del propietario del gimnasio
      if (formData.user_email === user?.email) {
        Alert.alert('Error', 'No puedes registrarte a ti mismo como usuario del gimnasio')
        return
      }

      // Formatear las fechas al formato requerido por el backend (YYYY-MM-DD)
      const userGymData = {
        ...formData,
        start_date: new Date(formData.start_date.toISOString().split('T')[0]),
        final_date: new Date(formData.final_date.toISOString().split('T')[0]),
        is_active: true,
        is_premium: true
      }

      // Crear la relación usuario-gimnasio
      await createUserGym(userGymData)

      // Actualizar el rol del usuario a premium
      await updateUserRole(formData.user_email, ROLES.premium, formData.final_date.toISOString().split('T')[0])

      // Esperar un momento para asegurar que los datos se hayan actualizado
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Actualizar los datos del usuario
      await fetchUserData()

      // Navegar de vuelta inmediatamente
      router.back()

      // Mostrar el mensaje de éxito después de navegar
      Alert.alert('Éxito', 'Usuario agregado correctamente al gimnasio')
    } catch (error) {
      console.error('Error al agregar usuario:', error)
      if (error instanceof Error && error.message.includes('Sesión expirada')) {
        router.replace('/')
      } else {
        Alert.alert('Error', 'No se pudo agregar el usuario. Por favor, intenta de nuevo.')
      }
    } finally {
      setLoading(false)
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
    <ScrollView className="flex-1 bg-gray-100 p-5">
      <Text className="text-2xl font-bold mb-5">Agregar Usuario al Gimnasio</Text>

      <View className="bg-white p-4 rounded-lg shadow-md mb-4">
        <Text className="text-gray-600 mb-2">Email del Usuario</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-2 mb-1"
          value={formData.user_email}
          onChangeText={(text) => setFormData({ ...formData, user_email: text })}
          placeholder="Ingresa el email del usuario"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.user_email ? <Text className="text-red-500 text-sm mb-2">{errors.user_email}</Text> : null}

        <Text className="text-gray-600 mb-2">Fecha de Inicio</Text>
        <TouchableOpacity
          onPress={() => setShowStartDatePicker(true)}
          className="border border-gray-300 rounded-lg p-2 mb-1"
        >
          <Text>{formData.start_date?.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={formData.start_date || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowStartDatePicker(Platform.OS === 'ios')
              if (selectedDate) {
                setFormData({ ...formData, start_date: selectedDate })
              }
            }}
          />
        )}
        {errors.start_date ? <Text className="text-red-500 text-sm mb-2">{errors.start_date}</Text> : null}

        <Text className="text-gray-600 mb-2">Fecha Final</Text>
        <TouchableOpacity
          onPress={() => setShowFinalDatePicker(true)}
          className="border border-gray-300 rounded-lg p-2 mb-1"
        >
          <Text>{formData.final_date?.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showFinalDatePicker && (
          <DateTimePicker
            value={formData.final_date || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowFinalDatePicker(Platform.OS === 'ios')
              if (selectedDate) {
                setFormData({ ...formData, final_date: selectedDate })
              }
            }}
          />
        )}
        {errors.final_date ? <Text className="text-red-500 text-sm mb-2">{errors.final_date}</Text> : null}

        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg mt-4"
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-bold">Agregar Usuario</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default AddUser 