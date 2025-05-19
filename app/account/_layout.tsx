import { Tabs, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthStore';
import { ROLES } from '../../interfaces/user';
import { router } from 'expo-router';

export default function AccountLayout() {
  const { isAuthenticated, role, checkAuth } = useContext(AuthContext);
  const isAdmin = role === ROLES.admin;

  useEffect(() => {
    const validateAuth = async () => {
      const isValid = await checkAuth();
      if (!isValid) {
        router.replace('/');
      }
    };
    validateAuth();
  }, []);

  if (!isAuthenticated || role === null) {
    return <Redirect href="/" />;
  }

  const canAccessGym = role === ROLES.gym || role === ROLES.admin;
  const canAccessRutines = role === ROLES.premium || role === ROLES.gym || role === ROLES.admin;

  return (
    <Tabs
      initialRouteName={isAdmin ? "dashboardAdmin" : "perfil"}
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
        name="exercises"
        options={{
          title: 'Ejercicios',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="information-circle" size={size} color={color} />,
        }}
      />

      {/* Rutas para usuarios con roles específicos */}
      <Tabs.Screen
        name="rutines"
        options={{
          title: 'Rutinas',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="barbell" size={size} color={color} />,
          href: canAccessRutines ? "/account/rutines" : null,
        }}
      />

      {/* Ruta exclusiva para admin */}
      <Tabs.Screen
        name="dashboardAdmin"
        options={{
          title: 'Admin',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="speedometer" size={size} color={color} />,
          href: isAdmin ? "/account/dashboardAdmin" : null,
        }}
      />
      <Tabs.Screen
        name="dashboardGym"
        options={{
          title: 'Gym',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          href: canAccessGym ? "/account/dashboardGym" : null,
        }}
      />
      
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
