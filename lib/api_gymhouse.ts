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
  ExerciseDAO,
  DifficultyDAO,
  MuscleDAO,
  SpecificMuscleDAO,
  WeekDayDAO,
  NotificationTokenDAO,
  SendNotificationDAO
} from '../interfaces/interfaces';
import { getEnvironment } from '../config/env';

const API = getEnvironment().API_URL;



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

export const getUserGym = async () => {
  return authenticatedFetch('/gym/user').then(res => res.json());
}

export const updateUserGym = async (data: GymDAO) => {
  return authenticatedFetch('/gym/user', {
    method: 'PUT',
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export const deleteUserGym = async () => {
  return authenticatedFetch('/gym/user', {
    method: 'DELETE'
  }).then(res => res.json());
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
  try {
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
      
      if (response.status === 401) {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        throw new Error('Sesión expirada');
      }
      
      throw new Error(errorData.message || 'Error en la petición');
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error desconocido en la petición');
  }
};

export const getMachines = async () => {
  try {
    const response = await authenticatedFetch('/machine');
    return await response.json();
  } catch (error) {
    console.error('Error al obtener máquinas:', error);
    throw error;
  }
}

export const createMachine = async (data: { name: string, description: string }) => {
  try {
    const response = await authenticatedFetch('/machine', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Error al crear máquina:', error);
    throw error;
  }
}

export const updateMachine = async (id: number, data: { name: string, description: string }) => {
  try {
    const response = await authenticatedFetch(`/machine/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Error al actualizar máquina:', error);
    throw error;
  }
}

export const deleteMachine = async (id: number) => {
  try {
    const response = await authenticatedFetch(`/machine/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  } catch (error) {
    console.error('Error al eliminar máquina:', error);
    throw error;
  }
}

// Ejercicios
export const getExercises = async (page: number = 1, size: number = 10, searchName?: string, difficultyId?: number | null, machineId?: number | null) => {
  try {
    let url = `/exercise?page=${page}&size=${size}`;
    
    if (searchName && searchName.trim()) {
      url += `&name=${encodeURIComponent(searchName.trim())}`;
    }
    if (difficultyId && difficultyId !== null) {
      url += `&difficulty_id=${difficultyId}`;
    }
    if (machineId && machineId !== null) {
      url += `&machine_id=${machineId}`;
    }
    
    console.log('URL de la petición:', url);
    const response = await authenticatedFetch(url);
    const data = await response.json();
    console.log('Respuesta del servidor:', data);
    return data;
  } catch (error) {
    console.error('Error detallado en getExercises:', error);
    throw error;
  }
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

// Dificultades
export const getDifficulties = async () => {
  return authenticatedFetch('/dificulty').then(res => res.json());
}

export const postDifficulty = async (data: Omit<DifficultyDAO, 'id'>) => {
  return authenticatedFetch('/dificulty', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export const getDifficultyById = async (id: number) => {
  return authenticatedFetch(`/dificulty/${id}`).then(res => res.json());
}

export const putDifficulty = async (id: number, data: DifficultyDAO) => {
  return authenticatedFetch(`/dificulty/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export const deleteDifficulty = async (id: number) => {
  return authenticatedFetch(`/dificulty/${id}`, {
    method: 'DELETE'
  }).then(res => res.json());
}

// Músculos
export const getMuscles = async () => {
  return authenticatedFetch('/muscle').then(res => res.json());
}

export const getMuscleById = async (id: number) => {
  return authenticatedFetch(`/muscle/${id}`).then(res => res.json());
}

export const postMuscle = async (data: Omit<MuscleDAO, 'id'>) => {
  return authenticatedFetch('/muscle', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export const putMuscle = async (id: number, data: MuscleDAO) => {
  return authenticatedFetch(`/muscle/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export const deleteMuscle = async (id: number) => {
  return authenticatedFetch(`/muscle/${id}`, {
    method: 'DELETE'
  }).then(res => res.json());
}

// Músculos Específicos
export const getSpecificMuscles = async () => {
  return authenticatedFetch('/specific_muscle').then(res => res.json());
}

export const getSpecificMuscleById = async (id: number) => {
  return authenticatedFetch(`/specific_muscle/${id}`).then(res => res.json());
}

export const postSpecificMuscle = async (data: Omit<SpecificMuscleDAO, 'id'>) => {
  return authenticatedFetch('/specific_muscle', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export const putSpecificMuscle = async (id: number, data: SpecificMuscleDAO) => {
  return authenticatedFetch(`/specific_muscle/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export const deleteSpecificMuscle = async (id: number) => {
  return authenticatedFetch(`/specific_muscle/${id}`, {
    method: 'DELETE'
  }).then(res => res.json());
}

// Días de la Semana
export const getWeekDays = async () => {
  return authenticatedFetch('/week_day').then(res => res.json());
}

export const getWeekDayById = async (id: number) => {
  return authenticatedFetch(`/week_day/${id}`).then(res => res.json());
}

export const postWeekDay = async (data: Omit<WeekDayDAO, 'id'>) => {
  return authenticatedFetch('/week_day', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export const putWeekDay = async (id: number, data: WeekDayDAO) => {
  return authenticatedFetch(`/week_day/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export const deleteWeekDay = async (id: number) => {
  return authenticatedFetch(`/week_day/${id}`, {
    method: 'DELETE'
  }).then(res => res.json());
}

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

export const forgotPassword = async (email: string) => {
  try {
    console.log('Intentando solicitar recuperación de contraseña para:', email);
    const response = await fetch(`${API}/forgot_password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(email) // Enviamos el email directamente
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error en la respuesta:', errorData);
      throw new Error(errorData.message || 'Error al solicitar recuperación de contraseña');
    }

    const data = await response.json();
    console.log('Respuesta exitosa:', data);
    return data;
  } catch (error) {
    console.error('Error en forgotPassword:', error);
    throw error;
  }
}

export const resetPassword = async (data: { email: string; new_password: string; reset_token: string }) => {
  try {
    const response = await fetch(`${API}/reset_password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al restablecer la contraseña');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en resetPassword:', error);
    throw error;
  }
}

export const changePassword = async (data: { current_password: string; new_password: string }) => {
  return authenticatedFetch('/change_password', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export const updateUserData = async (email: string, data: {
  id_number: string;
  user_name: string;
  name: string;
  phone: string;
  address: string;
  birth_date: string;
  gender: string;
}) => {
  return authenticatedFetch(`/user/${encodeURIComponent(email)}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }).then(res => res.json());
}