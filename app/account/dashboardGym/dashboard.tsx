import { View, Text } from 'react-native'
import React from 'react'
import { titulo, parrafo, parrafoNegrilla, fondoTotal } from '../../../components/tokens';


const Dashboard = () => {
  return (
    <View className={`${fondoTotal} flex-1 justify-center items-center px-6`}>
      <Text className={titulo}>Bienvenido</Text>
      <Text className={parrafo}>
        Bienvenido al panel de Gimnacios de GymHouse, aquí podrás gestionar tu gimnacio y tus usuarios.
      </Text>
    </View>
  )
}

export default Dashboard