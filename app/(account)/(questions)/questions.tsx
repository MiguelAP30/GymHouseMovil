import { View, Text, Image } from 'react-native';

export default function AboutUs() {
  return (
    <View className="flex-1 bg-gray-900 justify-center items-center px-6">

      {/* Logo Superior */}
      <Image source={require('../../../assets/logo.png')} className="w-20 h-20 mb-6" />

      {/* Título */}
      <Text className="text-blue-300 text-5xl font-bold underline text-center">Preguntas</Text>
      <Text className="text-blue-300 text-5xl font-bold underline text-center mb-6">Frecuentes</Text>

      {/* Descripción */}
      <Text className="text-gray-300 text-xl text-center leading-8">
        Somos un grupo de entusiastas del fitness que se unieron para crear 
        <Text className="font-bold text-white"> GymHouse</Text>, un lugar donde puedes encontrar 
        rutinas de ejercicios personalizadas y mucho más.
      </Text>

    </View>
  );
}
