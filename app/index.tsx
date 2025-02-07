import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import React from 'react';

const Index = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white space-y-5">
      <Text className="text-4xl text-red-600">🏠 Index</Text>

      <Link href="/login">
        <Text className="bg-slate-200 text-3xl p-5 rounded-lg">
          🔑 Autenticación
        </Text>
      </Link>

      <Link href="/about">
        <Text className="bg-slate-200 text-3xl p-5 rounded-lg">
          👨🏻‍💻 Sobre nosotros
        </Text>
      </Link>

      <Link href="/register">
        <Text className="rounded-lg p-4 bg-slate-200 text-3xl">
          👤 Registro
        </Text>
      </Link>

      <Link href="/questions">
        <Text className="rounded-lg p-4 bg-slate-200 text-3xl">
          ❓ Preguntas frecuentes
        </Text>
      </Link>

      <Link href="/rutines">
        <Text className="rounded-lg p-4 bg-slate-200 text-3xl">
          🏋🏻‍♂️ Crear rutina
        </Text>
      </Link>
    </View>
  );
};

export default Index;
