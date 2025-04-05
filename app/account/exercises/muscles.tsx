import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { SvgProps } from 'react-native-svg';

// Importar los SVGs
import FrenteNormal from '../../../assets/Frente Normal path nombrados.svg';
import EspaldaNormal from '../../../assets/Espalda Normal path nombrados.svg';
import FrenteAvanzado from '../../../assets/Frente Avanzado path nombrados.svg';
import EspaldaAvanzado from '../../../assets/Espalda Avanzado path nombrados.svg';

// Tipos para los filtros
type NivelType = 'normal' | 'avanzado';
type VistaType = 'frente' | 'espalda';

const MusclesScreen = () => {
  // Estados para los filtros
  const [nivel, setNivel] = useState<NivelType>('normal');
  const [vista, setVista] = useState<VistaType>('frente');
  const [loading, setLoading] = useState(false);

  // Función para obtener el SVG actual basado en los filtros
  const getCurrentSvg = () => {
    if (nivel === 'normal') {
      return vista === 'frente' ? FrenteNormal : EspaldaNormal;
    } else {
      return vista === 'frente' ? FrenteAvanzado : EspaldaAvanzado;
    }
  };

  // Componente para los botones de filtro
  const FilterButton = ({ 
    title, 
    isActive, 
    onPress 
  }: { 
    title: string; 
    isActive: boolean; 
    onPress: () => void 
  }) => (
    <TouchableOpacity
      className={`px-4 py-2 rounded-full mr-2 ${isActive ? 'bg-blue-500' : 'bg-gray-200'}`}
      onPress={onPress}
    >
      <Text className={`font-medium ${isActive ? 'text-white' : 'text-gray-700'}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  // Obtener el SVG actual
  const CurrentSvg = getCurrentSvg();

  // Función para cambiar el nivel
  const handleNivelChange = (newNivel: NivelType) => {
    setLoading(true);
    setNivel(newNivel);
    // Simular un tiempo de carga para mejorar la experiencia de usuario
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  // Función para cambiar la vista
  const handleVistaChange = (newVista: VistaType) => {
    setLoading(true);
    setVista(newVista);
    // Simular un tiempo de carga para mejorar la experiencia de usuario
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">Músculos del Cuerpo</Text>
      </View>

      {/* Filtros */}
      <View className="p-4 bg-white border-b border-gray-200">
        <View className="mb-3">
          <Text className="text-base font-semibold mb-2 text-gray-700">Nivel:</Text>
          <View className="flex-row">
            <FilterButton
              title="Normal"
              isActive={nivel === 'normal'}
              onPress={() => handleNivelChange('normal')}
            />
            <FilterButton
              title="Avanzado"
              isActive={nivel === 'avanzado'}
              onPress={() => handleNivelChange('avanzado')}
            />
          </View>
        </View>

        <View className="mb-3">
          <Text className="text-base font-semibold mb-2 text-gray-700">Vista:</Text>
          <View className="flex-row">
            <FilterButton
              title="Frente"
              isActive={vista === 'frente'}
              onPress={() => handleVistaChange('frente')}
            />
            <FilterButton
              title="Espalda"
              isActive={vista === 'espalda'}
              onPress={() => handleVistaChange('espalda')}
            />
          </View>
        </View>
      </View>

      {/* Contenedor del SVG */}
      <ScrollView className="flex-1" contentContainerClassName="items-center p-4">
        <View className="w-full aspect-square items-center justify-center bg-white rounded-lg shadow-sm p-4">
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <CurrentSvg width="100%" height="100%" />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MusclesScreen;
