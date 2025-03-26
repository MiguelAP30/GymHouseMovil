import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView, ActivityIndicator } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { ExerciseDAO, DifficultyDAO } from '../../../interfaces/interfaces'
import { getExercises, postExercise, putExercise, deleteExercise, getDifficulties, getMachines } from '../../../lib/api_gymhouse'

interface Machine {
  id: number;
  name: string;
  description: string;
}

const Exercises = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDAO | null>(null)
  const [loading, setLoading] = useState(true)
  const [exercises, setExercises] = useState<ExerciseDAO[]>([])
  const [filteredExercises, setFilteredExercises] = useState<ExerciseDAO[]>([])
  const [difficulties, setDifficulties] = useState<DifficultyDAO[]>([])
  const [machines, setMachines] = useState<Machine[]>([])
  const [searchName, setSearchName] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null)
  const [selectedMachine, setSelectedMachine] = useState<number | null>(null)
  const [newExercise, setNewExercise] = useState<Omit<ExerciseDAO, 'id'>>({
    name: '',
    description: '',
    dateAdded: new Date().toISOString().split('T')[0],
    dificulty_id: 1,
    image: '',
    machine_id: 1,
    video: ''
  })

  useEffect(() => {
    fetchExercises()
    fetchDifficulties()
    fetchMachines()
  }, [])

  useEffect(() => {
    filterExercises()
  }, [exercises, searchName, selectedDifficulty, selectedMachine])

  const filterExercises = () => {
    let filtered = [...exercises]

    // Filter by name
    if (searchName.trim()) {
      filtered = filtered.filter(exercise => 
        exercise.name.toLowerCase().includes(searchName.toLowerCase())
      )
    }

    // Filter by difficulty
    if (selectedDifficulty) {
      filtered = filtered.filter(exercise => 
        exercise.dificulty_id === selectedDifficulty
      )
    }

    // Filter by machine
    if (selectedMachine) {
      filtered = filtered.filter(exercise => 
        exercise.machine_id === selectedMachine
      )
    }

    setFilteredExercises(filtered)
  }

  const fetchExercises = async () => {
    try {
      setLoading(true)
      const response = await getExercises()
      setExercises(response)
    } catch (error) {
      console.error('Error al obtener ejercicios:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDifficulties = async () => {
    try {
      const response = await getDifficulties()
      setDifficulties(response)
    } catch (error) {
      console.error('Error al obtener dificultades:', error)
    }
  }

  const fetchMachines = async () => {
    try {
      const response = await getMachines()
      setMachines(response)
    } catch (error) {
      console.error('Error al obtener máquinas:', error)
    }
  }

  const handleAddExercise = async () => {
    try {
      await postExercise(newExercise)
      await fetchExercises()
      setNewExercise({
        name: '',
        description: '',
        dateAdded: new Date().toISOString().split('T')[0],
        dificulty_id: 1,
        image: '',
        machine_id: 1,
        video: ''
      })
      setModalVisible(false)
    } catch (error) {
      console.error('Error al agregar ejercicio:', error)
    }
  }

  const handleDeleteExercise = async (id: number) => {
    try {
      await deleteExercise(id)
      await fetchExercises()
    } catch (error) {
      console.error('Error al eliminar ejercicio:', error)
    }
  }

  const handleEditExercise = (exercise: ExerciseDAO) => {
    setSelectedExercise(exercise)
    setEditModalVisible(true)
  }

  const handleUpdateExercise = async () => {
    if (!selectedExercise?.id) return
    
    try {
      await putExercise(selectedExercise.id, selectedExercise)
      await fetchExercises()
      setEditModalVisible(false)
    } catch (error) {
      console.error('Error al actualizar ejercicio:', error)
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
        <Text className="text-2xl font-bold">Ejercicios</Text>
        <TouchableOpacity 
          className="bg-blue-500 p-2.5 rounded-lg"
          onPress={() => setModalVisible(true)}
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
        
        <View className="flex-row justify-between mb-2.5">
          <View className="flex-1 mr-2">
            <View className="border border-gray-300 rounded-lg">
              <Picker
                selectedValue={selectedDifficulty}
                onValueChange={(value: number | null) => setSelectedDifficulty(value)}
                style={{ height: 50 }}
                mode="dropdown"
              >
                <Picker.Item label="Todas las dificultades" value={null} />
                {difficulties.map(difficulty => (
                  <Picker.Item 
                    key={difficulty.id} 
                    label={difficulty.name} 
                    value={difficulty.id} 
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View className="flex-1 ml-2">
            <View className="border border-gray-300 rounded-lg">
              <Picker
                selectedValue={selectedMachine}
                onValueChange={(value: number | null) => setSelectedMachine(value)}
                style={{ height: 50 }}
                mode="dropdown"
              >
                <Picker.Item label="Todas las máquinas" value={null} />
                {machines.map(machine => (
                  <Picker.Item 
                    key={machine.id} 
                    label={machine.name} 
                    value={machine.id} 
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          className="bg-gray-500 p-2.5 rounded-lg"
          onPress={() => {
            setSearchName('')
            setSelectedDifficulty(null)
            setSelectedMachine(null)
          }}
        >
          <Text className="text-white font-bold text-center">Limpiar filtros</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {filteredExercises.map(exercise => (
          <View key={exercise.id} className="bg-white p-4 rounded-lg mb-2.5 flex-row justify-between items-center shadow-md">
            <View className="flex-1">
              <Text className="text-lg font-bold">{exercise.name}</Text>
              <Text className="text-gray-600">{exercise.description}</Text>
              <Text className="text-blue-500 mt-1">
                Dificultad: {difficulties.find(d => d.id === exercise.dificulty_id)?.name || 'No especificada'}
              </Text>
              <Text className="text-blue-500">
                Máquina: {machines.find(m => m.id === exercise.machine_id)?.name || 'No especificada'}
              </Text>
            </View>
            <View className="flex-row">
              <TouchableOpacity 
                onPress={() => handleEditExercise(exercise)}
                className="mr-2.5"
              >
                <Ionicons name="pencil" size={24} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => exercise.id && handleDeleteExercise(exercise.id)}
                className="ml-2.5"
              >
                <Ionicons name="trash" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal para agregar ejercicio */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-5 rounded-lg w-4/5">
            <Text className="text-xl font-bold mb-4">Nuevo Ejercicio</Text>
            <TextInput
              className="border border-gray-300 p-2.5 rounded-lg mb-2.5"
              placeholder="Nombre del ejercicio"
              value={newExercise.name}
              onChangeText={(text) => setNewExercise({...newExercise, name: text})}
            />
            <TextInput
              className="border border-gray-300 p-2.5 rounded-lg mb-2.5"
              placeholder="Descripción"
              value={newExercise.description}
              onChangeText={(text) => setNewExercise({...newExercise, description: text})}
            />
            <View className="border border-gray-300 rounded-lg mb-2.5">
              <Picker
                selectedValue={newExercise.dificulty_id}
                onValueChange={(value: number) => setNewExercise({...newExercise, dificulty_id: value})}
                style={{ height: 50 }}
              >
                {difficulties.map(difficulty => (
                  <Picker.Item 
                    key={difficulty.id} 
                    label={difficulty.name} 
                    value={difficulty.id} 
                  />
                ))}
              </Picker>
            </View>
            <View className="border border-gray-300 rounded-lg mb-2.5">
              <Picker
                selectedValue={newExercise.machine_id}
                onValueChange={(value: number) => setNewExercise({...newExercise, machine_id: value})}
                style={{ height: 50 }}
              >
                {machines.map(machine => (
                  <Picker.Item 
                    key={machine.id} 
                    label={machine.name} 
                    value={machine.id} 
                  />
                ))}
              </Picker>
            </View>
            <TextInput
              className="border border-gray-300 p-2.5 rounded-lg mb-2.5"
              placeholder="URL de la imagen"
              value={newExercise.image}
              onChangeText={(text) => setNewExercise({...newExercise, image: text})}
            />
            <TextInput
              className="border border-gray-300 p-2.5 rounded-lg mb-2.5"
              placeholder="URL del video"
              value={newExercise.video}
              onChangeText={(text) => setNewExercise({...newExercise, video: text})}
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
                onPress={handleAddExercise}
              >
                <Text className="text-white font-bold">Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para editar ejercicio */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-5 rounded-lg w-4/5">
            <Text className="text-xl font-bold mb-4">Editar Ejercicio</Text>
            <TextInput
              className="border border-gray-300 p-2.5 rounded-lg mb-2.5"
              placeholder="Nombre del ejercicio"
              value={selectedExercise?.name}
              onChangeText={(text) => selectedExercise && setSelectedExercise({...selectedExercise, name: text})}
            />
            <TextInput
              className="border border-gray-300 p-2.5 rounded-lg mb-2.5"
              placeholder="Descripción"
              value={selectedExercise?.description}
              onChangeText={(text) => selectedExercise && setSelectedExercise({...selectedExercise, description: text})}
            />
            <View className="border border-gray-300 rounded-lg mb-2.5">
              <Picker
                selectedValue={selectedExercise?.dificulty_id}
                onValueChange={(value: number) => selectedExercise && setSelectedExercise({...selectedExercise, dificulty_id: value})}
                style={{ height: 50 }}
              >
                {difficulties.map(difficulty => (
                  <Picker.Item 
                    key={difficulty.id} 
                    label={difficulty.name} 
                    value={difficulty.id} 
                  />
                ))}
              </Picker>
            </View>
            <View className="border border-gray-300 rounded-lg mb-2.5">
              <Picker
                selectedValue={selectedExercise?.machine_id}
                onValueChange={(value: number) => selectedExercise && setSelectedExercise({...selectedExercise, machine_id: value})}
                style={{ height: 50 }}
              >
                {machines.map(machine => (
                  <Picker.Item 
                    key={machine.id} 
                    label={machine.name} 
                    value={machine.id} 
                  />
                ))}
              </Picker>
            </View>
            <TextInput
              className="border border-gray-300 p-2.5 rounded-lg mb-2.5"
              placeholder="URL de la imagen"
              value={selectedExercise?.image}
              onChangeText={(text) => selectedExercise && setSelectedExercise({...selectedExercise, image: text})}
            />
            <TextInput
              className="border border-gray-300 p-2.5 rounded-lg mb-2.5"
              placeholder="URL del video"
              value={selectedExercise?.video}
              onChangeText={(text) => selectedExercise && setSelectedExercise({...selectedExercise, video: text})}
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
                onPress={handleUpdateExercise}
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

export default Exercises