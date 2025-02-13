import { View, Text, TextInput, TouchableOpacity, Switch, Image } from 'react-native';
import { tituloForm, parrafoForm, labelForm, inputForm , botonGeneral, textoBotonGeneral, fondoTotal, tarjetaForm} from '../../../components/tokens';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
const crearRutines = () => {

    const [selectedTag, setSelectedTag] = useState("Cardio");
    const [isVisible, setIsVisible] = useState(false);

  return (
    <View className={`${fondoTotal} flex-1 justify-center items-center px-6`}>
      
    {/* Logo Superior */}
    <Image source={require('../../../assets/logo.png')} className="w-16 h-16 mb-4" />

    {/* Tarjeta de formulario */}
    <View className={tarjetaForm}>
      
      {/* Título */}
      <Text className={tituloForm}>Crear rutina</Text>
      <Text className={parrafoForm}>
        Empieza a crear tu propia rutina para ponerte en forma!
      </Text>

      {/* Input: Nombre */}
      <View className="mt-6">
        <Text className={labelForm}>Nombre</Text>
        <TextInput className={inputForm} placeholder="Ej. Rutina de pierna" placeholderTextColor="gray"/>
      </View>

      {/* Input: Descripción */}
      <View className="mt-4">
        <Text className={labelForm}>Descripción</Text>
        <TextInput className={inputForm} placeholder="Ej. Rutina intensa para fortalecer piernas" placeholderTextColor="gray" multiline />
      </View>

      {/* Selector: Etiqueta de la rutina */}
      <View className="mt-4">
        <Text className={labelForm}>Etiqueta de la rutina</Text>
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
        <Text className={labelForm}>Visibilidad</Text>
        <Switch value={isVisible} onValueChange={setIsVisible} />
      </View>

      {/* Botón: Crear Rutina */}
      <TouchableOpacity className={botonGeneral}>
        <Text className={textoBotonGeneral}>Crear Rutina</Text>
      </TouchableOpacity>

    </View>
  </View>
  )
}

export default crearRutines