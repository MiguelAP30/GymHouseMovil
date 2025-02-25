import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AccountLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: '#fff', height: 60 },
        tabBarActiveTintColor: '#6200ea',
        tabBarInactiveTintColor: '#333',
        
      }}
    >
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
      <Tabs.Screen
        name="(rutines)/crearRutines"
        options={{
          title: 'Crear Rutina',
          tabBarIcon: ({ color, size }) => <Ionicons name="barbell" size={size} color={color} />,
        }}
      />
    <Tabs.Screen
        name="dashboardAdmin"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="speedometer" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
