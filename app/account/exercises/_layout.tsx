
import React, { useContext } from 'react';
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../../context/AuthStore';

const LayoutExercises = () => {
  const { isAuthenticated, role } = useContext(AuthContext);


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
        name="muscles"
        options={{
          title: 'Musculos',
          headerShown: true,
          drawerIcon: ({ size }) => <Ionicons name="speedometer" size={size} color={'#fff'} />,
        }}
      />
    </Drawer>
  );
}

export default LayoutExercises;
