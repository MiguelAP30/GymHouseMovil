import AsyncStorage from '@react-native-async-storage/async-storage';
import { getEnvironment } from '../config/env';

const API = getEnvironment().API_URL;

export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log('Token in authenticatedFetch:', token ? 'Present' : 'Missing');
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    console.log('Making request to:', `${API}${url}`);
    console.log('Request headers:', headers);

    const response = await fetch(`${API}${url}`, {
      ...options,
      headers,
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('Error response:', errorData);
      
      if (response.status === 401) {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        throw new Error('Sesión expirada');
      }
      
      throw new Error(errorData.message || 'Error en la petición');
    }

    return response;
  } catch (error) {
    console.error('Error in authenticatedFetch:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error desconocido en la petición');
  }
}; 