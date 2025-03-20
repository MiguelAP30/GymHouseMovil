import { Tabs, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useContext } from 'react';
import ProtectedRoute from '../../context/ProtectedRoute';

export default function AccountLayout() {
  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          tabBarShowLabel: true,
          tabBarStyle: { 
            backgroundColor: '#000000',
            height: 60, 
            borderTopColor: '#000000',
            borderTopWidth: 1,
          },
          tabBarActiveTintColor: '#6200ea',
          headerStyle: { backgroundColor: '#1F2937' },
          headerTintColor: '#37A4DF',
          tabBarInactiveTintColor: '#37A4DF',
          tabBarLabelStyle: { fontSize: 10, fontWeight: 'bold' },
        }}
      >
        {/* Rutas accesibles para todos los usuarios autenticados */}
        <Tabs.Screen
          name="(about)/about"
          options={{
            title: 'Nosotros',
            tabBarIcon: ({ color, size }) => <Ionicons name="information-circle" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="(questions)/questions"
          options={{
            title: 'Preguntas',
            tabBarIcon: ({ color, size }) => <Ionicons name="help-circle" size={size} color={color} />,
          }}
        />

        {/* Rutas solo para usuarios con rol 1 (gym) */}
        <ProtectedRoute allowedRoles={[4, 1]}>
          <Tabs.Screen
            name="(rutines)/crearRutines"
            options={{
              title: 'Crear Rutina',
              tabBarIcon: ({ color, size }) => <Ionicons name="barbell" size={size} color={color} />,
            }}
          />
        </ProtectedRoute>

        {/* Rutas solo para admin (rol 4) */}
        <ProtectedRoute allowedRoles={[4]}>
          <Tabs.Screen
            name="dashboardAdmin"
            options={{
              headerShown: false,
              tabBarIcon: ({ color, size }) => <Ionicons name="speedometer" size={size} color={color} />,
            }}
          />
        </ProtectedRoute>
      </Tabs>
    </ProtectedRoute>
  );
}
