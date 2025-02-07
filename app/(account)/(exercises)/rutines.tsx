import { View, Text, TextInput, TouchableOpacity, Switch, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
const rutines = () => {

    const [selectedTag, setSelectedTag] = useState("Cardio");
    const [isVisible, setIsVisible] = useState(false);

  return (
    <View className="flex-1 bg-gray-900 justify-center items-center px-6">
      
    {/* Logo Superior */}
    <Image source={require('../../../assets/logo.png')} className="w-16 h-16 mb-4" />

    {/* Tarjeta de formulario */}
    <View className="w-full bg-gray-800 p-6 rounded-xl shadow-lg">
      
      {/* Título */}
      <Text className="text-white text-3xl font-bold text-center">Crear rutina</Text>
      <Text className="text-gray-400 text-center mt-2">
        Empieza a crear tu propia rutina para ponerte en forma!
      </Text>

      {/* Input: Nombre */}
      <View className="mt-6">
        <Text className="text-gray-300 mb-2">Nombre</Text>
        <TextInput className="bg-gray-700 text-white p-3 rounded-lg" placeholder="Ej. Rutina de pierna" placeholderTextColor="gray"/>
      </View>

      {/* Input: Descripción */}
      <View className="mt-4">
        <Text className="text-gray-300 mb-2">Descripción</Text>
        <TextInput className="bg-gray-700 text-white p-3 rounded-lg h-20" placeholder="Ej. Rutina intensa para fortalecer piernas" placeholderTextColor="gray" multiline />
      </View>

      {/* Selector: Etiqueta de la rutina */}
      <View className="mt-4">
        <Text className="text-gray-300 mb-2">Etiqueta de la rutina</Text>
        <View className="bg-gray-700 rounded-lg">
          <Picker selectedValue={selectedTag} onValueChange={(itemValue) => setSelectedTag(itemValue)} style={{ color: 'white' }}>
            <Picker.Item label="Cardio" value="Cardio" />
            <Picker.Item label="Fuerza" value="Fuerza" />
            <Picker.Item label="Flexibilidad" value="Flexibilidad" />
            <Picker.Item label="Resistencia" value="Resistencia" />
          </Picker>
        </View>
      </View>

      {/* Switch: Visibilidad */}
      <View className="mt-4 flex-row items-center justify-between">
        <Text className="text-gray-300">Visibilidad</Text>
        <Switch value={isVisible} onValueChange={setIsVisible} />
      </View>

      {/* Botón: Crear Rutina */}
      <TouchableOpacity className="bg-gray-700 py-3 mt-6 rounded-lg">
        <Text className="text-center text-white text-lg font-semibold">Crear Rutina</Text>
      </TouchableOpacity>

    </View>
  </View>
  )
}

export default rutines