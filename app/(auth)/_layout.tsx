import React from 'react'
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';

const AuthLayout = () => {
  return (
    <Drawer
      screenOptions={{
        drawerStyle: { backgroundColor: '#fff', width: 250 },
        drawerLabelStyle: { fontSize: 16 },
        headerStyle: { backgroundColor: '#6200ea' },
        headerTintColor: '#fff',
      }}
    >
      <Drawer.Screen
        name="login"
        options={{
          title: 'Iniciar Sesión',
          drawerIcon: ({ color, size }) => <Ionicons name="log-in" size={size} color={color} />,
        }}
      />

      <Drawer.Screen
        name="register"
        options={{
          title: 'Registrarse',
          drawerIcon: ({ color, size }) => <Ionicons name="person-add" size={size} color={color} />,
        }}
      />
    </Drawer>
  );
}

export default AuthLayout