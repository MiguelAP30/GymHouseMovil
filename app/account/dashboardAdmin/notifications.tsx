import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { sendNotification } from '../../../lib/api_gymhouse';

export default function Notifications() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendNotification = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Error', 'Por favor, complete todos los campos');
      return;
    }

    try {
      setIsLoading(true);
      const response = await sendNotification({
        title: title.trim(),
        message: description.trim(),
        token: "ExponentPushToken[FVBhZHK9iQs0N6c-LzeTx_]"
      });

      if (response.status === 200) {
        Alert.alert('Éxito', 'Notificación enviada correctamente');
        setTitle('');
        setDescription('');
      } else {
        Alert.alert('Error', response.message || 'Error al enviar la notificación');
      }
    } catch (error) {
      console.error('Error al enviar notificación:', error);
      Alert.alert('Error', 'Error al enviar la notificación');
    } finally {
      setIsLoading(false);
    }
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
        className={`${isLoading ? 'bg-gray-400' : 'bg-blue-500'} p-4 rounded-lg items-center`}
        onPress={handleSendNotification}
        disabled={isLoading}
      >
        <Text className="text-white text-base font-bold">
          {isLoading ? 'Enviando...' : 'Enviar Notificación'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

