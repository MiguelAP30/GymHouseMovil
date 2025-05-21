import { View, Text, TouchableOpacity, Modal, ScrollView, ActivityIndicator, TextInput } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { ExerciseDAO, DifficultyDAO } from '../../interfaces/exercise'
import { PaginatedResponse } from '../../interfaces/training'
import { getExercises, getDifficulties } from '../../lib/exercise'
import { getMachines } from '../../lib/machine'
import Pagination from '../organisms/paginacion'
import { useAuth } from '../../context/AuthStore'
import { router } from 'expo-router'
import { useNetInfo } from '@react-native-community/netinfo'

interface Machine {
  id: number;
  name: string;
  description: string;
}

interface ExerciseListProps {
  onExerciseSelect?: (exercise: ExerciseDAO) => void;
}

const ExerciseList = ({ onExerciseSelect }: ExerciseListProps) => {
  const netInfo = useNetInfo();
  const isConnected = netInfo.isConnected ?? false;
  const { checkAuth } = useAuth()
  const [viewModalVisible, setViewModalVisible] = useState(false)
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

  const handleViewExercise = (exercise: ExerciseDAO) => {
    setSelectedExercise(exercise)
    setViewModalVisible(true)
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
        <Text className="text-2xl font-bold text-black">Ejercicios</Text>
        <TouchableOpacity 
          className="bg-blue-500 px-4 py-2 rounded-lg flex-row items-center"
          onPress={() => router.push('/account/exercises/muscles')}
        >
          <Ionicons name="fitness" size={20} color="white" />
          <Text className="text-white font-bold ml-2">Músculos</Text>
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
            {isConnected && (
              <TouchableOpacity 
                key={exercise.id}
                onPress={() => {
                  if (onExerciseSelect) {
                    onExerciseSelect(exercise);
                  } else {
                    router.push(`/account/perfil/${exercise.id}`);
                  }
                }}
                className="ml-2.5"
              >
                <Ionicons name="eye" size={24} color="#007AFF" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page: number) => setCurrentPage(page)}
      />

      {/* Modal para ver ejercicio */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={viewModalVisible}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-5 rounded-lg w-4/5">
            <Text className="text-xl font-bold mb-4">{selectedExercise?.name}</Text>
            <Text className="text-gray-600 mb-4">{selectedExercise?.description}</Text>
            
            <View className="mb-4">
              <Text className="font-bold">Dificultad:</Text>
              <Text className="text-gray-600">
                {difficulties.find(d => d.id === selectedExercise?.dificulty_id)?.name || 'No especificada'}
              </Text>
            </View>

            <View className="mb-4">
              <Text className="font-bold">Máquina:</Text>
              <Text className="text-gray-600">
                {machines.find(m => m.id === selectedExercise?.machine_id)?.name || 'No especificada'}
              </Text>
            </View>

            {selectedExercise?.image && (
              <View className="mb-4">
                <Text className="font-bold">Imagen:</Text>
                <Text className="text-blue-500">{selectedExercise.image}</Text>
              </View>
            )}

            {selectedExercise?.video && (
              <View className="mb-4">
                <Text className="font-bold">Video:</Text>
                <Text className="text-blue-500">{selectedExercise.video}</Text>
              </View>
            )}

            <TouchableOpacity 
              className="bg-blue-500 p-2.5 rounded-lg mt-4"
              onPress={() => setViewModalVisible(false)}
            >
              <Text className="text-white font-bold text-center">Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default ExerciseList 