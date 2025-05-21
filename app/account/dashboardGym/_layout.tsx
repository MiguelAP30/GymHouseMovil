import { View } from 'react-native';
import React, { useContext } from 'react';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../../context/AuthStore';
import { ROLES } from '../../../interfaces/interfaces';
import { Redirect } from 'expo-router';

const DashboardGymLayout = () => {
  const { isAuthenticated, role } = useContext(AuthContext);

  if (!isAuthenticated || role === null || role < ROLES.gym) {
    return <Redirect href="/unauthorized" />;
  }

  return (
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
          title: 'Mi Gimnasio',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="createGym"
        options={{
          title: 'Crear Gimnasio',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="users"
        options={{
          title: 'Usuarios del Gimnasio',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="addUser"
        options={{
          title: 'Agregar Usuario',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="userDetails"
        options={{
          title: 'Detalles del Usuario',
          headerShown: true,
        }}
      />
    </Stack>
  );
};

export default DashboardGymLayout;
