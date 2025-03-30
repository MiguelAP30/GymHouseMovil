import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

export default function Notifications() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSendNotification = () => {
    // Aquí irá la lógica para enviar la notificación
    console.log('Enviando notificación:', { title, description });
  };

  return (
    <View className="flex-1 p-5 bg-white">
      <Text className="text-2xl font-bold mb-5 text-center">
        Enviar Notificación
      </Text>
      
      <View className="mb-5">
        <Text className="text-base font-medium mb-2">Título</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 text-base"
          value={title}
          onChangeText={setTitle}
          placeholder="Ingrese el título de la notificación"
        />
      </View>

      <View className="mb-5">
        <Text className="text-base font-medium mb-2">Descripción</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 text-base h-32"
          value={description}
          onChangeText={setDescription}
          placeholder="Ingrese la descripción de la notificación"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity 
        className="bg-blue-500 p-4 rounded-lg items-center"
        onPress={handleSendNotification}
      >
        <Text className="text-white text-base font-bold">
          Enviar Notificación
        </Text>
      </TouchableOpacity>
    </View>
  );
}

