import React, { useContext } from 'react';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../../context/AuthStore';

const LayoutExercises = () => {
  const { isAuthenticated, role } = useContext(AuthContext);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#1F2937' },
        headerTintColor: '#37A4DF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: '#1F2937',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Ejercicios',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="muscles"
        options={{
          title: 'Músculos',
          headerShown: true,
        }}
      />
    </Stack>
  );
}

export default LayoutExercises;
