import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { titulo, parrafo, parrafoNegrilla, fondoTotal } from '../../../components/tokens';

const DashboardAdmin = () => {
  return (
    <View className={`${fondoTotal} flex-1 justify-center items-center px-6`}>
      <Text className={titulo}>Bienvenido</Text>
      <Text className={parrafo}>
        Bienvenido al panel de administración de GymHouse, aquí podrás gestionar las etiquetas de las rutinas, los días de la semana, la dificultad de los ejercicios y los ejercicios en general.
      </Text>
    </View>
  );
};

export default DashboardAdmin;
