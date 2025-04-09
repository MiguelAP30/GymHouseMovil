import { View, Text, TextInput, TouchableOpacity, Switch, Image } from 'react-native';
//import { Picker } from '@react-native-picker/picker';
import { useState, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
  tituloForm, parrafoForm, labelForm, inputForm, 
  botonGeneral, textoBotonGeneral, fondoTotal, tarjetaForm
} from '../../../components/tokens';
import { AuthContext } from '../../../context/AuthStore';
import { ROLES } from '../../../interfaces/interfaces';
import { Redirect } from 'expo-router';


const CrearRutina = () => {
  const { isAuthenticated, role } = useContext(AuthContext);
  if (!isAuthenticated || (role ?? 0) < ROLES.premium) {
    return <Redirect href="/unauthorized" />;
  }
  const { control, handleSubmit, formState: { errors } } = useForm();
  //const [selectedTag, setSelectedTag] = useState("Cardio");
  const [isVisible, setIsVisible] = useState(false);

  const onSubmit = (data: any) => {
    console.log("Datos de la rutina:", data);
    alert("Rutina creada:\n" + JSON.stringify(data, null, 2));
  };

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
                maxLength={50}
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
                maxLength={200}
              />
            )}
          />
          {errors.descripcion && <Text className="text-red-500">{errors.descripcion.message?.toString()}</Text>}
        </View>

        {/* Selector: Etiqueta de la rutina */}
        <View className="mt-4">
          <Text className={labelForm}>Etiqueta de la rutina</Text>
          {/*<Controller
            control={control}
            name="etiqueta"
            rules={{ required: "Selecciona una etiqueta" }}
            render={({ field: { onChange, value } }) => (
              <View className="bg-gray-700 rounded-lg">
                <Picker
                  selectedValue={value || selectedTag}
                  onValueChange={(itemValue) => {
                    setSelectedTag(itemValue);
                    onChange(itemValue);
                  }}
                  style={{ color: 'white' }}
                >
                  <Picker.Item label="Cardio" value="Cardio" />
                  <Picker.Item label="Fuerza" value="Fuerza" />
                  <Picker.Item label="Flexibilidad" value="Flexibilidad" />
                  <Picker.Item label="Resistencia" value="Resistencia" />
                </Picker>
              </View>
            )}
          />*/}
          {errors.etiqueta && <Text className="text-red-500">{errors.etiqueta.message?.toString()}</Text>}
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
