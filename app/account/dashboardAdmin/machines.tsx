import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'

interface Machine {
  id: number;
  name: string;
  description: string;
  status: string;
}

const Machines = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null)
  const [newMachine, setNewMachine] = useState<Omit<Machine, 'id'>>({
    name: '',
    description: '',
    status: 'Available'
  })

  const [machines, setMachines] = useState<Machine[]>([
    { id: 1, name: 'Cinta de Correr', description: 'Máquina cardiovascular', status: 'Available' },
    { id: 2, name: 'Banco de Pesas', description: 'Para ejercicios de fuerza', status: 'In maintenance' },
    { id: 3, name: 'Bicicleta Estática', description: 'Ejercicio cardiovascular', status: 'Available' },
    { id: 4, name: 'Máquina Smith', description: 'Para ejercicios compuestos', status: 'Available' }
  ])

  const handleAddMachine = () => {
    setMachines([...machines, { ...newMachine, id: machines.length + 1 }])
    setNewMachine({ name: '', description: '', status: 'Available' })
    setModalVisible(false)
  }

  const handleDeleteMachine = (id: number) => {
    setMachines(machines.filter(machine => machine.id !== id))
  }

  const handleEditMachine = (machine: Machine) => {
    setSelectedMachine(machine)
    setEditModalVisible(true)
  }

  const handleUpdateMachine = () => {
    if (!selectedMachine) return;
    
    setMachines(machines.map(machine => 
      machine.id === selectedMachine.id ? selectedMachine : machine
    ))
    setEditModalVisible(false)
  }

  return (
    <View className="flex-1 p-5 bg-gray-100">
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-2xl font-bold">Máquinas de Gimnasio</Text>
        <TouchableOpacity 
          className="bg-blue-500 p-2.5 rounded-lg"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-white font-bold">Agregar Máquina</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {machines.map(machine => (
          <View key={machine.id} className="bg-white p-4 rounded-lg mb-2.5 flex-row justify-between items-center shadow-md">
            <View>
              <Text className="text-lg font-bold">{machine.name}</Text>
              <Text className="text-gray-600">{machine.description}</Text>
              <Text className="text-blue-500 mt-1">Estado: {machine.status}</Text>
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
              className="border border-gray-300 p-2.5 rounded-lg mb-2.5"
              placeholder="Descripción"
              value={newMachine.description}
              onChangeText={(text) => setNewMachine({...newMachine, description: text})}
            />
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
              className="border border-gray-300 p-2.5 rounded-lg mb-2.5"
              placeholder="Descripción"
              value={selectedMachine?.description}
              onChangeText={(text) => selectedMachine && setSelectedMachine({...selectedMachine, description: text})}
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