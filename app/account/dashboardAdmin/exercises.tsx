import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView, ActivityIndicator } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { ExerciseDAO, DifficultyDAO, PaginatedResponse } from '../../../interfaces/interfaces'
import { getExercises, postExercise, putExercise, deleteExercise, getDifficulties, getMachines } from '../../../lib/api_gymhouse'
import Pagination from '../../../components/organisms/paginacion'
import { useAuth } from '../../../context/AuthStore'

interface Machine {
  id: number;
  name: string;
  description: string;
}

const Exercises = () => {
  const { checkAuth } = useAuth()
  const [modalVisible, setModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDAO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [exercises, setExercises] = useState<ExerciseDAO[]>([])
  const [difficulties, setDifficulties] = useState<DifficultyDAO[]>([])
  const [machines, setMachines] = useState<Machine[]>([])
  const [searchName, setSearchName] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null)
  const [selectedMachine, setSelectedMachine] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize] = useState(10)
  const [tempSearchName, setTempSearchName] = useState('')
  const [tempSelectedDifficulty, setTempSelectedDifficulty] = useState<number | null>(null)
  const [tempSelectedMachine, setTempSelectedMachine] = useState<number | null>(null)
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
    const loadData = async () => {
      const isAuthenticated = await checkAuth()
      if (!isAuthenticated) return

      await Promise.all([
        fetchExercises(),
        fetchDifficulties(),
        fetchMachines()
      ])
    }
    loadData()
  }, [currentPage, searchName, selectedDifficulty, selectedMachine])

  const fetchExercises = async () => {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    const response: PaginatedResponse<ExerciseDAO> = await getExercises(
      currentPage,
      pageSize,
      searchName.trim() || undefined,
      selectedDifficulty || undefined,
      selectedMachine || undefined
    )
    setExercises(response.items)
    setTotalPages(response.pages)
    setLoading(false)
  }

  const fetchDifficulties = async () => {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    const response = await getDifficulties()
    setDifficulties(response)
  }

  const fetchMachines = async () => {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    const response = await getMachines()
    setMachines(response)
  }

  const handleAddExercise = async () => {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

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
  }

  const handleDeleteExercise = async (id: number) => {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    await deleteExercise(id)
    await fetchExercises()
  }

  const handleEditExercise = (exercise: ExerciseDAO) => {
    setSelectedExercise(exercise)
    setEditModalVisible(true)
  }

  const handleUpdateExercise = async () => {
    if (!selectedExercise?.id) return
    
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    await putExercise(selectedExercise.id, selectedExercise)
    await fetchExercises()
    setEditModalVisible(false)
  }

  const handleSearch = async () => {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    setLoading(true)
    setSearchName(tempSearchName)
    setSelectedDifficulty(tempSelectedDifficulty)
    setSelectedMachine(tempSelectedMachine)
    setCurrentPage(1)
    await fetchExercises()
  }

  const handleClearFilters = async () => {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    setLoading(true)
    setTempSearchName('')
    setTempSelectedDifficulty(null)
    setTempSelectedMachine(null)
    setSearchName('')
    setSelectedDifficulty(null)
    setSelectedMachine(null)
    setCurrentPage(1)
    await fetchExercises()
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
          onPress={fetchExercises}
        >
          <Text className="text-white font-bold">Reintentar</Text>
        </TouchableOpacity>
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
          value={tempSearchName}
          onChangeText={setTempSearchName}
        />
        
        <View className="flex-row justify-between mb-2.5">
          <View className="flex-1 mr-2">
            <View className="border border-gray-300 rounded-lg">
              <Picker
                selectedValue={tempSelectedDifficulty}
                onValueChange={setTempSelectedDifficulty}
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
                selectedValue={tempSelectedMachine}
                onValueChange={setTempSelectedMachine}
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

        <View className="flex-row space-x-2">
          <TouchableOpacity 
            className="flex-1 bg-blue-500 p-2.5 rounded-lg"
            onPress={handleSearch}
          >
            <Text className="text-white font-bold text-center">Buscar</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="flex-1 bg-gray-500 p-2.5 rounded-lg"
            onPress={handleClearFilters}
          >
            <Text className="text-white font-bold text-center">Limpiar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1">
        {exercises.map(exercise => (
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

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