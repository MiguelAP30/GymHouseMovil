import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { fondoEjercicios, tarjetaEjercicio, tituloEjercicio, descripcionEjercicio } from '../../../components/tokens';

const exercisesList = [
  { name: 'Sentadilla con barra', muscles: 'Piernas, Glúteos' },
  { name: 'Press de banca', muscles: 'Pectorales, Tríceps, Hombros' },
  { name: 'Dominadas', muscles: 'Espalda, Bíceps' },
  { name: 'Peso muerto', muscles: 'Espalda baja, Glúteos, Isquiotibiales' },
  { name: 'Curl de bíceps', muscles: 'Bíceps' },
  { name: 'Plancha abdominal', muscles: 'Core' },
];

const exercises = () => {
  return (
    <ScrollView className={fondoEjercicios} contentContainerStyle={{ alignItems: 'center', paddingVertical: 20 }}>
      {exercisesList.map((exercise, index) => (
        <View key={index} className={tarjetaEjercicio}>
          <Text className={tituloEjercicio}>{exercise.name}</Text>
          <Text className={descripcionEjercicio}>Músculos trabajados: {exercise.muscles}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default exercises;
