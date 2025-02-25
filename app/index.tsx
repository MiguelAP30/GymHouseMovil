import { View, Text,TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { tituloForm, labelForm, parrafoForm,inputForm, botonGeneral, textoBotonGeneral, letraPequeñaForm, fondoTotal, titulo, tarjetaForm } from '../components/tokens';
import React from 'react';

const Index = () => {
  return (
    <View className={`${fondoTotal} flex-1 justify-center items-center  px-6`}>
      <View className={tarjetaForm}>
        <Text className={tituloForm}>🏠 Home</Text>

        <View className="mt-6">
          <TouchableOpacity className={botonGeneral}>
            <Link href="/login">
              <Text className={textoBotonGeneral}>
                🔑 Autenticación
              </Text>
            </Link>
          </TouchableOpacity>
        </View>

        <View className="mt-4">
          <TouchableOpacity className={botonGeneral}>
            <Link href="/register">
              <Text className={textoBotonGeneral}>
                👤 Registro
              </Text>
            </Link>
          </TouchableOpacity>
        </View>
        
        <View className="mt-4">
          <TouchableOpacity className={botonGeneral}>
            <Link href="/about">
              <Text className={textoBotonGeneral}>
                👨🏻‍💻 Sobre nosotros
              </Text>
            </Link>
          </TouchableOpacity>
        </View>

        <View className="mt-4">
          <TouchableOpacity className={botonGeneral}>
            <Link href="/questions">
              <Text className={textoBotonGeneral}>
                ❓ Preguntas frecuentes
              </Text>
            </Link>
          </TouchableOpacity>
        </View>

        <View className="mt-4">
          <TouchableOpacity className={botonGeneral}>
            <Link href="/crearRutines">
              <Text className={textoBotonGeneral}>
                🏋🏻‍♂️ Crear rutina
              </Text>
            </Link>
          </TouchableOpacity>
        </View>

        <View className="mt-4">
          <TouchableOpacity className={botonGeneral}>
            <Link href="/dashboardAdmin/dashboard">
              <Text className={textoBotonGeneral}>
                💻 Dashborad
              </Text>
            </Link>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

export default Index;
