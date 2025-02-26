import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Link } from 'expo-router';
// import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
  tituloForm, labelForm, parrafoForm, inputForm, 
  botonGeneral, textoBotonGeneral, letraPequeñaForm, fondoTotal 
} from '../../components/tokens';

export default function Register() {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [selectedGender, setSelectedGender] = useState('');

  const onSubmit = (data: any) => {
    console.log("Datos del formulario:", data);
    alert("Registro exitoso:\n" + JSON.stringify(data, null, 2));
  };

  return (
    <View className={`${fondoTotal} flex-1 px-6`}>
      <ScrollView 
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }} 
        showsVerticalScrollIndicator={false} 
      >

        {/* Logo */}
        <Image source={require('../../assets/logo.png')} className="w-32 h-32 mt-8 mb-6" />

        {/* Título */}
        <Text className={tituloForm}>Regístrate en GymHouse</Text>
        <Text className={parrafoForm}>
          Crea una cuenta para acceder a entrenamientos personalizados
        </Text>

        {/* Input: Nombre */}
        <View className="w-full mt-6">
          <Text className={labelForm}>Nombre</Text>
          <Controller
            control={control}
            name="name"
            rules={{ required: "El nombre es obligatorio", minLength: { value: 3, message: "Mínimo 3 caracteres" } }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Tu nombre completo"
                placeholderTextColor="gray"
                className={inputForm}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.name && <Text className="text-red-500">{errors.name.message?.toString()}</Text>}
        </View>

        {/* Input: Correo */}
        <View className="w-full mt-4">
          <Text className={labelForm}>Correo electrónico</Text>
          <Controller
            control={control}
            name="email"
            rules={{ required: "El correo es obligatorio", pattern: { value: /\S+@\S+\.\S+/, message: "Correo inválido" } }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="tucorreo@ejemplo.com"
                placeholderTextColor="gray"
                className={inputForm}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.email && <Text className="text-red-500">{errors.email.message?.toString()}</Text>}
        </View>

        
        {/* Input: Contraseña */}
        <View className="w-full mt-4">
          <Text className={labelForm}>Contraseña</Text>
          <Controller
            control={control}
            name="password"
            rules={{ 
              required: "La contraseña es obligatoria", 
              minLength: { value: 6, message: "Mínimo 6 caracteres" } 
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="********"
                placeholderTextColor="gray"
                secureTextEntry
                className={inputForm}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.password && <Text className="text-red-500">{errors.password.message?.toString()}</Text>}
        </View>

        {/* Input: Teléfono */}
        <View className="w-full mt-4">
          <Text className={labelForm}>Número de teléfono</Text>
          <Controller
            control={control}
            name="phone"
            rules={{ required: "El teléfono es obligatorio", minLength: { value: 10, message: "Mínimo 10 dígitos" } }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="3001234567"
                placeholderTextColor="gray"
                keyboardType="phone-pad"
                className={inputForm}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.phone && <Text className="text-red-500">{errors.phone.message?.toString()}</Text>}
        </View>

        {/* Input: Dirección */}
        <View className="w-full mt-4">
          <Text className={labelForm}>Dirección</Text>
          <Controller
            control={control}
            name="address"
            rules={{ required: "La dirección es obligatoria" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Calle 123 # 45-67"
                placeholderTextColor="gray"
                className={inputForm}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.address && <Text className="text-red-500">{errors.address.message?.toString()}</Text>}
        </View>

        {/* Input: Género */}
        <View className="w-full mt-4">
          <Text className={labelForm}>Género</Text>
          <Controller
            control={control}
            name="gender"
            rules={{ required: "Selecciona un género" }}
            render={({ field: { onChange, value } }) => (
              <View className="bg-gray-800 rounded-lg">
                {/*<Picker
                  selectedValue={value || ""}
                  onValueChange={(itemValue) => {
                    setSelectedGender(itemValue);
                    onChange(itemValue);
                  }}
                  style={{ color: 'white' }}
                >
                  <Picker.Item label="Seleccione su género" value="" />
                  <Picker.Item label="Masculino" value="masculino" />
                  <Picker.Item label="Femenino" value="femenino" />
                  <Picker.Item label="Otro" value="otro" />
                </Picker>*/}
              </View>
            )}
          />
          {errors.gender && <Text className="text-red-500">{errors.gender.message?.toString()}</Text>}
        </View>


        {/* Botón: Registrarse */}
        <TouchableOpacity className={botonGeneral} onPress={handleSubmit(onSubmit)}>
          <Text className={textoBotonGeneral}>Registrarse</Text>
        </TouchableOpacity>

        {/* Enlace: Inicio de sesión */}
        <Text className={letraPequeñaForm}>
          ¿Ya tienes una cuenta?  
          <Link href="/login" className="text-blue-400"> Iniciar sesión</Link>
        </Text>

      </ScrollView>
    </View>
  );
}
