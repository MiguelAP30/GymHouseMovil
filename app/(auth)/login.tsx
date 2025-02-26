import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginData } from '../../utils/LoginSchema';  
import { 
  tituloForm, labelForm, parrafoForm, inputForm, 
  botonGeneral, textoBotonGeneral, letraPequeñaForm, fondoTotal 
} from '../../components/tokens';
import { useNetwork } from '../../contexts/NetworkProvider';

export default function Login() {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const { isConnected } = useNetwork();

  const onSubmit = (data: LoginData) => {
    if (!isConnected) {
      Alert.alert("Error", "No tienes conexión a Internet");
      return;
    }
    Alert.alert("Inicio de sesión exitoso", JSON.stringify(data, null, 2));
  }

  return (
    <View className={`${fondoTotal} flex-1 px-6`}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingVertical: 20 }} showsVerticalScrollIndicator={false}>
        {isConnected === false && <Text className="text-red-500 mb-4">No tienes conexión a Internet</Text>}

        <Image source={require('../../assets/logo.png')} className="w-32 h-32 mb-6" />

        <Text className={tituloForm}>Bienvenido a GymHouse</Text>
        <Text className={parrafoForm}>Inicia sesión para continuar con tu entrenamiento personalizado</Text>

        {/* Campo: Correo */}
        <View className="w-full mt-6">
          <Text className={labelForm}>Correo electrónico</Text>
          <Controller
            control={control}
            name="email"
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
          {errors.email && <Text className="text-red-500">{errors.email.message}</Text>}
        </View>

        {/* Campo: Contraseña */}
        <View className="w-full mt-4">
          <Text className={labelForm}>Contraseña</Text>
          <Controller
            control={control}
            name="password"
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
          {errors.password && <Text className="text-red-500">{errors.password.message}</Text>}
        </View>

        {/* Botón de inicio de sesión */}
        <TouchableOpacity className={botonGeneral} onPress={handleSubmit(onSubmit)}>
          <Text className={textoBotonGeneral}>Iniciar sesión</Text>
        </TouchableOpacity>

        {/* Enlace a registro */}
        <Text className={letraPequeñaForm}>
          ¿No tienes una cuenta?  
          <Link href="/register" className="text-blue-400"> Regístrate</Link>
        </Text>
      </ScrollView>
    </View>
  );
}
