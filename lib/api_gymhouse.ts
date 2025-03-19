import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  RegisterDAO, 
  LoginDAO, 
  ProfileDAO, 
  GymDAO, 
  RutinaDAO,
  TrainingPlanDAO,
  TagOfTrainingPlanDAO,
  UserDAO
} from '../interfaces/interfaces';
import { getEnvironment } from '../config/env';

const API = getEnvironment().API_URL;

// Verificación de token
const verifyToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) return false;

    const response = await fetch(`${API}/user_data`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Error verificando token:', error);
    return false;
  }
};

// Autenticación
export const postRegister = async (data: RegisterDAO) => {
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

export const postLogin = async (data: LoginDAO) => {
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

// Perfiles
export const postProfile = async (data: ProfileDAO) => {
  return authenticatedFetch('/profile', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export const getProfileByEmail = async (email: string) => {
  return authenticatedFetch(`/profile/${email}`).then(res => res.json());
}

export const getUserDataByEmail = async (email: string) => {
  return authenticatedFetch(`/user/${email}`).then(res => res.json());
}

// Rutinas
export const postTrainingPlan = async (data: RutinaDAO) => {
  return authenticatedFetch('/training_plan', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then(res => res.json());
}

// Tags
export const getTagsOfTrainingPlan = async () => {
  return authenticatedFetch('/tag_of_training_plan').then(res => res.json());
}

export const postTagOfTrainingPlan = async (data: Omit<TagOfTrainingPlanDAO, 'id'>) => {
  return authenticatedFetch('/tag_of_training_plan', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export const getTagOfTrainingPlanById = async (id: number) => {
  return authenticatedFetch(`/tag_of_training_plan/${id}`).then(res => res.json());
}

export const putTagOfTrainingPlan = async (id: number, data: Partial<TagOfTrainingPlanDAO>) => {
  return authenticatedFetch(`/tag_of_training_plan/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export const deleteTagOfTrainingPlan = async (id: number) => {
  return authenticatedFetch(`/tag_of_training_plan/${id}`, {
    method: 'DELETE'
  }).then(res => res.json());
}

// Training Plans
export const getTrainingPlans = async () => {
  return authenticatedFetch('/training_plan').then(res => res.json());
}

export const getTrainingPlansByRoleAdmin = async () => {
  return authenticatedFetch('/training_plan/Generales').then(res => res.json());
}

export const getTrainingPlansByRoleGym = async () => {
  return authenticatedFetch('/training_plan/Profesionales').then(res => res.json());
}

export const getTrainingPlansByRolePremium = async () => {
  return authenticatedFetch('/training_plan/Usuarios').then(res => res.json());
}

export const getMyTrainingPlans = async () => {
  return authenticatedFetch('/training_plan/Propias').then(res => res.json());
}

// Gym
export const postGym = async (data: GymDAO) => {
  return authenticatedFetch('/gym', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export const getGym = async () => {
  return authenticatedFetch('/gym').then(res => res.json());
}

// Función auxiliar para hacer peticiones autenticadas
const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = await AsyncStorage.getItem('token');
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  // Verificar token antes de hacer la petición
  const isValidToken = await verifyToken();
  if (!isValidToken) {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    throw new Error('Token inválido o expirado');
  }

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
    
    // Si el error es de autenticación (401), limpiar el token y redirigir
    if (response.status === 401) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      throw new Error('Sesión expirada');
    }
    
    throw new Error(errorData.message || 'Error en la petición');
  }

  return response;
};