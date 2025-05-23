import { View } from 'react-native';
import React, { useContext } from 'react';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../../context/AuthStore';
import { ROLES } from '../../../interfaces/interfaces';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';


const DashboardGymLayout = () => {
  const { isAuthenticated, role } = useContext(AuthContext);

  if (!isAuthenticated || role === null || role < ROLES.gym) {
    return <Redirect href="/unauthorized" />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1F2937' }}>

    
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#1F2937' },
        headerTintColor: '#37A4DF',
        headerTitleStyle: { color: '#ffffff' },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="createGym"
        options={{
          title: 'Crear Gimnasio',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="addUser"
        options={{
          title: 'Agregar Usuario',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Detalles del Usuario',
          headerShown: false,
        }}
      />
    </Stack>
    </SafeAreaView>
  );
};

export default DashboardGymLayout;
