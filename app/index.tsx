import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
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
} from '../components/tokens';
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'expo-router';
import { postLogin } from '../lib/api_gymhouse';
import { AuthContext } from '../validators/AuthStore';

export default function Index() {
  const { control, handleSubmit, formState: { errors } } = useForm<{ email: string; password: string }>();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const onSubmit = async (data: { email: string; password: string }) => {
    if (!isConnected) {
      Alert.alert("Error", "No hay conexión a internet");
      return;
    }

    setIsLoading(true);
    try {
      const response = await postLogin(data);
      await login(response.access_token, response.user);
      router.push('/account/about');
    } catch (error) {
      Alert.alert("Error", "Credenciales inválidas");
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