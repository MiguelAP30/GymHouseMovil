import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { tituloForm, labelForm, parrafoForm, inputForm, botonGeneral, textoBotonGeneral, letraPequeñaForm, fondoTotal } from '../../components/tokens';

export default function Register() {
  const [selectedGender, setSelectedGender] = useState('');

  return (
    <View className={`${fondoTotal} flex-1 px-6`}>
      <ScrollView 
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }} 
        showsVerticalScrollIndicator={false} // 🔥 Oculta la barra de scroll
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
          <TextInput placeholder="Tu nombre completo" placeholderTextColor="gray" className={inputForm} />
        </View>

        {/* Input: Nombre de usuario */}
        <View className="w-full mt-4">
          <Text className={labelForm}>Nombre de usuario</Text>
          <TextInput placeholder="Tu usuario" placeholderTextColor="gray" className={inputForm} />
        </View>

        {/* Input: Correo */}
        <View className="w-full mt-4">
          <Text className={labelForm}>Correo electrónico</Text>
          <TextInput placeholder="tucorreo@ejemplo.com" placeholderTextColor="gray" className={inputForm} />
        </View>

        {/* Input: Teléfono */}
        <View className="w-full mt-4">
          <Text className={labelForm}>Número de teléfono</Text>
          <TextInput placeholder="3001234567" placeholderTextColor="gray" keyboardType="phone-pad" className={inputForm} />
        </View>

        {/* Input: Dirección */}
        <View className="w-full mt-4">
          <Text className={labelForm}>Dirección</Text>
          <TextInput placeholder="Calle 123 # 45-67" placeholderTextColor="gray" className={inputForm} />
        </View>

        {/* Input: Fecha de nacimiento */}
        <View className="w-full mt-4">
          <Text className={labelForm}>Fecha de nacimiento</Text>
          <TextInput placeholder="DD/MM/AAAA" placeholderTextColor="gray" keyboardType="numeric" className={inputForm} />
        </View>

        {/* Input: Género */}
        <View className="w-full mt-4">
          <Text className={labelForm}>Género</Text>
          <View className="bg-gray-800 rounded-lg">
            <Picker selectedValue={selectedGender} onValueChange={(itemValue) => setSelectedGender(itemValue)} style={{ color: 'white' }}>
              <Picker.Item label="Seleccione su género" value="" />
              <Picker.Item label="Masculino" value="masculino" />
              <Picker.Item label="Femenino" value="femenino" />
              <Picker.Item label="Otro" value="otro" />
            </Picker>
          </View>
        </View>

        {/* Input: Contraseña */}
        <View className="w-full mt-4">
          <Text className={labelForm}>Contraseña</Text>
          <TextInput placeholder="********" placeholderTextColor="gray" secureTextEntry className={inputForm} />
        </View>

        {/* Botón: Registrarse */}
        <TouchableOpacity className={botonGeneral}>
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
