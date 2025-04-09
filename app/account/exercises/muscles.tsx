import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import InteractiveSvg from '../../../components/organisms/InteractiveSvg';

// Definimos los grupos musculares y sus colores
const muscleGroups = [
  { id: 'hair', name: 'Pelo', color: '#8B4513' },      // Marrón
  { id: 'rostro', name: 'Rostro', color: '#FFB6C1' },  // Rosa claro
  { id: 'cuello', name: 'Cuello', color: '#FFA07A' },  // Salmón
  { id: 'trapecios', name: 'Trapecios', color: '#20B2AA' }, // Verde mar
  { id: 'hombros', name: 'Hombros', color: '#9370DB' }, // Púrpura medio
  { id: 'pecho', name: 'Pecho', color: '#FF6347' },    // Rojo tomate
  { id: 'biceps', name: 'Biceps', color: '#4169E1' },  // Azul real
  { id: 'antebrazos', name: 'Antebrazos', color: '#32CD32' }, // Verde lima
  { id: 'Manos', name: 'Manos', color: '#FF69B4' },    // Rosa hot
  { id: 'abs', name: 'Abdominales', color: '#FFD700' }, // Dorado
  { id: 'oblicuos', name: 'Oblicuos', color: '#FF4500' }, // Rojo naranja
  { id: 'cuadriceps', name: 'Cuadriceps', color: '#4B0082' }, // Índigo
  { id: 'articulacionRodillas', name: 'Rodillas', color: '#808080' }, // Gris
  { id: 'pantorrillas', name: 'Pantorrillas', color: '#00CED1' }, // Turquesa
];

export default function MusclesScreen() {
  const [selectedMuscle, setSelectedMuscle] = useState<string | undefined>(undefined);

  const handleMusclePress = (muscleId: string) => {
    setSelectedMuscle(muscleId);
  };

  // Crear un objeto con los colores de los músculos
  const muscleColors = muscleGroups.reduce((acc, muscle) => {
    acc[muscle.id] = muscle.color;
    return acc;
  }, {} as Record<string, string>);

  return (
    <View className="flex-1 bg-gray-100">
      <Stack.Screen 
        options={{
          title: 'Grupos Musculares',
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />
      
      <ScrollView className="flex-1">
        <View className="items-center p-5 bg-white m-2.5 rounded-lg shadow-md">
          <InteractiveSvg 
            width={300} 
            height={550} 
            className="w-full h-[550px]"
            selectedMuscle={selectedMuscle}
            muscleColors={muscleColors}
            onMusclePress={handleMusclePress}
          />
        </View>
        
        <View className="p-5 bg-white m-2.5 rounded-lg shadow-md">
          <Text className="text-lg font-bold mb-4 text-gray-800">Grupos musculares:</Text>
          
          <View className="flex-row flex-wrap justify-between">
            {muscleGroups.map((muscle) => (
              <TouchableOpacity
                key={muscle.id}
                className={`w-[48%] p-4 rounded-lg mb-2.5 items-center justify-center ${selectedMuscle === muscle.id ? 'border-2 border-black' : ''}`}
                style={{ backgroundColor: muscle.color }}
                onPress={() => handleMusclePress(muscle.id)}
              >
                <Text className="text-white font-bold text-base">{muscle.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {selectedMuscle && (
          <View className="p-5 bg-white m-2.5 rounded-lg shadow-md mb-8">
            <Text className="text-lg font-bold mb-4 text-gray-800">
              Ejercicios para {muscleGroups.find(m => m.id === selectedMuscle)?.name}:
            </Text>
            <Text className="text-base mb-2.5 text-gray-700">• Press de banca</Text>
            <Text className="text-base mb-2.5 text-gray-700">• Flexiones</Text>
            <Text className="text-base mb-2.5 text-gray-700">• Aperturas con mancuernas</Text>
            <Text className="text-base mb-2.5 text-gray-700">• Press inclinado</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
