import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { useState, useContext } from 'react';
import { 
  tituloForm, labelForm, parrafoForm, inputForm, 
  botonGeneral, textoBotonGeneral, letraPequeñaForm, fondoTotal 
} from '../components/tokens';
import { postRegister } from '../lib/api_gymhouse';
import { AuthContext } from '../context/AuthStore';

interface RegisterFormData {
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  id_number: string;
  username: string;
  birth_date: string;
  gender: string;
}

export default function Register() {
  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const formData = {
        ...data,
        email: data.email.toLowerCase()
      };
      const response = await postRegister(formData);
      if (response.access_token) {
        await login(response.access_token, response.user);
        router.push('/account/about');
      } else {
        Alert.alert("Error", "Error al registrar usuario");
      }
    } catch (error) {
      Alert.alert("Error", "Error al registrar usuario");
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
        {/* Logo */}
        <Image source={require('../assets/logo.png')} className="w-32 h-32 mt-8 mb-6" />

        {/* Título */}
        <Text className={tituloForm}>Regístrate en GymHouse</Text>
        <Text className={parrafoForm}>
          Crea una cuenta para acceder a entrenamientos personalizados
        </Text>

        {/* Input: Nombre */}
        <View className="w-full mt-6">
          <Text className={labelForm}>Nombre completo</Text>
          <Controller
            control={control}
            name="name"
            rules={{ required: "El nombre es obligatorio" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Tu nombre completo"
                placeholderTextColor="gray"
                className={inputForm}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.name && <Text className="text-red-500">{errors.name.message}</Text>}
        </View>

        {/* Input: Nombre de usuario */}
        <View className="w-full mt-4">
          <Text className={labelForm}>Nombre de usuario</Text>
          <Controller
            control={control}
            name="username"
            rules={{ required: "El nombre de usuario es obligatorio" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Tu nombre de usuario"
                placeholderTextColor="gray"
                className={inputForm}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.username && <Text className="text-red-500">{errors.username.message}</Text>}
        </View>

        {/* Input: Número de identificación */}
        <View className="w-full mt-4">
          <Text className={labelForm}>Número de identificación</Text>
          <Controller
            control={control}
            name="id_number"
            rules={{ required: "El número de identificación es obligatorio" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Tu número de identificación"
                placeholderTextColor="gray"
                className={inputForm}
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.id_number && <Text className="text-red-500">{errors.id_number.message}</Text>}
        </View>

        {/* Input: Correo */}
        <View className="w-full mt-4">
          <Text className={labelForm}>Correo electrónico</Text>
          <Controller
            control={control}
            name="email"
            rules={{ 
              required: "El correo es obligatorio",
              pattern: { value: /\S+@\S+\.\S+/, message: "Correo inválido" }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="tucorreo@ejemplo.com"
                placeholderTextColor="gray"
                className={inputForm}
                keyboardType="email-address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.email && <Text className="text-red-500">{errors.email.message}</Text>}
        </View>

        {/* Input: Contraseña */}
        <View className="w-full mt-4">
          <Text className={labelForm}>Contraseña</Text>
          <Controller
            control={control}
            name="password"
            rules={{ 
              required: "La contraseña es obligatoria",
              minLength: { value: 6, message: "Mínimo 6 caracteres" }
            }}
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

        {/* Input: Teléfono */}
        <View className="w-full mt-4">
          <Text className={labelForm}>Teléfono</Text>
          <Controller
            control={control}
            name="phone"
            rules={{ required: "El teléfono es obligatorio" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Tu número de teléfono"
                placeholderTextColor="gray"
                className={inputForm}
                keyboardType="phone-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.phone && <Text className="text-red-500">{errors.phone.message}</Text>}
        </View>

        {/* Input: Dirección */}
        <View className="w-full mt-4">
          <Text className={labelForm}>Dirección</Text>
          <Controller
            control={control}
            name="address"
            rules={{ required: "La dirección es obligatoria" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Tu dirección"
                placeholderTextColor="gray"
                className={inputForm}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.address && <Text className="text-red-500">{errors.address.message}</Text>}
        </View>

        {/* Input: Fecha de nacimiento */}
        <View className="w-full mt-4">
          <Text className={labelForm}>Fecha de nacimiento</Text>
          <Controller
            control={control}
            name="birth_date"
            rules={{ required: "La fecha de nacimiento es obligatoria" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="YYYY-MM-DD"
                placeholderTextColor="gray"
                className={inputForm}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.birth_date && <Text className="text-red-500">{errors.birth_date.message}</Text>}
        </View>

        {/* Input: Género */}
        <View className="w-full mt-4">
          <Text className={labelForm}>Género</Text>
          <Controller
            control={control}
            name="gender"
            rules={{ required: "El género es obligatorio" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Tu género"
                placeholderTextColor="gray"
                className={inputForm}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.gender && <Text className="text-red-500">{errors.gender.message}</Text>}
        </View>

        {/* Botón: Registrarse */}
        <TouchableOpacity 
          className={`${botonGeneral} mt-6 ${isLoading ? 'opacity-50' : ''}`}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          <Text className={textoBotonGeneral}>
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </Text>
        </TouchableOpacity>

        {/* Enlace: Inicio de sesión */}
        <Text className={letraPequeñaForm}>
          ¿Ya tienes una cuenta?  
          <Link href="/" className="text-blue-400"> Iniciar sesión</Link>
        </Text>
      </ScrollView>
    </View>
  );
}
