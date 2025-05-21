import { View, Text, Modal, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Picker } from '@react-native-picker/picker'
import ExerciseList from '../../../components/ecosystems/ExerciseList'
import { ExerciseDAO, SpecificMuscleDAO } from '../../../interfaces/exercise'
import { assignMusclesToExercise } from '../../../lib/exercise_muscle'
import { getSpecificMuscles } from '../../../lib/exercise'
import { Ionicons } from '@expo/vector-icons'

interface MuscleAssignment {
  rate: number;
  specific_muscle_id: number;
  specific_muscle_name?: string;
}

const RateExercises = () => {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDAO | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMuscle, setSelectedMuscle] = useState<number | null>(null);
  const [rate, setRate] = useState<string>('');
  const [muscleAssignments, setMuscleAssignments] = useState<MuscleAssignment[]>([]);
  const [specificMuscles, setSpecificMuscles] = useState<SpecificMuscleDAO[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (modalVisible) {
      fetchSpecificMuscles();
    }
  }, [modalVisible]);

  const fetchSpecificMuscles = async () => {
    try {
      setLoading(true);
      const muscles = await getSpecificMuscles();
      setSpecificMuscles(muscles);
    } catch (error) {
      console.error('Error fetching specific muscles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseSelect = (exercise: ExerciseDAO) => {
    setSelectedExercise(exercise);
    setModalVisible(true);
  };

  const handleAddMuscle = () => {
    if (selectedMuscle && rate && parseInt(rate) >= 1 && parseInt(rate) <= 10) {
      const muscleName = specificMuscles.find(m => m.id === selectedMuscle)?.name;
      setMuscleAssignments([
        ...muscleAssignments,
        {
          rate: parseInt(rate),
          specific_muscle_id: selectedMuscle,
          specific_muscle_name: muscleName
        }
      ]);
      setSelectedMuscle(null);
      setRate('');
    }
  };

  const handleRemoveMuscle = (index: number) => {
    setMuscleAssignments(muscleAssignments.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (selectedExercise && muscleAssignments.length > 0) {
      try {
        await assignMusclesToExercise({
          exercise_id: selectedExercise.id!,
          muscle_assignments: muscleAssignments.map(({ rate, specific_muscle_id }) => ({
            rate,
            specific_muscle_id
          }))
        });
        setModalVisible(false);
        setMuscleAssignments([]);
        setSelectedExercise(null);
      } catch (error) {
        console.error('Error saving muscle assignments:', error);
      }
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setMuscleAssignments([]);
    setSelectedExercise(null);
    setSelectedMuscle(null);
    setRate('');
  };

  return (
    <View className="flex-1">
      <ExerciseList onExerciseSelect={handleExerciseSelect} isSelectionMode={true} />
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancel}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-11/12 h-3/4 rounded-lg p-4">
            <Text className="text-xl font-bold mb-4">Asignar Músculos a {selectedExercise?.name}</Text>
            
            <View className="flex-row items-center mb-4">
              <View className="flex-[0.85] mr-2">
                <Text className="text-sm font-semibold mb-1">Músculo Específico</Text>
                <View className="border border-gray-300 rounded-lg">
                  <Picker
                    selectedValue={selectedMuscle}
                    onValueChange={setSelectedMuscle}
                    style={{ height: 50 }}
                  >
                    <Picker.Item label="Seleccione un músculo" value={null} />
                    {specificMuscles.map(muscle => (
                      <Picker.Item 
                        key={muscle.id} 
                        label={muscle.name} 
                        value={muscle.id} 
                      />
                    ))}
                  </Picker>
                </View>
              </View>
              
              <View className="flex-[0.15] mr-2">
                <Text className="text-sm font-semibold mb-1">Valor</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-2"
                  placeholder="1-10"
                  value={rate}
                  onChangeText={setRate}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
              
              <TouchableOpacity 
                onPress={handleAddMuscle}
                className="bg-blue-500 p-2 rounded-lg mt-6"
              >
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View className="flex-1">
              <Text className="text-lg font-semibold mb-2">Previsualización</Text>
              {muscleAssignments.length === 0 ? (
                <Text className="text-gray-500">Aún no se ha agregado músculos específicos</Text>
              ) : (
                <ScrollView className="flex-1">
                  {muscleAssignments.map((assignment, index) => (
                    <View key={index} className="flex-row justify-between items-center bg-gray-100 p-3 rounded-lg mb-2 shadow-sm">
                      <View className="flex-1">
                        <Text className="text-base font-medium text-gray-800">{assignment.specific_muscle_name}</Text>
                        <Text className="text-sm text-blue-600">Calificación: {assignment.rate}/10</Text>
                      </View>
                      <TouchableOpacity 
                        onPress={() => handleRemoveMuscle(index)}
                        className="ml-2 bg-red-100 p-2 rounded-full"
                      >
                        <Ionicons name="close-circle" size={24} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>

            <View className="flex-row justify-end space-x-2 mt-4">
              <TouchableOpacity 
                onPress={handleCancel}
                className="bg-gray-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-bold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleSave}
                className="bg-blue-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-bold">Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default RateExercises