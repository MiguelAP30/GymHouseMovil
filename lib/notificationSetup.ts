import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { registerNotificationToken } from './notification';

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return;
  }

  try {
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Token obtenido:', token);

    // Registrar el token en el backend
    await registerNotificationToken(token);
    console.log('Token registrado exitosamente en el backend');
  } catch (error) {
    console.error('Error al obtener o registrar el token:', error);
  }

  return token;
}

export function setupNotificationHandlers() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
} 