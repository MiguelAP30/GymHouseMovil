import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { tituloForm, labelForm, parrafoForm, inputForm, botonGeneral, textoBotonGeneral, fondoTotal } from '../../components/tokens';
import { forgotPassword } from '../../lib/auth';
import { useNetInfo } from '@react-native-community/netinfo';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const netInfo = useNetInfo();
  const isConnected = netInfo.isConnected ?? false;

  const handleSubmit = async () => {
    if (!isConnected) {
      Alert.alert("Error", "No hay conexión a internet");
      return;
    }

    if (!email) {
      Alert.alert("Error", "Por favor, ingresa tu correo electrónico");
      return;
    }

    setIsLoading(true);
    try {
      const cleanEmail = email.toLowerCase().trim();
      await forgotPassword(cleanEmail);
      Alert.alert(
        "Éxito",
        "Se ha enviado un código de recuperación a tu correo electrónico",
        [
          {
            text: "OK",
            onPress: () => router.push('/auth/reset-password')
          }
        ]
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

  return (
    <View className={`${fondoTotal} flex-1 px-6`}>
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
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity 
          className={`${botonGeneral} mt-6 ${isLoading ? 'opacity-50' : ''}`}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text className={textoBotonGeneral}>
            {isLoading ? 'Enviando...' : 'Recuperar contraseña'}
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