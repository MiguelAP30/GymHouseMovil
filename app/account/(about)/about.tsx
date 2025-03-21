import * as React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { titulo, parrafo, parrafoNegrilla, fondoTotal } from '../../../components/tokens';
import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthStore';
import { useRouter } from 'expo-router';

const About = () => {
    const { logout } = useContext(AuthContext);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.replace('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

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

        {/* Botón de Cerrar Sesión */}
        <TouchableOpacity 
          onPress={handleLogout}
          className="bg-red-600 px-6 py-3 rounded-lg mt-8"
        >
          <Text className="text-white font-bold text-base">Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    );
}

export default About;