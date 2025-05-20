import { Stack } from 'expo-router';
import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthStore';
import { Redirect } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

export default function PerfilLayout() {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#1F2937' }} edges={['top']}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1F2937',
            },
            headerTintColor: '#37A4DF',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            contentStyle: {
              backgroundColor: '#1F2937',
            },
          }}
        >
          <Stack.Screen
            name="profile"
            options={{
              title: 'Mi Perfil',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="processPersonal"
            options={{
              title: 'Progreso personal',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="stats"
            options={{
              title: 'Estadisticas',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              title: 'Configuracion',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="about"
            options={{
              title: 'Sobre nosotros',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="questions"
            options={{
              title: 'Preguntas',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="(progressExercise)/exercises"
            options={{
              title: 'Ejercicios',
              headerShown: true,
            }}
          />
          <Stack.Screen
          name="(progressExercise)/[id]"
          options={{
            title: 'Progreso del ejercicio',
            headerShown: true,
          }}
        />

          
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
} 