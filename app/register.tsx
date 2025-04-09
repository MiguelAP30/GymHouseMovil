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
import { postRegister, resendVerificationCode, verifyEmail } from '../lib/api_gymhouse';
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

interface VerificationFormData {
  email: string;
  verification_code: string;
}

export default function Register() {
  const { control, handleSubmit, formState: { errors }, reset } = useForm<RegisterFormData>();
  const { control: verificationControl, handleSubmit: handleVerificationSubmit, formState: { errors: verificationErrors }, setValue: setVerificationValue, reset: resetVerification } = useForm<VerificationFormData>({
    defaultValues: {
      verification_code: '',
      email: ''
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isVerificationMode, setIsVerificationMode] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
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

  const onVerificationSubmit = async (data: VerificationFormData) => {
    setIsLoading(true);
    try {
      // Asegurar que el email esté en minúsculas y sin espacios
      const cleanEmail = registeredEmail.toLowerCase().trim();
      
      const response = await verifyEmail({
        email: cleanEmail,
        verification_code: data.verification_code
      });
      
      if (response.status === 200) {
        Alert.alert(
          "Verificación exitosa",
          "Tu correo ha sido verificado. Ahora puedes iniciar sesión.",
          [
            {
              text: "OK",
              onPress: () => router.push('/')
            }
          ]
        );
      } else {
        throw new Error('Error en la verificación');
      }
    } catch (error) {
      console.error('Error en verificación:', error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Error al verificar el código"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      // Asegurar que el email esté en minúsculas y sin espacios
      const cleanEmail = registeredEmail.toLowerCase().trim();
      
      await resendVerificationCode({ email: cleanEmail });
      Alert.alert(
        "Código reenviado",
        "Se ha enviado un nuevo código de verificación a tu correo electrónico."
      );
    } catch (error) {
      console.error('Error al reenviar código:', error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Error al reenviar el código de verificación"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Función para limpiar los campos del formulario
  const resetForm = () => {
    reset({
      email: '',
      password: '',
      name: '',
      phone: '',
      address: '',
      id_number: '',
      user_name: '',
      birth_date: '',
      gender: ''
    });
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const formData = {
        ...data,
        email: data.email.toLowerCase().trim(),
        name: data.name.toLowerCase().trim(),
        user_name: data.user_name.toLowerCase().trim(),
        id_number: data.id_number.toLowerCase().trim(),
        phone: data.phone.toLowerCase().trim(),
        address: data.address.toLowerCase().trim()
      };
      
      const response = await postRegister(formData);
      
      if (response.status === 201) {
        // Limpiar todos los campos del formulario
        resetForm();
        
        Alert.alert(
          "Registro exitoso",
          "Por favor verifica tu correo electrónico para continuar. Ve a la página de inicio y haz clic en 'Verificar código'.",
          [
            {
              text: "OK",
              onPress: () => router.push('/')
            }
          ]
        );
      } else {
        throw new Error('Error en el registro');
      }
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

  if (isVerificationMode) {
    return (
      <View className={`${fondoTotal} flex-1 px-6`}>
        <ScrollView 
          contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }} 
          showsVerticalScrollIndicator={false} 
        >
          {/* Logo */}
          <Image 
            source={require('../assets/logo.png')} 
            className="w-40 h-40 mt-8 mb-8 rounded-3xl" 
          />

          {/* Título */}
          <Text className={tituloForm}>Verifica tu correo electrónico</Text>
          <Text className={parrafoForm}>
            Ingresa el código de verificación enviado a {registeredEmail}
          </Text>

          {/* Input: Código de verificación */}
          <View className="w-full mt-6">
            <Text className={labelForm}>Código de verificación</Text>
            <Controller
              control={verificationControl}
              name="verification_code"
              rules={{ 
                required: "El código de verificación es obligatorio",
                minLength: { value: 6, message: "El código debe tener al menos 6 caracteres" },
                maxLength: { value: 10, message: "El código no puede tener más de 10 caracteres" },
                pattern: { value: /^[0-9]+$/, message: "Solo se permiten números" }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Ingresa el código (hasta 10 dígitos)"
                  placeholderTextColor="gray"
                  className={inputForm}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    // Solo permitir números
                    const numericValue = text.replace(/[^0-9]/g, '');
                    onChange(numericValue);
                  }}
                  value={value}
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={10}
                />
              )}
            />
            {verificationErrors.verification_code && (
              <Text className="text-red-500">{verificationErrors.verification_code.message}</Text>
            )}
          </View>

          {/* Botón: Verificar */}
          <TouchableOpacity 
            className={`${botonGeneral} mt-6 ${isLoading ? 'opacity-50' : ''}`}
            onPress={handleVerificationSubmit(onVerificationSubmit)}
            disabled={isLoading}
          >
            <Text className={textoBotonGeneral}>
              {isLoading ? 'Verificando...' : 'Verificar'}
            </Text>
          </TouchableOpacity>

          {/* Botón: Reenviar código */}
          <TouchableOpacity 
            onPress={handleResendCode}
            className="mt-4"
            disabled={isLoading}
          >
            <Text className="text-blue-400">Reenviar código de verificación</Text>
          </TouchableOpacity>

          {/* Enlace: Volver al registro */}
          <TouchableOpacity 
            onPress={() => setIsVerificationMode(false)}
            className="mt-4"
          >
            <Text className="text-blue-400">Volver al registro</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View className={`${fondoTotal} flex-1 px-6`}>
      <ScrollView 
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }} 
        showsVerticalScrollIndicator={false} 
      >
        {/* Logo */}
        <Image 
          source={require('../assets/logo.png')} 
          className="w-40 h-40 mt-8 mb-8 rounded-3xl" 
        />

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
