import React from 'react'
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';

const AuthLayout = () => {
  return (
    <Drawer
      screenOptions={{
        drawerStyle: { backgroundColor: '#1F2937' , width: 250 },
        drawerLabelStyle: { color: '#ffffff', fontSize: 16 },
        headerStyle: { backgroundColor: '#1F2937' },
        headerTintColor: '#37A4DF',
        drawerActiveBackgroundColor: '#6200ea',
        drawerActiveTintColor: '#ffffff',
        drawerInactiveBackgroundColor: '#1F2937',
      }}
    >
      <Drawer.Screen
        name="login"
        options={{
          title: 'Iniciar Sesión',
          drawerIcon: ({ color, size }) => <Ionicons name="log-in" size={size} color={'#fff'} />,
        }}
      />

      <Drawer.Screen
        name="register"
        options={{
          title: 'Registrarse',
          drawerIcon: ({ color, size }) => <Ionicons name="person-add" size={size} color={'#fff'} />,
        }}
      />
    </Drawer>
  );
}

export default AuthLayout