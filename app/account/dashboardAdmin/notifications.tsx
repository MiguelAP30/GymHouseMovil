import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { sendNotification } from '../../../lib/api_gymhouse';

const NOTIFICATION_TOKENS = [
  "ExponentPushToken[2beYvGMKCMvdRS1Ud7Kjf0]",
  "ExponentPushToken[FVBhZHK9iQs0N6c-LzeTx_]",
  "ExponentPushToken[Z6O4drPo6Pxs1U9aTQ6t_t]"
];

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
      console.log('Enviando notificaciones a tokens:', NOTIFICATION_TOKENS);
      
      // Enviamos una notificación por cada token
      const results = await Promise.allSettled(
        NOTIFICATION_TOKENS.map(token => 
          sendNotification({
            title: title.trim(),
            message: description.trim(),
            token: token
          })
        )
      );

      console.log('Resultados del envío:', results);

      // Contamos cuántas notificaciones se enviaron exitosamente
      const successfulCount = results.filter(result => result.status === 'fulfilled').length;
      
      if (successfulCount === NOTIFICATION_TOKENS.length) {
        Alert.alert('Éxito', `Notificaciones enviadas correctamente a ${successfulCount} dispositivos`);
        setTitle('');
        setDescription('');
      } else {
        Alert.alert(
          'Parcial', 
          `Se enviaron ${successfulCount} de ${NOTIFICATION_TOKENS.length} notificaciones correctamente`
        );
      }
    } catch (error) {
      console.error('Error completo al enviar notificaciones:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Error al enviar las notificaciones. Por favor, intente nuevamente.'
      );
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

      <View className="mb-5">
        <Text className="text-sm text-gray-600">
          La notificación se enviará a {NOTIFICATION_TOKENS.length} dispositivos
        </Text>
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

