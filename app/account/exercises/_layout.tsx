import React, { useContext } from 'react';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../../context/AuthStore';
import { SafeAreaView } from 'react-native-safe-area-context';

const LayoutExercises = () => {
  const { isAuthenticated, role } = useContext(AuthContext);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1F2937' }}>

    
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
          headerShown: false,
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
    </SafeAreaView>
  );
}

export default LayoutExercises;
