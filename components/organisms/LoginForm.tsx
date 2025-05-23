import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView, Touchable } from 'react-native';
import { Link, router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { 
  tituloForm, 
  labelForm, 
  parrafoForm,
  inputForm, 
  botonGeneral, 
  textoBotonGeneral, 
  letraPequeñaForm, 
  fondoTotal 
} from '../tokens';
import { useAuth } from '../../context/AuthStore';
import { postLogin, forgotPassword, resetPassword, resendVerificationCode, verifyEmail } from '../../lib/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import ExercisesWithoutInternet from '../../app/exercisesWithoutInternet';
import ResetPassword from '../../app/auth/reset-password';
import ForgotPassword from '../../app/auth/forgot-password';
import VerifyEmail from '../../app/auth/verify-email';
import ResendVerification from '../../app/auth/resend-verification';

interface LoginFormProps {
  isConnected: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ isConnected }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetCode, setResetCode] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isVerificationMode, setIsVerificationMode] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [isResendVerificationMode, setIsResendVerificationMode] = useState(false);
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [resendEmail, setResendEmail] = useState<string>('');
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string>('');
  const { login, logout, isAuthenticated, user, token, checkAuth } = useAuth();
  const { control, handleSubmit, formState: { errors } } = useForm<{ email: string; password: string }>();
  const { control: resetControl, handleSubmit: handleResetSubmit, formState: { errors: resetErrors } } = useForm<{ password: string }>();

  const onSubmit = async (data: { email: string; password: string }) => {
    if (!isConnected) {
      Alert.alert("Error", "No hay conexión a internet");
      return;
    }

    setIsLoading(true);
    try {
      const formData = {
        ...data,
        email: data.email.toLowerCase().trim()
      };
      
      console.log('Intentando login con:', formData.email);
      const response = await postLogin(formData);
      
      console.log('Respuesta del servidor:', response);
      
      if (!response.access_token || !response.user) {
        throw new Error('Respuesta del servidor incompleta');
      }
      
      console.log('Estado de verificación:', response.user.is_verified);
      
      if (response.user.is_verified === false) {
        setEmail(formData.email);
        setVerificationCode('');
        setIsVerificationMode(true);
        Alert.alert(
          "Correo no verificado",
          "Tu correo electrónico no está verificado. Por favor, verifica tu correo para continuar."
        );
        return;
      }
      
      console.log('Login exitoso, guardando token y datos del usuario');
      await login(response.access_token, response.user);
      
      const isValid = await checkAuth();
      if (!isValid) {
        throw new Error('Error al verificar la autenticación');
      }
      // La redirección será manejada por el useEffect en index.tsx
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

  const handleForgotPassword = async () => {
    if (!isConnected) {
      Alert.alert("Error", "No hay conexión a internet");
      return;
    }

    setIsForgotPasswordMode(true);
  };

  const handleForgotPasswordSubmit = async () => {
    if (!isConnected) {
      Alert.alert("Error", "No hay conexión a internet");
      return;
    }

    if (!forgotPasswordEmail) {
      Alert.alert("Error", "Por favor, ingresa tu correo electrónico");
      return;
    }

    const cleanEmail = forgotPasswordEmail.toLowerCase().trim();

    setIsLoading(true);
    try {
      console.log('Email procesado:', cleanEmail);
      await forgotPassword(cleanEmail);
      setEmail(cleanEmail);
      setIsResettingPassword(true);
      setIsForgotPasswordMode(false);
      Alert.alert(
        "Éxito",
        "Se ha enviado un código de recuperación a tu correo electrónico"
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Error al solicitar recuperación de contraseña"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (data: { password: string }) => {
    if (!resetCode || !email) {
      Alert.alert("Error", "Por favor, ingresa el código de recuperación");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({
        email,
        new_password: data.password,
        reset_code: resetCode
      });
      Alert.alert(
        "Éxito",
        "Tu contraseña ha sido restablecida correctamente"
      );
      setIsResettingPassword(false);
      setResetCode('');
      setEmail('');
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Error al restablecer la contraseña"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!email) {
      Alert.alert("Error", "Por favor, ingresa tu correo electrónico");
      return;
    }

    if (!verificationCode) {
      Alert.alert("Error", "Por favor, ingresa el código de verificación");
      return;
    }

    if (verificationCode.length < 6) {
      Alert.alert("Error", "El código de verificación debe tener al menos 6 caracteres");
      return;
    }

    if (verificationCode.length > 10) {
      Alert.alert("Error", "El código de verificación no puede tener más de 10 caracteres");
      return;
    }

    setIsLoading(true);
    try {
      const cleanEmail = email.toLowerCase().trim();
      console.log('Intentando verificar email:', cleanEmail, 'con código:', verificationCode);
      
      const response = await verifyEmail({
        email: cleanEmail,
        verification_code: verificationCode
      });
      
      console.log('Respuesta de verificación:', response);
      
      if (response.status === 200) {
        Alert.alert(
          "Verificación exitosa",
          "Tu correo ha sido verificado. Ahora puedes iniciar sesión.",
          [
            {
              text: "OK",
              onPress: () => {
                setIsVerificationMode(false);
                setVerificationCode('');
                setEmail('');
              }
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

  const handleResendVerificationCode = async () => {
    if (!isConnected) {
      Alert.alert("Error", "No hay conexión a internet");
      return;
    }

    setIsResendVerificationMode(true);
  };

  const handleResendVerificationSubmit = async () => {
    if (!isConnected) {
      Alert.alert("Error", "No hay conexión a internet");
      return;
    }

    if (!resendEmail) {
      Alert.alert("Error", "Por favor, ingresa tu correo electrónico");
      return;
    }

    const cleanEmail = resendEmail.toLowerCase().trim();

    setIsLoading(true);
    try {
      await resendVerificationCode({ email: cleanEmail });
      setEmail(cleanEmail);
      setIsVerificationMode(true);
      setIsResendVerificationMode(false);
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

/*   if(!isConnected){
    return (
      <ExercisesWithoutInternet />
    )
  } */

  if (isVerificationMode) {
    return (
     <VerifyEmail />
    );
  }

  if (isResettingPassword) {
    return (
      <ResetPassword />
    );
  }

  if (isResendVerificationMode) {
    return (
      <ResendVerification />
    );
  }

  if (isForgotPasswordMode) {
    return (
      <ForgotPassword />
    );
  }

  return (
    <View className={`${fondoTotal} flex-1 justify-center px-6`}>
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 20 }}

        showsVerticalScrollIndicator={false} 
      >
      {isConnected === false && (
        <View style={{ alignItems: 'center' }}>
          <Text className="text-red-500 mb-4">No tienes conexión a Internet</Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#007bff',
              padding: 10,
              borderRadius: 8,
              alignItems: 'center',
            }}
            onPress={() => router.push('/exercisesWithoutInternet')}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>Ver ejercicios</Text>
          </TouchableOpacity>
        </View>
      )}
        
          
        <Image 
          source={require('../../assets/logo.png')} 
          className="w-48 h-48 mb-8 rounded-3xl" 
        />

        <Text className={tituloForm}>Bienvenido a GymHouse</Text>
        <Text className={`${parrafoForm} mb-8`}>
          Inicia sesión para continuar con tu entrenamiento personalizado
        </Text>

        <View className="w-full">
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

        <TouchableOpacity 
          className={`${botonGeneral} ${isLoading ? 'opacity-50' : ''}`} 
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          <Text className={textoBotonGeneral}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => router.push('/auth/forgot-password')}
          className="mt-2"
        >
          <Text className="text-blue-400">¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => router.push('/auth/verify-email')}
          className="mt-2"
        >
          <Text className="text-blue-400">Verificar código</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => router.push('/auth/verify-email')}
          className="mt-2"
        >
          <Text className="text-blue-400">¿Necesitas reenviar el código de verificación?</Text>
        </TouchableOpacity>

        <Text className={letraPequeñaForm}>
          ¿No tienes una cuenta? 
          <Link href="/register" className="text-blue-400"> Regístrate</Link>
        </Text>
      </ScrollView>
    </View>
  );
}; 