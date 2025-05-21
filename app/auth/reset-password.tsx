import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { tituloForm, labelForm, parrafoForm, inputForm, botonGeneral, textoBotonGeneral, fondoTotal } from '../../components/tokens';
import { resetPassword } from '../../lib/auth';
import { useNetInfo } from '@react-native-community/netinfo';

export default function ResetPassword() {
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const netInfo = useNetInfo();
  const isConnected = netInfo.isConnected ?? false;
  const { email } = useLocalSearchParams();

  const handleSubmit = async () => {
    if (!isConnected) {
      Alert.alert("Error", "No hay conexión a internet");
      return;
    }

    if (!resetCode || !newPassword) {
      Alert.alert("Error", "Por favor, completa todos los campos");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({
        email: email as string,
        new_password: newPassword,
        reset_code: resetCode
      });
      Alert.alert(
        "Éxito",
        "Tu contraseña ha sido restablecida correctamente",
        [
          {
            text: "OK",
            onPress: () => router.replace('/')
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Error al restablecer la contraseña"
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
          <TextInput
            placeholder="********"
            placeholderTextColor="gray"
            className={inputForm}
            onChangeText={setNewPassword}
            value={newPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          className={`${botonGeneral} mt-6 ${isLoading ? 'opacity-50' : ''}`}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text className={textoBotonGeneral}>
            {isLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => router.back()}
          className="mt-4"
        >
          <Text className="text-blue-400">Volver</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
} 