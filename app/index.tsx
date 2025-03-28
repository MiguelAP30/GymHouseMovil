import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Link, router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { 
  MaterialCommunityIcons,
  FontAwesome,
  Ionicons,
  MaterialIcons
} from '@expo/vector-icons';
import { 
  tituloForm, 
  labelForm, 
  parrafoForm,
  inputForm, 
  botonGeneral, 
  textoBotonGeneral, 
  letraPequeñaForm, 
  fondoTotal 
} from '../components/tokens';
import { useEffect, useState, useContext } from 'react';
import { useAuth } from '../context/AuthStore';
import { postLogin } from '../lib/api_gymhouse';
import { ConnectivityContext } from './_layout';

export default function Index() {
  const { isConnected } = useContext(ConnectivityContext);
  const [isLoading, setIsLoading] = useState(false);
  const { login, logout, isAuthenticated, user, token, checkAuth } = useAuth();
  const { control, handleSubmit, formState: { errors } } = useForm<{ email: string; password: string }>();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        if (isAuthenticated && user && token) {
          // Solo verificamos el token si no estamos en medio de una actualización
          const isValid = await checkAuth();
          if (isValid) {
            router.push('/account/about');
          } else {
            await logout();
          }
        } else if (token && !isAuthenticated) {
          // Si hay token pero no hay usuario autenticado, intentamos recuperar el estado
          const isValid = await checkAuth();
          if (!isValid) {
            await logout();
          }
        }
      } catch (error) {
        console.error('Error en checkAuthAndRedirect:', error);
        await logout();
      }
    };

    // Solo ejecutamos la verificación si hay un cambio en el estado de autenticación
    if (isAuthenticated !== null) {
      checkAuthAndRedirect();
    }
  }, [isAuthenticated]);

  const onSubmit = async (data: { email: string; password: string }) => {
    if (!isConnected) {
      Alert.alert("Error", "No hay conexión a internet");
      return;
    }

    setIsLoading(true);
    try {
      const formData = {
        ...data,
        email: data.email.toLowerCase()
      };
      
      console.log('Intentando login con:', formData.email);
      const response = await postLogin(formData);
      
      if (!response.access_token || !response.user) {
        throw new Error('Respuesta del servidor incompleta');
      }
      
      console.log('Login exitoso, guardando token y datos del usuario');
      await login(response.access_token, response.user);
      
      // Verificamos que la autenticación sea válida antes de redirigir
      const isValid = await checkAuth();
      if (isValid) {
        router.push('/account/about');
      } else {
        throw new Error('Error al verificar la autenticación');
      }
    } catch (error) {
      console.error('Error en login:', error);
      Alert.alert(
        "Error", 
        error instanceof Error ? error.message : "Error al iniciar sesión"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className={`${fondoTotal} flex-1 px-6`}>
      <ScrollView 
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }} 
        showsVerticalScrollIndicator={false} 
      >
        {isConnected === false && (
          <Text className="text-red-500 mb-4">No tienes conexión a Internet</Text>
        )}
          
        {/* Logo */}
        <Image source={require('../assets/logo.png')} className="w-32 h-32 mb-6" />

        {/* Título */}
        <Text className={tituloForm}>Bienvenido a GymHouse</Text>
        <Text className={parrafoForm}>
          Inicia sesión para continuar con tu entrenamiento personalizado
        </Text>

        {/* Input: Correo */}
        <View className="w-full mt-6">
          <Text className={labelForm}>Correo electrónico</Text>
          <Controller
            control={control}
            name="email"
            rules={{ required: "El correo es obligatorio", pattern: { value: /\S+@\S+\.\S+/, message: "Correo inválido" } }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="tucorreo@ejemplo.com"
                placeholderTextColor="gray"
                className={inputForm}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.email && <Text className="text-red-500">{errors.email.message?.toString()}</Text>}
        </View>

        {/* Input: Contraseña */}
        <View className="w-full mt-4">
          <Text className={labelForm}>Contraseña</Text>
          <Controller
            control={control}
            name="password"
            rules={{ required: "La contraseña es obligatoria", minLength: { value: 6, message: "Mínimo 6 caracteres" } }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="********"
                placeholderTextColor="gray"
                secureTextEntry
                className={inputForm}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.password && <Text className="text-red-500">{errors.password.message?.toString()}</Text>}
        </View>

        {/* Botón: Iniciar sesión */}
        <TouchableOpacity 
          className={`${botonGeneral} ${isLoading ? 'opacity-50' : ''}`} 
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          <Text className={textoBotonGeneral}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Text>
        </TouchableOpacity>

        {/* Enlace: Registro */}
        <Text className={letraPequeñaForm}>
          ¿No tienes una cuenta? 
          <Link href="/register" className="text-blue-400"> Regístrate</Link>
        </Text>
      </ScrollView>
    </View>
  );
}