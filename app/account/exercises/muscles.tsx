import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import InteractiveSvg from '../../../components/organisms/InteractiveSvg';

// Definimos los grupos musculares y sus colores
const muscleGroups = [
  { id: 'hair', name: 'Pelo', color: '#FF5733' },
  { id: 'rostro', name: 'Rostro', color: '#33FF57' },
  { id: 'cuello', name: 'Cuello', color: '#FF4733' },
  { id: 'trapecios', name: 'Trapecios', color: '#FF4733' },
  { id: 'hombros', name: 'Hombros', color: '#FF4733' },
  { id: 'pecho', name: 'Pecho', color: '#FF4733' },
  { id: 'biceps', name: 'Biceps', color: '#33FFF3' },
  { id: 'antebrazos', name: 'Antebrazos', color: '#FF4733' },
  { id: 'Manos', name: 'Manos', color: '#FF33F3' },
  { id: 'abs', name: 'Abdominales', color: '#33FFF3' },
  { id: 'oblicuos', name: 'Oblicuos', color: '#FF4733' },
  { id: 'cuadriceps', name: 'Cuadriceps', color: '#FF4733' },
  { id: 'articulacionRodillas', name: 'Rodillas', color: '#F3FF33' },
  { id: 'pantorrillas', name: 'Pantorrillas', color: '#3357FF' },
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
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Grupos Musculares',
          headerTitleStyle: styles.headerTitle,
        }} 
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.svgContainer}>
          <InteractiveSvg 
            width={300} 
            height={550} 
            style={styles.svg}
            selectedMuscle={selectedMuscle}
            muscleColors={muscleColors}
            onMusclePress={handleMusclePress}
          />
        </View>
        
        <View style={styles.muscleGroupsContainer}>
          <Text style={styles.sectionTitle}>Grupos musculares:</Text>
          
          <View style={styles.muscleGroupsGrid}>
            {muscleGroups.map((muscle) => (
              <TouchableOpacity
                key={muscle.id}
                style={[
                  styles.muscleGroupButton,
                  { backgroundColor: muscle.color },
                  selectedMuscle === muscle.id && styles.selectedMuscleGroup
                ]}
                onPress={() => handleMusclePress(muscle.id)}
              >
                <Text style={styles.muscleGroupText}>{muscle.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {selectedMuscle && (
          <View style={styles.exercisesContainer}>
            <Text style={styles.sectionTitle}>
              Ejercicios para {muscleGroups.find(m => m.id === selectedMuscle)?.name}:
            </Text>
            <Text style={styles.exerciseText}>• Press de banca</Text>
            <Text style={styles.exerciseText}>• Flexiones</Text>
            <Text style={styles.exerciseText}>• Aperturas con mancuernas</Text>
            <Text style={styles.exerciseText}>• Press inclinado</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  svgContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  svg: {
    width: '100%',
    height: 550,
  },
  muscleGroupsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  muscleGroupsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  muscleGroupButton: {
    width: '48%',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedMuscleGroup: {
    borderWidth: 3,
    borderColor: '#000',
  },
  muscleGroupText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  exercisesContainer: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 30,
  },
  exerciseText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
});
