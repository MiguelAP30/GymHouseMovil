import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import { tituloForm, labelForm, parrafoForm,inputForm } from '../components/tokens';


export default function Login() {
  return (
    <View className="flex-1 justify-center items-center bg-gray-900 px-6">
      
      {/* Logo */}
      <Image source={require('../../assets/logo.png')} className="w-32 h-32 mb-6" />

      {/* Título */}
      <Text className={tituloForm}>Bienvenido a GymHouse</Text>
      <Text className={parrafoForm}>
        Inicia sesión para continuar con tu entrenamiento personalizado
      </Text>

      {/* Input: Correo */}
      <View className="w-full mt-6">
        <Text className={labelForm}>Correo electrónico</Text>
        <TextInput
          placeholder="tucorreo@ejemplo.com"
          placeholderTextColor="gray"
          className={inputForm}
        />
      </View>

      {/* Input: Contraseña */}
      <View className="w-full mt-4">
        <Text className={labelForm}>Contraseña</Text>
        <TextInput
          placeholder="********"
          placeholderTextColor="gray"
          secureTextEntry
          className={inputForm}
        />
      </View>

      {/* Botón: Iniciar sesión */}
      <TouchableOpacity className="bg-gray-700 w-full py-3 mt-6 rounded-lg">
        <Text className="text-center text-white text-lg font-semibold">Iniciar sesión</Text>
      </TouchableOpacity>

      {/* Enlace: Registro */}
      <Text className="text-gray-400 mt-4">
        ¿No tienes una cuenta? 
        <Link href="/register" className="text-blue-400"> Regístrate</Link>
      </Text>

    </View>
  );
}
