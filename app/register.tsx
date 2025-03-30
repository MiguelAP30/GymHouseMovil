import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { useState, useContext } from 'react';
import * as React from 'react';
import { 
  tituloForm, labelForm, parrafoForm, inputForm, 
  botonGeneral, textoBotonGeneral, letraPequeñaForm, fondoTotal, 
  inputFormPicker
} from '../components/tokens';
import { postRegister } from '../lib/api_gymhouse';
import { AuthContext } from '../context/AuthStore';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

interface RegisterFormData {
  email: string; // Maximo 250 caracteres
  password: string; // Maximo 60 caracteres
  name: string; // Maximo 50 caracteres
  phone: string; // Maximo 20 caracteres
  address: string; // Maximo 150 caracteres
  id_number: string; // Maximo 20 caracteres
  user_name: string; // Maximo 50 caracteres
  birth_date: string; // Formato: YYYY-MM-DD
  gender: string; // 'm' o 'f'
}

export default function Register() {
  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const validateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age >= 10;
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getMaxDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 10);
    return date;
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const formData = {
        ...data,
        email: data.email.toLowerCase()
      };
      const response = await postRegister(formData);
      
      if (!response.access_token || !response.user) {
        throw new Error('Respuesta del servidor incompleta');
      }
      
      await login(response.access_token, response.user);
      router.push('/account/about');
    } catch (error) {
      console.error('Error en registro:', error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Error al registrar usuario"
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
            rules={{ 
              required: "El nombre es obligatorio",
              maxLength: { value: 50, message: "Máximo 50 caracteres" }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Tu nombre completo"
                placeholderTextColor="gray"
                className={inputForm}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                maxLength={50}
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
            name="user_name"
            rules={{ 
              required: "El nombre de usuario es obligatorio",
              maxLength: { value: 50, message: "Máximo 50 caracteres" }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Tu nombre de usuario"
                placeholderTextColor="gray"
                className={inputForm}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                maxLength={50}
              />
            )}
          />
          {errors.user_name && <Text className="text-red-500">{errors.user_name.message}</Text>}
        </View>

        {/* Input: Número de identificación */}
        <View className="w-full mt-4">
          <Text className={labelForm}>Número de identificación</Text>
          <Controller
            control={control}
            name="id_number"
            rules={{ 
              required: "El número de identificación es obligatorio",
              maxLength: { value: 20, message: "Máximo 20 caracteres" }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Tu número de identificación"
                placeholderTextColor="gray"
                className={inputForm}
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                maxLength={20}
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
              pattern: { value: /\S+@\S+\.\S+/, message: "Correo inválido" },
              maxLength: { value: 250, message: "Máximo 250 caracteres" }
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
                maxLength={250}
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
              minLength: { value: 6, message: "Mínimo 6 caracteres" },
              maxLength: { value: 60, message: "Máximo 60 caracteres" }
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
                maxLength={60}
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
            rules={{ 
              required: "El teléfono es obligatorio",
              maxLength: { value: 20, message: "Máximo 20 caracteres" }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Tu número de teléfono"
                placeholderTextColor="gray"
                className={inputForm}
                keyboardType="phone-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                maxLength={20}
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
            rules={{ 
              required: "La dirección es obligatoria",
              maxLength: { value: 150, message: "Máximo 150 caracteres" }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Tu dirección"
                placeholderTextColor="gray"
                className={inputForm}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                maxLength={150}
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
            rules={{ 
              required: "La fecha de nacimiento es obligatoria",
              validate: (value) => validateAge(value) || "Debes ser mayor de 10 años"
            }}
            render={({ field: { onChange, value } }) => (
              <>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className={inputForm}
                >
                  <Text style={{ color: value ? '#fff' : 'gray' }}>
                    {value ? value : 'YYYY-MM-DD'}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={value ? new Date(value) : new Date(getMaxDate())}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                      setShowDatePicker(Platform.OS === 'ios');
                      if (selectedDate) {
                        onChange(formatDate(selectedDate));
                      }
                    }}
                    maximumDate={getMaxDate()}
                  />
                )}
              </>
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
              <View className={inputFormPicker}>
                <Picker
                  selectedValue={value}
                  onValueChange={(itemValue) => onChange(itemValue)}
                  onBlur={onBlur}
                  style={{ color: '#fff' }}
                >
                  <Picker.Item label="Selecciona un género" value="" enabled={false} style={{ color: 'gray' }} />
                  <Picker.Item label="Masculino" value="m" style={{ color: '#000' }} />
                  <Picker.Item label="Femenino" value="f" style={{ color: '#000' }} />
                </Picker>
              </View>
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
