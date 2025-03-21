import { View } from 'react-native';
import React, { useContext } from 'react';
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../../context/AuthStore';
import { ROLES } from '../../../interfaces/interfaces';
import { Redirect } from 'expo-router';

const DashboardAdminLayout = () => {
  const { isAuthenticated, role } = useContext(AuthContext);

  if (!isAuthenticated || role !== ROLES.admin) {
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
        name="crearEtiquetaRutinas"
        options={{
          title: 'Etiquetas Rutinas',
          headerShown: true,
          drawerIcon: ({ size }) => <Ionicons name="pricetag" size={size} color={'#fff'} />,
        }}
      />
      <Drawer.Screen
        name="daysWeek"
        options={{
          title: 'Días de la Semana',
          headerShown: true,
          drawerIcon: ({ size }) => <Ionicons name="calendar" size={size} color={'#fff'} />,
        }}
      />
      <Drawer.Screen
        name="difficultyExercise"
        options={{
          title: 'Dificultad de los ejercicios',
          headerShown: true,
          drawerIcon: ({ size }) => <Ionicons name="barbell" size={size} color={'#fff'} />,
        }}
      />
      <Drawer.Screen
        name="exercises"
        options={{
          title: 'Ejercicios',
          headerShown: true,
          drawerIcon: ({ size }) => <Ionicons name="fitness" size={size} color={'#fff'} />,
        }}
      />
      <Drawer.Screen
        name="gyms"
        options={{
          title: 'Gimnasios',
          headerShown: true,
          drawerIcon: ({ size }) => <Ionicons name="home" size={size} color={'#fff'} />,
        }}
      />
      <Drawer.Screen
        name="machines"
        options={{
          title: 'Máquinas',
          headerShown: true,
          drawerIcon: ({ size }) => <Ionicons name="cog" size={size} color={'#fff'} />,
        }}
      />
      <Drawer.Screen
        name="specificMuscle"
        options={{
          title: 'Músculo Específico',
          headerShown: true,
          drawerIcon: ({ size }) => <Ionicons name="body" size={size} color={'#fff'} />,
        }}
      />
      <Drawer.Screen
        name="rateExercises"
        options={{
          title: 'Calificación de Ejercicio',
          headerShown: true,
          drawerIcon: ({ size }) => <Ionicons name="star" size={size} color={'#fff'} />,
        }}
      />
      <Drawer.Screen
        name="roles"
        options={{
          title: 'Roles',
          headerShown: true,
          drawerIcon: ({ size }) => <Ionicons name="people" size={size} color={'#fff'} />,
        }}
      />
    </Drawer>
  );
}

export default DashboardAdminLayout;
