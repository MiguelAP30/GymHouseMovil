import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { 
  tituloForm, 
  labelForm, 
  parrafoForm,
  inputForm, 
  botonGeneral, 
  textoBotonGeneral, 
  letraPequeñaForm, 
  fondoTotal 
} from '../../components/tokens';

export default function Login() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogin = () => {
    Alert.alert("Estado de Conexión", isConnected ? "Estás conectado a Internet" : "No tienes conexión a Internet");
  };

  return (
    //Alerta en rojo para mostrar cuando no tiene conexion
    <View className={`${fondoTotal} flex-1 justify-center items-center px-6`}>
      {isConnected === false && (
        <Text className="text-red-500 mb-4">No tienes conexión a Internet</Text>
      )}
        
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
      <TouchableOpacity className={botonGeneral} onPress={handleLogin}>
        <Text className={textoBotonGeneral}>Iniciar sesión</Text>
      </TouchableOpacity>

      {/* Enlace: Registro */}
      <Text className={letraPequeñaForm}>
        ¿No tienes una cuenta? 
        <Link href="/register" className="text-blue-400"> Regístrate</Link>
      </Text>
    </View>
  );
}
