import { View } from 'react-native';
import React, { useContext } from 'react';
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../../context/AuthStore';
import { ROLES } from '../../../interfaces/interfaces';
import { Redirect } from 'expo-router';

const DashboardGymLayout = () => {
  const { isAuthenticated, role } = useContext(AuthContext);

  if (!isAuthenticated || role !== ROLES.gym) {
    return <Redirect href="/unauthorized" />;
  }

  return (
    <Drawer
      screenOptions={{
        drawerStyle: { backgroundColor: '#1F2937', width: 250 },
        drawerLabelStyle: { color: '#ffffff', fontSize: 16 },
        headerStyle: { backgroundColor: '#1F2937' },
        headerTintColor: '#37A4DF',
        drawerActiveBackgroundColor: '#6200ea',
        drawerActiveTintColor: '#ffffff',
        drawerInactiveBackgroundColor: '#1F2937',
      }}
    >
      <Drawer.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          headerShown: true,
          drawerIcon: ({ size }) => <Ionicons name="speedometer" size={size} color={'#fff'} />,
        }}
        listeners={{
          drawerItemPress: (e) => e.preventDefault(),
        }}
      />
      <Drawer.Screen
        name="gimnasio"
        options={{
          title: 'Gimnasio',
          headerShown: true,
          drawerIcon: ({ size }) => <Ionicons name="home" size={size} color={'#fff'} />,
        }}
      />
    </Drawer>
  );
};

export default DashboardGymLayout;
