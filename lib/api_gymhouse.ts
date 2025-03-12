import AsyncStorage from '@react-native-async-storage/async-storage';

// Cambia localhost por tu IP local
const API = 'http://192.168.153.228:8000/api/v1' // Asegúrate que esta IP coincida con la de tu computadora
//v1

interface RegisterData {
  email: string;
  id_number: string;
  password: string;
  username: string;
  name: string;
  phone: string;
  address: string;
  birth_date: string;
  gender: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const postRegister = async (data: RegisterData) => {
  try {
    console.log('Intentando registrar con URL:', `${API}/register`);
    const response = await fetch(`${API}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error de registro:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(errorData.message || 'Error en el registro');
    }

    const rawData = await response.json();
    return rawData;
  } catch (error) {
    console.error('Error en el registro:', error);
    throw error;
  }
}

export const postLogin = async (data: LoginData) => {
  try {
    console.log('Intentando login con URL:', `${API}/login`);
    const response = await fetch(`${API}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error de login:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(errorData.message || 'Error en el inicio de sesión');
    }

    const rawData = await response.json();
    return rawData;
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    throw error;
  }
}

// Función auxiliar para hacer peticiones autenticadas
export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = await AsyncStorage.getItem('token');
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(`${API}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Error en la petición:', {
      url,
      status: response.status,
      statusText: response.statusText,
      errorData
    });
    throw new Error(errorData.message || 'Error en la petición');
  }

  return response;
};