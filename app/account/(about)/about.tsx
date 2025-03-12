
import * as React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { titulo, parrafo, parrafoNegrilla, fondoTotal } from '../../../components/tokens';



const About = () => {
    return (
      <View className={`${fondoTotal} flex-1 justify-center items-center px-6`}>
        {/* Logo Superior */}
        <Image source={require('../../../assets/logo.png')} className="w-20 h-20 mb-6" />

        {/* Título */}    
        <Text className={titulo}>Sobre</Text>
        <Text className={`${titulo} mb-6`}>Nosotros</Text>

        {/* Descripción */}
        <Text className={parrafo}>
          Somos un grupo de entusiastas del fitness que se unieron para crear 
          <Text className={parrafoNegrilla}> GymHouse</Text>, un lugar donde puedes encontrar 
          rutinas de ejercicios personalizadas y mucho más.
        </Text>
      </View>
      );
}

export default About