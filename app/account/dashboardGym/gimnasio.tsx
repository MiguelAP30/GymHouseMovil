import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { getGym } from '../../../lib/api_gymhouse';
import { parrafoForm, tituloForm, botonGuardar } from '../../../components/tokens';
import { AuthContext } from '../../../context/AuthStore';

interface Gym {
  name: string;
  address: string;
  phone: string;
  email: string;
  schedule?: string;
  open_time?: string;
  close_time?: string;
  price?: number;
  is_active?: boolean;
  description?: string;
}

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
}

const Gimnasio = () => {
  const [gym, setGym] = useState<Gym | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext) as AuthContextType;

  const fetchGym = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getGym();
      if (response.status === 200) {
        // Encontrar el gimnasio que corresponde al email del usuario actual
        const userGym = response.data.find((g: Gym) => g.email === user?.email);
        if (userGym) {
          setGym(userGym);
        } else {
          setError('No se encontró información del gimnasio');
        }
      } else {
        setError('Error al cargar los datos del gimnasio');
      }
    } catch (err) {
      setError('Error de conexión al servidor ' +err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGym();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className={parrafoForm}>Cargando información del gimnasio...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-black">
        <Text className={parrafoForm}>{error}</Text>
        <TouchableOpacity 
          className={botonGuardar}
          onPress={fetchGym}
        >
          <Text className="text-white text-center">Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-4 bg-black">
      <Text className={tituloForm}>Información del Gimnasio</Text>
      
      {!gym ? (
        <Text className={parrafoForm}>No hay información disponible</Text>
      ) : (
        <View className="bg-gray-800 rounded-lg p-4 mt-4">
          <View className="mb-4">
            <Text className="text-gray-400 text-sm">Nombre del Gimnasio</Text>
            <Text className="text-white text-lg">{gym.name}</Text>
          </View>

          <View className="mb-4">
            <Text className="text-gray-400 text-sm">Dirección</Text>
            <Text className="text-white text-lg">{gym.address}</Text>
          </View>

          <View className="mb-4">
            <Text className="text-gray-400 text-sm">Teléfono</Text>
            <Text className="text-white text-lg">{gym.phone}</Text>
          </View>

          <View className="mb-4">
            <Text className="text-gray-400 text-sm">Email</Text>
            <Text className="text-white text-lg">{gym.email}</Text>
          </View>

          <View className="mb-4">
            <Text className="text-gray-400 text-sm">Horario</Text>
            <Text className="text-white text-lg">{gym.schedule || 'No especificado'}</Text>
          </View>

          <View>
            <Text className="text-gray-400 text-sm">Descripción</Text>
            <Text className="text-white text-lg">{gym.description || 'Sin descripción'}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default Gimnasio;
