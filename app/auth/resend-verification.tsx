import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { 
  tituloForm, 
  labelForm, 
  parrafoForm,
  inputForm, 
  botonGeneral, 
  textoBotonGeneral, 
  fondoTotal 
} from '../../components/tokens';
import { resendVerificationCode } from '../../lib/auth';

export default function ResendVerification() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleResendVerificationSubmit = async () => {
    if (!email) {
      Alert.alert("Error", "Por favor, ingresa tu correo electrónico");
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    setIsLoading(true);
    try {
      console.log('Enviando solicitud de reenvío para:', cleanEmail);
      await resendVerificationCode({ email: cleanEmail });
      Alert.alert(
        "Código reenviado",
        "Se ha enviado un nuevo código de verificación a tu correo electrónico.",
        [
          {
            text: "OK",
            onPress: () => router.push({
              pathname: '/auth/verify-email',
              params: { email: cleanEmail }
            })
          }
        ]
      );
    } catch (error) {
      console.error('Error al reenviar código:', error);
      console.log('Tipo de error:', typeof error);
      console.log('Error completo:', JSON.stringify(error, null, 2));
      
      let errorMessage = 'Error al reenviar el código de verificación';
      
      if (typeof error === 'object' && error !== null) {
        const errorObj = error as any;
      console.log("-------------------------------- \n")
        console.log('Error object:', errorObj);
        console.log('Error data:', errorObj.errorData);
      console.log("-------------------------------- \n")
        
        if (errorObj.errorData?.detail) {
          errorMessage = errorObj.errorData.detail;
          console.log('Mensaje de error encontrado:', errorMessage);
        }
      }

      Alert.alert(
        "Error",
        errorMessage
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className={`${fondoTotal} flex-1 px-6`}>
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 20 }}
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
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity 
          className={`${botonGeneral} mt-6 ${isLoading ? 'opacity-50' : ''}`} 
          onPress={handleResendVerificationSubmit}
          disabled={isLoading}
        >
          <Text className={textoBotonGeneral}>
            {isLoading ? 'Enviando...' : 'Reenviar código'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => router.back()}
          className="mt-4"
        >
          <Text className="text-blue-400">Volver al inicio de sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
} 