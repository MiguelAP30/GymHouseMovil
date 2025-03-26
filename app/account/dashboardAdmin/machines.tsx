import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { getMachines, createMachine, updateMachine, deleteMachine } from '../../../lib/api_gymhouse'
interface Machine {
  id: number;
  name: string;
  description: string;
}

const Machines = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null)
  const [newMachine, setNewMachine] = useState<Omit<Machine, 'id'>>({
    name: '',
    description: ''
  })

  const [machines, setMachines] = useState<Machine[]>([])

  const fetchMachines = async () => {
    try {
      const response = await getMachines()
      if (response) {
        setMachines(response)
      }
    } catch (error) {
      console.error('Error al obtener máquinas:', error)
    }
  }

  useEffect(() => {
    fetchMachines()
  }, [])

  const handleAddMachine = async () => {
    try {
      const response = await createMachine(newMachine)
      await fetchMachines() // Recargar la lista completa
      setNewMachine({ name: '', description: '' })
      setModalVisible(false)
    } catch (error) {
      console.error('Error al crear máquina:', error)
    }
  }

  const handleDeleteMachine = async (id: number) => {
    try {
      await deleteMachine(id)
      await fetchMachines() // Recargar la lista completa
    } catch (error) {
      console.error('Error al eliminar máquina:', error)
    }
  }

  const handleEditMachine = (machine: Machine) => {
    setSelectedMachine({...machine}) // Crear una copia para evitar referencias
    setEditModalVisible(true)
  }

  const handleUpdateMachine = async () => {
    if (!selectedMachine) return;
    
    try {
      await updateMachine(selectedMachine.id, {
        name: selectedMachine.name,
        description: selectedMachine.description
      })
      await fetchMachines() // Recargar la lista completa
      setSelectedMachine(null)
      setEditModalVisible(false)
    } catch (error) {
      console.error('Error al actualizar máquina:', error)
    }
  }

  return (
    <View className="flex-1 p-5 bg-gray-100">
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-2xl font-bold">Máquinas</Text>
        <TouchableOpacity 
          className="bg-blue-500 p-2.5 rounded-lg"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-white font-bold">Agregar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {machines.map(machine => (
          <View key={`machine-${machine.id}`} className="bg-white p-4 rounded-lg mb-2.5 shadow-md">
            <View className="flex-row justify-between items-start">
              <View className="flex-1 mr-4">
                <Text className="text-lg font-bold">{machine.name}</Text>
              </View>
              <View className="flex-row">
                <TouchableOpacity 
                  onPress={() => handleEditMachine(machine)}
                  className="mr-2.5"
                >
                  <Ionicons name="pencil" size={24} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => handleDeleteMachine(machine.id)}
                  className="ml-2.5"
                >
                  <Ionicons name="trash" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
            <Text className="text-gray-600 mt-2">{machine.description}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Modal para agregar máquina */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-5 rounded-lg w-4/5">
            <Text className="text-xl font-bold mb-4">Nueva Máquina</Text>
            <TextInput
              className="border border-gray-300 p-2.5 rounded-lg mb-2.5"
              placeholder="Nombre de la máquina"
              value={newMachine.name}
              onChangeText={(text) => setNewMachine({...newMachine, name: text})}
            />
            <TextInput
              className="border border-gray-300 p-2.5 rounded-lg mb-2.5 h-24"
              placeholder="Descripción"
              value={newMachine.description}
              onChangeText={(text) => setNewMachine({...newMachine, description: text.slice(0, 200)})}
              multiline={true}
              numberOfLines={4}
              maxLength={200}
            />
            <Text className="text-gray-500 text-right mb-2">
              {newMachine.description.length}/200 caracteres
            </Text>
            <View className="flex-row justify-end mt-4">
              <TouchableOpacity 
                className="bg-red-500 p-2.5 rounded-lg mr-2.5"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-white font-bold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-blue-500 p-2.5 rounded-lg"
                onPress={handleAddMachine}
              >
                <Text className="text-white font-bold">Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para editar máquina */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-5 rounded-lg w-4/5">
            <Text className="text-xl font-bold mb-4">Editar Máquina</Text>
            <TextInput
              className="border border-gray-300 p-2.5 rounded-lg mb-2.5"
              placeholder="Nombre de la máquina"
              value={selectedMachine?.name}
              onChangeText={(text) => selectedMachine && setSelectedMachine({...selectedMachine, name: text})}
            />
            <TextInput
              className="border border-gray-300 p-2.5 rounded-lg mb-2.5 h-24"
              placeholder="Descripción"
              value={selectedMachine?.description}
              onChangeText={(text) => selectedMachine && setSelectedMachine({...selectedMachine, description: text.slice(0, 200)})}
              multiline={true}
              numberOfLines={4}
              maxLength={200}
            />
            <Text className="text-gray-500 text-right mb-2">
              {selectedMachine?.description?.length || 0}/200 caracteres
            </Text>
            <View className="flex-row justify-end mt-4">
              <TouchableOpacity 
                className="bg-red-500 p-2.5 rounded-lg mr-2.5"
                onPress={() => {
                  setSelectedMachine(null)
                  setEditModalVisible(false)
                }}
              >
                <Text className="text-white font-bold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-blue-500 p-2.5 rounded-lg"
                onPress={handleUpdateMachine}
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

export default Machines