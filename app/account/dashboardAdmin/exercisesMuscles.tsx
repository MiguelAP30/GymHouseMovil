import { View, Text, Modal, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import ExerciseList from '../../../components/ecosystems/ExerciseList'
import { ExerciseDAO } from '../../../interfaces/exercise'
import { SpecificMuscleDAO } from '../../../interfaces/exercise'
import { getExerciseMusclesByExercise } from '../../../lib/exercise_muscle'
import { getSpecificMuscleById } from '../../../lib/exercise'
import { Ionicons } from '@expo/vector-icons'

interface MuscleRate {
  id: number;
  exercise_id: number;
  specific_muscle_id: number;
  rate: number;
  specific_muscle?: {
    name: string;
    id: number;
    muscle_id: number;
    description: string;
  };
}

const ExercisesMuscles = () => {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDAO | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [muscleRates, setMuscleRates] = useState<MuscleRate[]>([]);
  const [loading, setLoading] = useState(false);

  const handleViewMuscles = async (exercise: ExerciseDAO) => {
    setSelectedExercise(exercise);
    setModalVisible(true);
    await fetchMuscleRates(exercise.id!);
  };

  const fetchMuscleRates = async (exerciseId: number) => {
    try {
      setLoading(true);
      const rates = await getExerciseMusclesByExercise(exerciseId);
      
      // Fetch specific muscle details for each rate
      const ratesWithMuscleDetails = await Promise.all(
        rates.map(async (rate: { id: number; exercise_id: number; specific_muscle_id: number; rate: number }) => {
          const response = await getSpecificMuscleById(rate.specific_muscle_id);
          return {
            ...rate,
            specific_muscle: response.data
          };
        })
      );
      
      setMuscleRates(ratesWithMuscleDetails);
    } catch (error) {
      console.error('Error fetching muscle rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedExercise(null);
    setMuscleRates([]);
  };

  return (
    <View className="flex-1">
      <ExerciseList 
        onExerciseSelect={handleViewMuscles} 
        isSelectionMode={true}
        customActionIcon="eye"
      />
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-11/12 h-3/4 rounded-lg p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">{selectedExercise?.name}</Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Ionicons name="close-circle" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {loading ? (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#007AFF" />
              </View>
            ) : (
              <ScrollView className="flex-1">
                {muscleRates.length === 0 ? (
                  <Text className="text-gray-500 text-center mt-4">
                    No hay músculos asignados a este ejercicio
                  </Text>
                ) : (
                  muscleRates.map((muscleRate) => (
                    <View 
                      key={muscleRate.id} 
                      className="bg-gray-100 p-3 rounded-lg mb-2 shadow-sm"
                    >
                      <Text className="text-base font-medium text-gray-800">
                        {muscleRate.specific_muscle?.name}
                      </Text>
                      <Text className="text-sm text-blue-600">
                        Calificación: {muscleRate.rate}/10
                      </Text>
                    </View>
                  ))
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default ExercisesMuscles
