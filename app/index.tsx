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
import { postLogin, forgotPassword, resetPassword, resendVerificationCode, verifyEmail } from '../lib/api_gymhouse';
import { ConnectivityContext } from './_layout';

export default function Index() {
  const { isConnected } = useContext(ConnectivityContext);
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
        email: data.email.toLowerCase().trim()
      };
      
      console.log('Intentando login con:', formData.email);
      const response = await postLogin(formData);
      
      console.log('Respuesta del servidor:', response);
      
      if (!response.access_token || !response.user) {
        throw new Error('Respuesta del servidor incompleta');
      }
      
      // Verificar si el correo está verificado
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

    // Asegurar que el email esté en minúsculas y sin espacios
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
      // Asegurar que el email esté en minúsculas y sin espacios
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

    // Asegurar que el email esté en minúsculas y sin espacios
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

  if (isVerificationMode) {
    return (
      <View className={`${fondoTotal} flex-1 px-6 justify-center`}>
        <ScrollView 
          contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }} 
          showsVerticalScrollIndicator={false} 
        >
          <Text className={tituloForm}>Verifica tu correo electrónico</Text>
          <Text className={parrafoForm}>
            Ingresa tu correo electrónico y el código de verificación
          </Text>

          {/* Input: Correo electrónico */}
          <View className="w-full mt-6">
            <Text className={labelForm}>Correo electrónico</Text>
            <TextInput
              placeholder="tucorreo@ejemplo.com"
              placeholderTextColor="gray"
              className={inputForm}
              onChangeText={(text) => setEmail(text)}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Input: Código de verificación */}
          <View className="w-full mt-4">
            <Text className={labelForm}>Código de verificación</Text>
            <TextInput
              placeholder="Ingresa el código (hasta 10 dígitos)"
              placeholderTextColor="gray"
              className={inputForm}
              onChangeText={(text) => {
                // Solo permitir números
                const numericValue = text.replace(/[^0-9]/g, '');
                setVerificationCode(numericValue);
              }}
              value={verificationCode}
              keyboardType="number-pad"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={10}
            />
          </View>

          <TouchableOpacity 
            className={`${botonGeneral} mt-6 ${isLoading ? 'opacity-50' : ''}`} 
            onPress={handleVerifyEmail}
            disabled={isLoading}
          >
            <Text className={textoBotonGeneral}>
              {isLoading ? 'Verificando...' : 'Verificar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleResendVerificationCode}
            className="mt-4"
            disabled={isLoading}
          >
            <Text className="text-blue-400">Reenviar código de verificación</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => {
              setIsVerificationMode(false);
              setVerificationCode('');
              setEmail('');
            }}
            className="mt-4"
          >
            <Text className="text-blue-400">Volver al inicio de sesión</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  if (isResettingPassword) {
    return (
      <View className={`${fondoTotal} flex-1 px-6 justify-center`}>
        <ScrollView 
          contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }} 
          showsVerticalScrollIndicator={false} 
        >
          <Text className={tituloForm}>Restablecer Contraseña</Text>
          <Text className={parrafoForm}>
            Ingresa el código de recuperación y tu nueva contraseña
          </Text>

          <View className="w-full mt-6">
            <Text className={labelForm}>Código de recuperación</Text>
            <TextInput
              placeholder="Ingresa el código enviado a tu correo"
              placeholderTextColor="gray"
              className={inputForm}
              onChangeText={setResetCode}
              value={resetCode}
              keyboardType="number-pad"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View className="w-full mt-4">
            <Text className={labelForm}>Nueva Contraseña</Text>
            <Controller
              control={resetControl}
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
            {resetErrors.password && <Text className="text-red-500">{resetErrors.password.message?.toString()}</Text>}
          </View>

          <TouchableOpacity 
            className={`${botonGeneral} ${isLoading ? 'opacity-50' : ''}`} 
            onPress={handleResetSubmit(handleResetPassword)}
            disabled={isLoading}
          >
            <Text className={textoBotonGeneral}>
              {isLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => {
              setIsResettingPassword(false);
              setResetCode('');
              setEmail('');
            }}
            className="mt-4"
          >
            <Text className="text-blue-400">Volver al inicio de sesión</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  if (isResendVerificationMode) {
    return (
      <View className={`${fondoTotal} flex-1 px-6 justify-center`}>
        <ScrollView 
          contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }} 
          showsVerticalScrollIndicator={false} 
        >
          <Text className={tituloForm}>Reenviar código de verificación</Text>
          <Text className={parrafoForm}>
            Ingresa tu correo electrónico para reenviar el código de verificación
          </Text>

          <View className="w-full mt-6">
            <Text className={labelForm}>Correo electrónico</Text>
            <TextInput
              placeholder="tucorreo@ejemplo.com"
              placeholderTextColor="gray"
              className={inputForm}
              onChangeText={setResendEmail}
              value={resendEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity 
            className={`${botonGeneral} ${isLoading ? 'opacity-50' : ''}`} 
            onPress={handleResendVerificationSubmit}
            disabled={isLoading}
          >
            <Text className={textoBotonGeneral}>
              {isLoading ? 'Enviando...' : 'Reenviar código'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => {
              setIsResendVerificationMode(false);
              setResendEmail('');
            }}
            className="mt-4"
          >
            <Text className="text-blue-400">Volver al inicio de sesión</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  if (isForgotPasswordMode) {
    return (
      <View className={`${fondoTotal} flex-1 px-6 justify-center`}>
        <ScrollView 
          contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }} 
          showsVerticalScrollIndicator={false} 
        >
          <Text className={tituloForm}>Recuperar contraseña</Text>
          <Text className={parrafoForm}>
            Ingresa tu correo electrónico para recuperar tu contraseña
          </Text>

          <View className="w-full mt-6">
            <Text className={labelForm}>Correo electrónico</Text>
            <TextInput
              placeholder="tucorreo@ejemplo.com"
              placeholderTextColor="gray"
              className={inputForm}
              onChangeText={setForgotPasswordEmail}
              value={forgotPasswordEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity 
            className={`${botonGeneral} ${isLoading ? 'opacity-50' : ''}`} 
            onPress={handleForgotPasswordSubmit}
            disabled={isLoading}
          >
            <Text className={textoBotonGeneral}>
              {isLoading ? 'Enviando...' : 'Recuperar contraseña'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => {
              setIsForgotPasswordMode(false);
              setForgotPasswordEmail('');
            }}
            className="mt-4"
          >
            <Text className="text-blue-400">Volver al inicio de sesión</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View className={`${fondoTotal} flex-1 justify-center px-6`}>
      <ScrollView 
        contentContainerStyle={{ alignItems: 'center', paddingVertical: 40 }} 
        showsVerticalScrollIndicator={false} 
      >
        {isConnected === false && (
          <Text className="text-red-500 mb-4">No tienes conexión a Internet</Text>
        )}
          
        {/* Logo */}
        <Image 
          source={require('../assets/logo.png')} 
          className="w-48 h-48 mb-8 rounded-3xl" 
        />

        {/* Título */}
        <Text className={tituloForm}>Bienvenido a GymHouse</Text>
        <Text className={`${parrafoForm} mb-8`}>
          Inicia sesión para continuar con tu entrenamiento personalizado
        </Text>

        {/* Input: Correo */}
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

        {/* Enlace: Recuperar contraseña */}
        <TouchableOpacity 
          onPress={handleForgotPassword}
          className="mt-2"
        >
          <Text className="text-blue-400">¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        {/* Enlace: Verificar código directamente */}
        <TouchableOpacity 
          onPress={() => {
            setEmail('');
            setVerificationCode('');
            setIsVerificationMode(true);
          }}
          className="mt-2"
        >
          <Text className="text-blue-400">Verificar código</Text>
        </TouchableOpacity>

        {/* Enlace: Reenviar código de verificación */}
        <TouchableOpacity 
          onPress={handleResendVerificationCode}
          className="mt-2"
        >
          <Text className="text-blue-400">¿Necesitas reenviar el código de verificación?</Text>
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