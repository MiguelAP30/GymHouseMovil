import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  RegisterDAO, 
  LoginDAO, 
  ProfileDAO, 
  GymDAO, 
  RutinaDAO,
  TrainingPlanDAO,
  TagOfTrainingPlanDAO,
  UserDAO,
  ExerciseDAO
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

    // Después del registro exitoso, intentar hacer login automáticamente
    const loginResponse = await fetch(`${API}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password
      })
    });

    if (!loginResponse.ok) {
      throw new Error('Registro exitoso pero error al iniciar sesión automáticamente');
    }

    const rawData = await loginResponse.json();
    
    if (!rawData.access_token) {
      console.error('Respuesta del servidor inválida:', rawData);
      throw new Error('La respuesta del servidor no tiene el formato esperado');
    }

    // Decodificar el token JWT para obtener la información del usuario
    const tokenParts = rawData.access_token.split('.');
    if (tokenParts.length !== 3) {
      throw new Error('Token JWT inválido');
    }

    const payload = JSON.parse(atob(tokenParts[1]));
    
    // Construir el objeto usuario usando los datos del registro
    const user = {
      email: data.email,
      name: data.name,
      id_number: data.id_number,
      user_name: data.user_name,
      phone: data.phone,
      birth_date: new Date(data.birth_date).getTime(),
      gender: data.gender,
      address: data.address,
      password: '',
      status: true,
      start_date: null,
      final_date: null,
      role_id: payload['user.role'] || 1 // rol por defecto: logued
    };

    return {
      access_token: rawData.access_token,
      user: user,
      status: 201,
      message: 'Registro exitoso'
    };
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
    
    if (!rawData.access_token) {
      console.error('Respuesta del servidor inválida:', rawData);
      throw new Error('La respuesta del servidor no tiene el formato esperado');
    }

    // Decodificar el token JWT para obtener la información del usuario
    const tokenParts = rawData.access_token.split('.');
    if (tokenParts.length !== 3) {
      throw new Error('Token JWT inválido');
    }

    const payload = JSON.parse(atob(tokenParts[1]));
    
    // Construir el objeto usuario a partir de los claims del token
    const user = {
      email: payload.sub,
      name: payload['user.name'],
      id_number: payload['user.id_number'],
      role_id: payload['user.role'],
      status: payload['user.status'],
      user_name: payload['user.name'], // Usando el mismo nombre como username por ahora
      phone: '',  // Valores por defecto para campos requeridos
      birth_date: 0,
      gender: '',
      address: '',
      password: '',
      start_date: null,
      final_date: null
    };

    return {
      access_token: rawData.access_token,
      user: user,
      status: 200,
      message: 'Login exitoso'
    };
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

// Usuarios y Roles
export const getAllUsers = async () => {
  try {
    const response = await authenticatedFetch('/user');
    const data = await response.json();
    
    if (!data) {
      throw new Error('No se recibieron datos de usuarios');
    }
    
    return { data: Array.isArray(data) ? data : [data] };
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
}

export const updateUserRole = async (email: string, role_id: number) => {
  try {
    const response = await authenticatedFetch(`/user/user_role/${email}?role_id=${role_id}`, {
      method: 'PUT'
    });
    
    if (!response.ok) {
      throw new Error('Error al actualizar el rol del usuario');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al actualizar rol:', error);
    throw error;
  }
}

// Función auxiliar para hacer peticiones autenticadas
const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = await AsyncStorage.getItem('token');
  
  if (!token) {
    throw new Error('No hay token de autenticación');
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
    
    if (response.status === 401) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      throw new Error('Sesión expirada');
    }
    
    throw new Error(errorData.message || 'Error en la petición');
  }

  return response;
};


const getMachines = async () => {
  return authenticatedFetch('/machine').then(res => res.json());
}

// Ejercicios
export const getExercises = async () => {
  return authenticatedFetch('/exercise').then(res => res.json());
}

export const getExerciseById = async (id: number) => {
  return authenticatedFetch(`/exercise/${id}`).then(res => res.json());
}

export const postExercise = async (data: ExerciseDAO) => {
  return authenticatedFetch('/exercise', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export const putExercise = async (id: number, data: ExerciseDAO) => {
  return authenticatedFetch(`/exercise/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export const deleteExercise = async (id: number) => {
  return authenticatedFetch(`/exercise/${id}`, {
    method: 'DELETE'
  }).then(res => res.json());
}





