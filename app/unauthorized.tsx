import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function UnauthorizedScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-900 p-4">
      <Text className="text-2xl font-bold text-white mb-4">Acceso No Autorizado</Text>
      <Text className="text-white text-center mb-6">
        No tienes permisos para acceder a esta sección.
      </Text>
      <Link href="/account/about" className="bg-blue-600 px-6 py-3 rounded-lg">
        <Text className="text-white font-bold">Volver al Inicio</Text>
      </Link>
    </View>
  );
} 