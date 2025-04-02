import { View } from 'react-native';
import React, { useContext } from 'react';
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../../context/AuthStore';
import { ROLES } from '../../../interfaces/interfaces';
import { Redirect } from 'expo-router';

const LayoutAbout = () => {
  const { isAuthenticated, role } = useContext(AuthContext);
  if (!isAuthenticated || (role ?? 0) < ROLES.premium) {
    return <Redirect href="/unauthorized" />;
  }

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
        name="about"
        options={{
          title: 'GymHouse',
          headerShown: true,
          drawerIcon: ({ size }) => <Ionicons name="speedometer" size={size} color={'#fff'} />,
        }}
        listeners={{
          drawerItemPress: (e) => e.preventDefault(),
        }}
      />
      <Drawer.Screen
        name="questions"
        options={{
          title: 'Preguntas Frecuentes',
          headerShown: true,
          drawerIcon: ({ size }) => <Ionicons name="speedometer" size={size} color={'#fff'} />,
        }}
        listeners={{
          drawerItemPress: (e) => e.preventDefault(),
        }}
      />
    </Drawer>
  );
}

export default LayoutAbout;
