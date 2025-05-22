// This file is currently disabled due to notification issues
// The functionality has been moved to a future implementation

/*
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
*/

import { NotificationTokenDAO, SendNotificationDAO } from '../interfaces/notification';
import { authenticatedFetch } from './utils';

export const registerNotificationToken = async (token: string) => {
  try {
    const response = await authenticatedFetch('/notification/token', {
      method: 'POST',
      body: JSON.stringify({
        token,
        is_active: true
      })
    });

    if (!response.ok) {
      throw new Error('Error al registrar el token de notificación');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al registrar token:', error);
    throw error;
  }
};

export const getAllNotificationTokens = async () => {
  try {
    const response = await authenticatedFetch('/notification/tokens', {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('Error al obtener los tokens');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener tokens:', error);
    throw error;
  }
};

export const sendNotification = async (data: SendNotificationDAO) => {
  try {
    const response = await authenticatedFetch('/notification/send', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Error al enviar la notificación');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al enviar notificación:', error);
    throw error;
  }
};

export const sendBulkNotification = async (title: string, message: string, tokens: string[]) => {
  try {
    const response = await authenticatedFetch('/notification/send-all', {
      method: 'POST',
      body: JSON.stringify({
        title,
        message,
        tokens
      })
    });

    if (!response.ok) {
      throw new Error('Error al enviar las notificaciones');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al enviar notificaciones en bulk:', error);
    throw error;
  }
}; 