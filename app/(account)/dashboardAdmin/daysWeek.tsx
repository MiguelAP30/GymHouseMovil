import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { fondoRutina, tarjetaRutina, tituloDia, listaEjercicios } from '../../../components/tokens';

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
<ScrollView className={fondoRutina} contentContainerStyle={{ alignItems: 'center', paddingVertical: 20 }}>
  {Object.entries(routines).map(([day, exercises], index) => (
    <View key={index} className={tarjetaRutina}>
  <Text className={tituloDia}>{day}</Text>
  <View className="items-center"> {/* Aquí agregamos items-center */}
    {exercises.map((exercise, idx) => (
      <Text key={idx} className={listaEjercicios}>
        - {exercise}
      </Text>
    ))}
  </View>
</View>

  ))}
</ScrollView>

  );
};

export default daysWeek;
