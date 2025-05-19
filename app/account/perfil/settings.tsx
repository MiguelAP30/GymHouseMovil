import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthStore';
import { fondoTotal, botonGeneral, textoBotonGeneral } from '../../../components/tokens';

const Settings = () => {
    const router = useRouter();
    const { logout } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            await logout();
            router.replace('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <View className={`${fondoTotal} flex-1 p-6`}>
            {/* Logo Superior */}
            <Image source={require('../../../assets/logo.png')} className="w-20 h-20 mb-6 self-center" />

            {/* Botones de Navegación */}
            <TouchableOpacity 
                className={`${botonGeneral} mb-4`}
                onPress={() => router.push('/account/perfil/about')}
            >
                <Text className={textoBotonGeneral}>Sobre Nosotros</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                className={`${botonGeneral} mb-4`}
                onPress={() => router.push('/account/perfil/questions')}
            >
                <Text className={textoBotonGeneral}>Preguntas Frecuentes</Text>
            </TouchableOpacity>

            {/* Sección de Redes Sociales */}
            <View className="mt-8 mb-8">
                <Text className="text-white text-xl font-bold mb-4 text-center">Síguenos</Text>
                <View className="flex-row justify-center space-x-6">
                    <TouchableOpacity onPress={() => {}} className='pl-3'>
                        <Ionicons name="logo-instagram" size={32} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {}} className='pl-3'>
                        <Ionicons name="logo-facebook" size={32} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {}} className='pl-3'>
                        <Ionicons name="logo-youtube" size={32} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Botón de Cerrar Sesión */}
            <TouchableOpacity 
                className="bg-red-600 px-6 py-3 rounded-lg mt-auto"
                onPress={handleLogout}
            >
                <Text className="text-white font-bold text-base text-center">Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

export default Settings;