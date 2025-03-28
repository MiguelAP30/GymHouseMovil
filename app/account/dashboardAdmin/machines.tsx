import { View, Text, TouchableOpacity, Modal, ScrollView, ActivityIndicator, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { getMachines, createMachine, updateMachine, deleteMachine } from '../../../lib/api_gymhouse'
import { useAuth } from '../../../context/AuthStore'

interface Machine {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
}

const Machines = () => {
  const { checkAuth } = useAuth()
  const [machines, setMachines] = useState<Machine[]>([])
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  const fetchMachines = async () => {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    const response = await getMachines()
    if (response) {
      setMachines(Array.isArray(response) ? response : [response])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchMachines()
  }, [])

  const handleAddMachine = async () => {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    await createMachine(formData)
    setShowModal(false)
    setFormData({ name: '', description: '' })
    fetchMachines()
  }

  const handleUpdateMachine = async () => {
    if (!selectedMachine) return

    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    await updateMachine(selectedMachine.id, formData)
    setShowModal(false)
    setSelectedMachine(null)
    setFormData({ name: '', description: '' })
    fetchMachines()
  }

  const handleDeleteMachine = async (id: number) => {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    await deleteMachine(id)
    fetchMachines()
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
          onPress={fetchMachines}
        >
          <Text className="text-white font-bold">Reintentar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View className="flex-1 p-5 bg-gray-50">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-3xl font-bold text-gray-800">Máquinas</Text>
        <TouchableOpacity 
          className="bg-blue-500 px-4 py-2 rounded-lg"
          onPress={() => {
            setSelectedMachine(null)
            setFormData({ name: '', description: '' })
            setShowModal(true)
          }}
        >
          <Text className="text-white font-bold">Agregar Máquina</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {machines.map((machine) => (
          <View key={machine.id} className="bg-white p-6 rounded-xl mb-4 shadow-lg">
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-xl font-bold text-gray-800">{machine.name}</Text>
                <Text className="text-gray-600 mt-1">{machine.description}</Text>
              </View>
              <View className="flex-row space-x-4">
                <TouchableOpacity 
                  className="bg-blue-500 px-3 py-1.5 rounded-lg"
                  onPress={() => {
                    setSelectedMachine(machine)
                    setFormData({
                      name: machine.name,
                      description: machine.description
                    })
                    setShowModal(true)
                  }}
                >
                  <Text className="text-white text-sm">Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  className="bg-red-500 px-3 py-1.5 rounded-lg"
                  onPress={() => handleDeleteMachine(machine.id)}
                >
                  <Text className="text-white text-sm">Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-xl w-11/12 max-w-md">
            <Text className="text-2xl font-bold text-gray-800 mb-4">
              {selectedMachine ? 'Editar Máquina' : 'Agregar Máquina'}
            </Text>
            <View className="space-y-4">
              <View>
                <Text className="text-gray-600 mb-1">Nombre</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-2"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder="Nombre de la máquina"
                />
              </View>
              <View>
                <Text className="text-gray-600 mb-1">Descripción</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-2"
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder="Descripción de la máquina"
                />
              </View>
            </View>
            <View className="flex-row justify-end space-x-4 mt-6">
              <TouchableOpacity 
                className="bg-gray-500 px-4 py-2 rounded-lg"
                onPress={() => setShowModal(false)}
              >
                <Text className="text-white font-bold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-blue-500 px-4 py-2 rounded-lg"
                onPress={selectedMachine ? handleUpdateMachine : handleAddMachine}
              >
                <Text className="text-white font-bold">
                  {selectedMachine ? 'Actualizar' : 'Agregar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default Machines