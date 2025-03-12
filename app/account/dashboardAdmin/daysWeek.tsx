import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React from 'react';

const daysWeek = () => {
  const routines = {
    Lunes: [
      'Sentadilla con barra',
      'Zancada Inversa',
      'Remo con pesas',
      'Press de banca',
      'Giro ruso',
      'Levantamiento con pesa ruso',
      'Curl de concentración',
    ],
    Martes: [
      'Flexiones de pecho',
      'Dominadas',
      'Remo con pesas',
      'Peso muerto',
      'Plancha abdominal',
      'Fondos en paralelas',
    ],
    Miércoles: [
      'Press militar',
      'Extensión de tríceps',
      'Sentadilla frontal',
      'Elevaciones laterales',
      'Remo con barra',
      'Hiperextensiones lumbares',
    ],
    Jueves: [
      'Burpees',
      'Saltos al cajón',
      'Mountain climbers',
      'Press inclinado con mancuernas',
      'Plancha lateral',
      'Sentadilla búlgara',
    ],
    Viernes: [
      'Press de banca',
      'Remo con barra',
      'Curl de bíceps',
      'Dominadas lastradas',
      'Peso muerto rumano',
      'Elevaciones de talones',
    ],
    Sábado: [
      'Cardio HIIT',
      'Cuerda para saltar',
      'Sprint en cinta',
      'Abdominales bicicleta',
      'Estiramientos dinámicos',
      'Jumping jacks',
    ],
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Object.entries(routines).map(([day, exercises], index) => (
        <View key={index} style={styles.dayContainer}>
          <Text style={styles.dayTitle}>{day}</Text>
          <View style={styles.exerciseContainer}>
            {exercises.map((exercise, idx) => (
              <Text key={idx} style={styles.exerciseText}>
                - {exercise}
              </Text>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#e6e6e6', 
    alignItems: 'center',
    paddingVertical: 20,
  },
  dayContainer: {
    width: '90%',
    backgroundColor: '#b3d1ff', 
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff', 
    marginBottom: 10,
  },
  exerciseContainer: {
    alignItems: 'center',
  },
  exerciseText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});

export default daysWeek;
