import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthStore'
import { router } from 'expo-router'
import { postGym, getUserGym } from '../../../lib/api_gymhouse'
import { GymDAO } from '../../../interfaces/interfaces'
import DateTimePicker from '@react-native-community/datetimepicker'

const CreateGym = () => {
  const { checkAuth, user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showOpenTimePicker, setShowOpenTimePicker] = useState(false)
  const [showCloseTimePicker, setShowCloseTimePicker] = useState(false)
  const [formData, setFormData] = useState<Partial<GymDAO>>({
    user_email: user?.email || '', // maximo 250 caracteres
    name: '',// Maximo 100 caracteres
    description: '',// Maximo 200 caracteres
    address: '',// Maximo 100 caracteres
    city: '',// Maximo 60 caracteres
    country: '',// Maximo 60 caracteres
    open_time: '',// Debe comportarse como un reloj
    close_time: '',// Debe comportarse como un reloj
    phone: '',// Maximo 20 caracteres
    email: '',// Maximo 250 caracteres
    website: '',// Maximo 250 caracteres
    price: 0,// Debe ser un numero
    start_date: new Date(),
    final_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    is_active: true,
    image: ''
  })

  const [errors, setErrors] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    open_time: '',
    close_time: '',
    city: '',
    country: ''
  });

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  useEffect(() => {
    checkExistingGym()
  }, [])

  const checkExistingGym = async () => {
    try {
      const isAuthenticated = await checkAuth()
      if (!isAuthenticated) {
        router.replace('/')
        return
      }

      const existingGym = await getUserGym()
      if (existingGym) {
        router.replace('/account/dashboardGym/myGym')
      }
    } catch (error) {
      console.error('Error al verificar gimnasio existente:', error)
      if (error instanceof Error && error.message.includes('Sesión expirada')) {
        router.replace('/')
      }
    }
  }

  const validateGym = (gym: Partial<GymDAO>) => {
    const newErrors = {
      name: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      open_time: '',
      close_time: '',
      city: '',
      country: ''
    };

    if (!gym.name) {
      newErrors.name = 'El nombre es requerido';
    } else if (gym.name.length > 100) {
      newErrors.name = 'El nombre no puede exceder 100 caracteres';
    }

    if (!gym.description) {
      newErrors.description = 'La descripción es requerida';
    } else if (gym.description.length > 200) {
      newErrors.description = 'La descripción no puede exceder 200 caracteres';
    }

    if (!gym.address) {
      newErrors.address = 'La dirección es requerida';
    } else if (gym.address.length > 100) {
      newErrors.address = 'La dirección no puede exceder 100 caracteres';
    }

    if (!gym.phone) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (gym.phone.length > 20) {
      newErrors.phone = 'El teléfono no puede exceder 20 caracteres';
    }

    if (!gym.email) {
      newErrors.email = 'El email es requerido';
    } else if (gym.email.length > 250) {
      newErrors.email = 'El email no puede exceder 250 caracteres';
    }

    if (gym.website && gym.website.length > 100) {
      newErrors.website = 'El sitio web no puede exceder 100 caracteres';
    }

    if (!gym.open_time) {
      newErrors.open_time = 'La hora de apertura es requerida';
    } else if (gym.open_time.length > 10) {
      newErrors.open_time = 'La hora de apertura no puede exceder 10 caracteres';
    }

    if (!gym.close_time) {
      newErrors.close_time = 'La hora de cierre es requerida';
    } else if (gym.close_time.length > 10) {
      newErrors.close_time = 'La hora de cierre no puede exceder 10 caracteres';
    }

    if (!gym.city) {
      newErrors.city = 'La ciudad es requerida';
    } else if (gym.city.length > 60) {
      newErrors.city = 'La ciudad no puede exceder 60 caracteres';
    }

    if (!gym.country) {
      newErrors.country = 'El país es requerido';
    } else if (gym.country.length > 60) {
      newErrors.country = 'El país no puede exceder 60 caracteres';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async () => {
    if (!validateGym(formData)) {
      return;
    }
    try {
      setLoading(true)
      const isAuthenticated = await checkAuth()
      if (!isAuthenticated) {
        router.replace('/')
        return
      }

      // Validar campos requeridos
      const requiredFields = ['name', 'description', 'address', 'city', 'country', 'open_time', 'close_time', 'phone', 'email', 'price']
      const missingFields = requiredFields.filter(field => !formData[field as keyof GymDAO])
      
      if (missingFields.length > 0) {
        Alert.alert('Error', 'Por favor, completa todos los campos requeridos')
        return
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email || '')) {
        Alert.alert('Error', 'Por favor, ingresa un email válido')
        return
      }

      // Validar formato de teléfono
      const phoneRegex = /^\+?[\d\s-]{10,}$/
      if (!phoneRegex.test(formData.phone || '')) {
        Alert.alert('Error', 'Por favor, ingresa un número de teléfono válido')
        return
      }

      // Validar precio
      if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
        Alert.alert('Error', 'Por favor, ingresa un precio válido')
        return
      }

      // Asegurarse de que user_email esté actualizado con el email del usuario actual
      const gymData = {
        ...formData,
        user_email: user?.email || ''
      }

      await postGym(gymData as GymDAO)
      Alert.alert('Éxito', 'Gimnasio creado correctamente')
      router.replace('/account/dashboardGym/myGym')
    } catch (error) {
      console.error('Error al crear gimnasio:', error)
      if (error instanceof Error && error.message.includes('Sesión expirada')) {
        router.replace('/')
      } else {
        Alert.alert('Error', 'No se pudo crear el gimnasio. Por favor, intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView className="flex-1 bg-gray-100 p-5">
      <Text className="text-2xl font-bold mb-5">Crear Gimnasio</Text>

      <View className="bg-white p-4 rounded-lg shadow-md mb-4">
        <Text className="text-gray-600 mb-2">Nombre del Gimnasio</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-2 mb-1"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Ingresa el nombre del gimnasio"
          maxLength={100}
        />
        {errors.name ? <Text className="text-red-500 text-sm mb-2">{errors.name}</Text> : null}

        <Text className="text-gray-600 mb-2">Descripción</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-2 mb-1"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          placeholder="Describe tu gimnasio"
          multiline
          numberOfLines={3}
          maxLength={200}
        />
        {errors.description ? <Text className="text-red-500 text-sm mb-2">{errors.description}</Text> : null}

        <Text className="text-gray-600 mb-2">Dirección</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-2 mb-1"
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          placeholder="Ingresa la dirección"
          maxLength={100}
        />
        {errors.address ? <Text className="text-red-500 text-sm mb-2">{errors.address}</Text> : null}

        <View className="flex-row justify-between mb-4">
          <View className="flex-1 mr-2">
            <Text className="text-gray-600 mb-2">Ciudad</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-2"
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
              placeholder="Ciudad"
              maxLength={60}
            />
            {errors.city ? <Text className="text-red-500 text-sm mt-1">{errors.city}</Text> : null}
          </View>
          <View className="flex-1 ml-2">
            <Text className="text-gray-600 mb-2">País</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-2"
              value={formData.country}
              onChangeText={(text) => setFormData({ ...formData, country: text })}
              placeholder="País"
              maxLength={60}
            />
          </View>
        </View>

        <View className="flex-row justify-between mb-4">
          <View className="flex-1 mr-2">
            <Text className="text-gray-600 mb-2">Hora de Apertura</Text>
            <TouchableOpacity
              onPress={() => setShowOpenTimePicker(true)}
              className="border border-gray-300 rounded-lg p-2"
            >
              <Text>{formData.open_time || 'HH:MM'}</Text>
            </TouchableOpacity>
            {showOpenTimePicker && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                is24Hour={true}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowOpenTimePicker(Platform.OS === 'ios');
                  if (selectedDate && event.type !== 'dismissed') {
                    setFormData({ ...formData, open_time: formatTime(selectedDate) });
                  }
                }}
              />
            )}
          </View>
          <View className="flex-1 ml-2">
            <Text className="text-gray-600 mb-2">Hora de Cierre</Text>
            <TouchableOpacity
              onPress={() => setShowCloseTimePicker(true)}
              className="border border-gray-300 rounded-lg p-2"
            >
              <Text>{formData.close_time || 'HH:MM'}</Text>
            </TouchableOpacity>
            {showCloseTimePicker && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                is24Hour={true}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowCloseTimePicker(Platform.OS === 'ios');
                  if (selectedDate && event.type !== 'dismissed') {
                    setFormData({ ...formData, close_time: formatTime(selectedDate) });
                  }
                }}
              />
            )}
          </View>
        </View>

        <Text className="text-gray-600 mb-2">Teléfono</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-2 mb-4"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          placeholder="Ingresa el número de teléfono"
          keyboardType="phone-pad"
          maxLength={20}
        />

        <Text className="text-gray-600 mb-2">Email</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-2 mb-4"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          placeholder="Ingresa el email"
          keyboardType="email-address"
          autoCapitalize="none"
          maxLength={250}
        />

        <Text className="text-gray-600 mb-2">Sitio Web</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-2 mb-4"
          value={formData.website}
          onChangeText={(text) => setFormData({ ...formData, website: text })}
          placeholder="Ingresa la URL del sitio web"
          autoCapitalize="none"
          maxLength={250}
        />

        <Text className="text-gray-600 mb-2">Precio</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-2 mb-4"
          value={formData.price?.toString()}
          onChangeText={(text) => setFormData({ ...formData, price: Number(text) || 0 })}
          placeholder="Ingresa el precio"
          keyboardType="numeric"
        />

        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg"
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-bold">Crear Gimnasio</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default CreateGym