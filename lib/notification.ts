import { NotificationTokenDAO, SendNotificationDAO } from '../interfaces/notification';
import { authenticatedFetch } from './utils';

export const registerNotificationToken = async (data: NotificationTokenDAO) => {
  return authenticatedFetch('/notification/token', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export const sendNotification = async (data: SendNotificationDAO) => {
  try {
    console.log('Intentando enviar notificación al token:', data.token);
    
    const response = await authenticatedFetch('/notification/send', {
      method: 'POST',
      body: JSON.stringify({
        title: data.title,
        message: data.message,
        token: data.token
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error en la respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(errorData.message || 'Error al enviar la notificación');
    }

    const responseData = await response.json();
    console.log('Notificación enviada exitosamente:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error detallado en sendNotification:', error);
    throw error;
  }
} 