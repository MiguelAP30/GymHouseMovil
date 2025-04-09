import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { WeekDayDAO } from '../../../interfaces/interfaces'
import { getWeekDays, putWeekDay, deleteWeekDay, postWeekDay } from '../../../lib/api_gymhouse'
import { useAuth } from '../../../context/AuthStore'
import { router } from 'expo-router'

const DaysWeek = () => {
  const { checkAuth } = useAuth()
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [selectedWeekDay, setSelectedWeekDay] = useState<WeekDayDAO | null>(null)
  const [newWeekDay, setNewWeekDay] = useState<Omit<WeekDayDAO, 'id'>>({
    name: ''
  })
  const [loading, setLoading] = useState(true)
  const [weekDays, setWeekDays] = useState<WeekDayDAO[]>([])
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState({
    name: ''
  });

  useEffect(() => {
    fetchWeekDays()
  }, [])

  const fetchWeekDays = async () => {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    const response = await getWeekDays()
    setWeekDays(response)
    setLoading(false)
  }

  const validateWeekDay = (weekDay: Partial<WeekDayDAO>) => {
    const newErrors = {
      name: ''
    };

    if (!weekDay.name) {
      newErrors.name = 'El nombre es requerido';
    } else if (weekDay.name.length > 20) {
      newErrors.name = 'El nombre no puede exceder 20 caracteres';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleAddWeekDay = async () => {
    if (!validateWeekDay(newWeekDay)) {
      return;
    }
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    await postWeekDay(newWeekDay)
    await fetchWeekDays()
    setNewWeekDay({ name: '' })
    setAddModalVisible(false)
    Alert.alert('Éxito', 'Día de la semana creado correctamente')
  }

  const handleDeleteWeekDay = async (id: number) => {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    await deleteWeekDay(id)
    await fetchWeekDays()
    Alert.alert('Éxito', 'Día de la semana eliminado correctamente')
  }

  const handleEditWeekDay = (weekDay: WeekDayDAO) => {
    setSelectedWeekDay(weekDay)
    setEditModalVisible(true)
  }

  const handleUpdateWeekDay = async () => {
    if (!selectedWeekDay || !validateWeekDay(selectedWeekDay)) {
      return;
    }
    if (!selectedWeekDay?.id) return
    
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    await putWeekDay(selectedWeekDay.id, selectedWeekDay)
    await fetchWeekDays()
    setEditModalVisible(false)
    Alert.alert('Éxito', 'Día de la semana actualizado correctamente')
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
          onPress={fetchWeekDays}
        >
          <Text className="text-white font-bold">Reintentar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View className="flex-1 p-5 bg-gray-100">
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-2xl font-bold">Días de la Semana</Text>
        <TouchableOpacity 
          className="bg-blue-500 p-2.5 rounded-lg"
          onPress={() => setAddModalVisible(true)}
        >
          <Text className="text-white font-bold">Agregar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {weekDays.map(weekDay => (
          <View key={weekDay.id} className="bg-white p-4 rounded-lg mb-2.5 flex-row justify-between items-center shadow-md">
            <View className="flex-1">
              <Text className="text-lg font-bold">{weekDay.name}</Text>
            </View>
            <View className="flex-row">
              <TouchableOpacity 
                onPress={() => handleEditWeekDay(weekDay)}
                className="mr-2.5"
              >
                <Ionicons name="pencil" size={24} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => weekDay.id && handleDeleteWeekDay(weekDay.id)}
                className="ml-2.5"
              >
                <Ionicons name="trash" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal para agregar día de la semana */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-5 rounded-lg w-4/5">
            <Text className="text-xl font-bold mb-4">Nuevo Día de la Semana</Text>
            <TextInput
              className="border border-gray-300 p-2.5 rounded-lg mb-1"
              placeholder="Nombre del día"
              value={newWeekDay.name}
              onChangeText={(text) => setNewWeekDay({...newWeekDay, name: text})}
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
                onPress={handleAddWeekDay}
              >
                <Text className="text-white font-bold">Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para editar día de la semana */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-5 rounded-lg w-4/5">
            <Text className="text-xl font-bold mb-4">Editar Día de la Semana</Text>
            <TextInput
              className="border border-gray-300 p-2.5 rounded-lg mb-1"
              placeholder="Nombre del día"
              value={selectedWeekDay?.name}
              onChangeText={(text) => selectedWeekDay && setSelectedWeekDay({...selectedWeekDay, name: text})}
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
                onPress={handleUpdateWeekDay}
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

export default DaysWeek