import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { sendBulkNotification, getAllNotificationTokens } from '../../../lib/notification';
import * as Notifications from 'expo-notifications';

export default function ExpoNotifications() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notificationTokens, setNotificationTokens] = useState<string[]>([]);

  useEffect(() => {
    loadNotificationTokens();
  }, []);

  const loadNotificationTokens = async () => {
    try {
      const response = await getAllNotificationTokens();
      if (response.data) {
        // Filter only active tokens
        const activeTokens = response.data
          .filter((token: any) => token.is_active)
          .map((token: any) => token.token);
        setNotificationTokens(activeTokens);
      }
    } catch (error) {
      console.error('Error al cargar tokens:', error);
      Alert.alert('Error', 'No se pudieron cargar los tokens de notificación');
    }
  };

  const handleSendNotification = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Error', 'Por favor, complete todos los campos');
      return;
    }

    if (notificationTokens.length === 0) {
      Alert.alert('Error', 'No hay dispositivos registrados para enviar notificaciones');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Enviando notificaciones a tokens:', notificationTokens);
      
      const result = await sendBulkNotification(
        title.trim(),
        description.trim(),
        notificationTokens
      );

      if (result) {
        Alert.alert('Éxito', `Notificaciones enviadas correctamente a ${notificationTokens.length} dispositivos`);
        setTitle('');
        setDescription('');
      }
    } catch (error) {
      console.error('Error al enviar notificaciones:', error);
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
          maxLength={100}
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
          maxLength={200}
        />
      </View>

      <View className="mb-5">
        <Text className="text-sm text-gray-600">
          La notificación se enviará a {notificationTokens.length} dispositivos
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

