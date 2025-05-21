import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { tituloForm, labelForm, parrafoForm, inputForm, botonGeneral, textoBotonGeneral, fondoTotal } from '../../components/tokens';
import { verifyEmail, resendVerificationCode } from '../../lib/auth';
import { useNetInfo } from '@react-native-community/netinfo';

export default function VerifyEmail() {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const netInfo = useNetInfo();
  const isConnected = netInfo.isConnected ?? false;
  const { email } = useLocalSearchParams();

  const handleVerify = async () => {
    if (!isConnected) {
      Alert.alert("Error", "No hay conexión a internet");
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
      const response = await verifyEmail({
        email: email as string,
        verification_code: verificationCode
      });
      
      if (response.status === 200) {
        Alert.alert(
          "Verificación exitosa",
          "Tu correo ha sido verificado. Ahora puedes iniciar sesión.",
          [
            {
              text: "OK",
              onPress: () => router.replace('/')
            }
          ]
        );
      } else {
        throw new Error('Error en la verificación');
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Error al verificar el código"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!isConnected) {
      Alert.alert("Error", "No hay conexión a internet");
      return;
    }

    setIsLoading(true);
    try {
      await resendVerificationCode({ email: email as string });
      Alert.alert(
        "Código reenviado",
        "Se ha enviado un nuevo código de verificación a tu correo electrónico."
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Error al reenviar el código de verificación"
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
        <Text className={tituloForm}>Verifica tu correo electrónico</Text>
        <Text className={parrafoForm}>
          Ingresa el código de verificación enviado a {email}
        </Text>

        <View className="w-full mt-6">
          <Text className={labelForm}>Código de verificación</Text>
          <TextInput
            placeholder="Ingresa el código (hasta 10 dígitos)"
            placeholderTextColor="gray"
            className={inputForm}
            onChangeText={(text) => {
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
          onPress={handleVerify}
          disabled={isLoading}
        >
          <Text className={textoBotonGeneral}>
            {isLoading ? 'Verificando...' : 'Verificar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleResendCode}
          className="mt-4"
          disabled={isLoading}
        >
          <Text className="text-blue-400">Reenviar código de verificación</Text>
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