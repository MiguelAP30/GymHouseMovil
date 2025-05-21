import { Stack } from 'expo-router';
import { SafeAreaProvider,SafeAreaView } from 'react-native-safe-area-context';

export default function AuthLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#1F2937' }}>
      <Stack>
        <Stack.Screen 
          name="forgot-password" 
          options={{ 
            title: 'Recuperar Contraseña',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="reset-password" 
          options={{ 
            title: 'Restablecer Contraseña',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="verify-email" 
          options={{ 
            title: 'Verificar Email',
            headerShown: false 
          }} 
        />
      </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
} 