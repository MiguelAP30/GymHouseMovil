import { View, Text } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import Drawer from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';

const dashboardAdminLayout = () => {
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
        name="dashboard"
        options={{
          title: 'Dashboard',
          headerShown: true,
          drawerIcon: ({ color, size }) => <Ionicons name="speedometer" size={size} color={'#fff'} />,
        }}
        listeners={{
          drawerItemPress: (e) => e.preventDefault(), // Evita la navegación
        }}
      />
      <Drawer.Screen
        name="crearEtiquetaRutinas"
        options={{
          title: 'Etiquetas Rutinas',
          headerShown: true,
          drawerIcon: ({ color, size }) => <Ionicons name="pricetag" size={size} color={'#fff'} />,
        }}
      />
      <Drawer.Screen
        name="daysWeek"
        options={{
          title: 'Días de la Semana',
          headerShown: true,
          drawerIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={'#fff'} />,
        }}
      />
      <Drawer.Screen
        name="difficultyExercise"
        options={{
          title: 'Dificultad de los ejercicios',
          headerShown: true,
          drawerIcon: ({ color, size }) => <Ionicons name="barbell" size={size} color={'#fff'} />,
        }}
      />
      <Drawer.Screen
        name="exercises"
        options={{
          title: 'Ejercicios',
          headerShown: true,
          drawerIcon: ({ color, size }) => <Ionicons name="fitness" size={size} color={'#fff'} />,
        }}
      />
      <Drawer.Screen
        name="gyms"
        options={{
          title: 'Gimnasios',
          headerShown: true,
          drawerIcon: ({ color, size }) => <Ionicons name="home" size={size} color={'#fff'} />,
        }}
      />
      <Drawer.Screen
        name="machines"
        options={{
          title: 'Máquinas',
          headerShown: true,
          drawerIcon: ({ color, size }) => <Ionicons name="cog" size={size} color={'#fff'} />,
        }}
      />
      <Drawer.Screen
        name="specificMuscle"
        options={{
          title: 'Músculo Específico',
          headerShown: true,
          drawerIcon: ({ color, size }) => <Ionicons name="body" size={size} color={'#fff'} />,
        }}
      />
      <Drawer.Screen
        name="rateExercises"
        options={{
          title: 'Calificación de Ejercicio',
          headerShown: true,
          drawerIcon: ({ color, size }) => <Ionicons name="star" size={size} color={'#fff'} />,
        }}
      />
      <Drawer.Screen
        name="roles"
        options={{
          title: 'Roles',
          headerShown: true,
          drawerIcon: ({ color, size }) => <Ionicons name="people" size={size} color={'#fff'} />,
        }}
      />
    </Drawer>
  );
}

export default dashboardAdminLayout;
