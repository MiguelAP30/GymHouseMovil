import { View, Text, TextInput, TouchableOpacity, Switch, Image, Alert } from 'react-native';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
  tituloForm, parrafoForm, labelForm, inputForm, 
  botonGeneral, textoBotonGeneral, fondoTotal, tarjetaForm
} from '../../../components/tokens';
import { useNetwork } from '../../../contexts/NetworkProvider';

const CrearRutina = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [selectedTag, setSelectedTag] = useState("Cardio");
  const [isVisible, setIsVisible] = useState(false);
  const { isConnected } = useNetwork();
  const onSubmit = (data: any) => {
    if(!isConnected){
      Alert.alert("Error", "No tienes conexión a Internet");
      return;
    }else{
      Alert.alert("Rutina creada", JSON.stringify(data, null, 2));
    }
  };

  return (
    <View className={`${fondoTotal} flex-1 justify-center items-center px-6`}>
      {isConnected === false && <Text className="text-red-500 mb-4">No tienes conexión a Internet</Text>}
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
          <Controller
            control={control}
            name="nombre"
            rules={{ required: "El nombre es obligatorio" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={inputForm}
                placeholder="Ej. Rutina de pierna"
                placeholderTextColor="gray"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.nombre && <Text className="text-red-500">{errors.nombre.message?.toString()}</Text>}
        </View>

        {/* Input: Descripción */}
        <View className="mt-4">
          <Text className={labelForm}>Descripción</Text>
          <Controller
            control={control}
            name="descripcion"
            rules={{ required: "La descripción es obligatoria" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={inputForm}
                placeholder="Ej. Rutina intensa para fortalecer piernas"
                placeholderTextColor="gray"
                multiline
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.descripcion && <Text className="text-red-500">{errors.descripcion.message?.toString()}</Text>}
        </View>



        {/* Switch: Visibilidad */}
        <View className="mt-4 flex-row items-center justify-between">
          <Text className={labelForm}>Visibilidad</Text>
          <Controller
            control={control}
            name="visibilidad"
            render={({ field: { onChange, value } }) => (
              <Switch
                value={value ?? isVisible}
                onValueChange={(newValue) => {
                  setIsVisible(newValue);
                  onChange(newValue);
                }}
              />
            )}
          />
        </View>

        {/* Botón: Crear Rutina */}
        <TouchableOpacity className={botonGeneral} onPress={handleSubmit(onSubmit)}>
          <Text className={textoBotonGeneral}>Crear Rutina</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default CrearRutina;
