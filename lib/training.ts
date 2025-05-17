import { 
  TrainingPlanDAO, 
  TagOfTrainingPlanDAO, 
  WorkoutDayExerciseDAO 
} from '../interfaces/training';
import { authenticatedFetch } from './utils';

export const getTrainingPlans = async (
  page: number = 1, 
  size: number = 10, 
  name?: string, 
  role_id?: number, 
  tag_id?: number, 
  max_days?: number
) => {
  try {
    let url = `/training_plan?page=${page}&size=${size}`;
    
    if (name) {
      url += `&name=${encodeURIComponent(name)}`;
    }
    
    if (role_id) {
      url += `&role_id=${role_id}`;
    }
    
    if (tag_id) {
      url += `&tag_id=${tag_id}`;
    }
    
    if (max_days) {
      url += `&max_days=${max_days}`;
    }
    
    console.log('URL de la petición:', url);
    const response = await authenticatedFetch(url);
    const data = await response.json();
    console.log('Respuesta del servidor:', data);
    return data;
  } catch (error) {
    console.error('Error al obtener rutinas de entrenamiento:', error);
    throw error;
  }
};

export const getTrainingPlanById = async (id: number) => {
  try {
    const response = await authenticatedFetch(`/training_plan/${id}`);
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener rutina de entrenamiento con ID ${id}:`, error);
    throw error;
  }
};

export const getTrainingPlansByUserEmail = async (email: string) => {
  try {
    const response = await authenticatedFetch(`/training_plan/user/${encodeURIComponent(email)}`);
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener rutinas de entrenamiento para el usuario ${email}:`, error);
    throw error;
  }
};

export const getMyTrainingPlans = async () => {
  try {
    const response = await authenticatedFetch('/training_plan/my');
    return await response.json();
  } catch (error) {
    console.error('Error al obtener mis rutinas de entrenamiento:', error);
    throw error;
  }
};

export const createTrainingPlan = async (data: Omit<TrainingPlanDAO, 'id'>) => {
  try {
    const response = await authenticatedFetch('/training_plan/me', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Error al crear rutina de entrenamiento:', error);
    throw error;
  }
};

export const updateTrainingPlan = async (id: number, data: TrainingPlanDAO) => {
  try {
    const response = await authenticatedFetch(`/training_plan/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error(`Error al actualizar rutina de entrenamiento con ID ${id}:`, error);
    throw error;
  }
};

export const deleteTrainingPlan = async (id: number) => {
  try {
    const response = await authenticatedFetch(`/training_plan/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  } catch (error) {
    console.error(`Error al eliminar rutina de entrenamiento con ID ${id}:`, error);
    throw error;
  }
};

// Etiquetas de rutinas
export const getTagOfTrainingPlans = async () => {
  try {
    const response = await authenticatedFetch('/tag_of_training_plan');
    return await response.json();
  } catch (error) {
    console.error('Error al obtener etiquetas de rutinas:', error);
    throw error;
  }
};

export const getTagOfTrainingPlanById = async (id: number) => {
  try {
    const response = await authenticatedFetch(`/tag_of_training_plan/${id}`);
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener etiqueta de rutina con ID ${id}:`, error);
    throw error;
  }
};

export const createTagOfTrainingPlan = async (data: Omit<TagOfTrainingPlanDAO, 'id'>) => {
  try {
    const response = await authenticatedFetch('/tag_of_training_plan', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Error al crear etiqueta de rutina:', error);
    throw error;
  }
};

export const updateTagOfTrainingPlan = async (id: number, data: TagOfTrainingPlanDAO) => {
  try {
    const response = await authenticatedFetch(`/tag_of_training_plan/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error(`Error al actualizar etiqueta de rutina con ID ${id}:`, error);
    throw error;
  }
};

export const deleteTagOfTrainingPlan = async (id: number) => {
  try {
    const response = await authenticatedFetch(`/tag_of_training_plan/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  } catch (error) {
    console.error(`Error al eliminar etiqueta de rutina con ID ${id}:`, error);
    throw error;
  }
};

// Workout Day Exercise
export const getMyWorkoutDayExercises = async () => {
  try {
    const response = await authenticatedFetch('/workout_day_exercise/my');
    return await response.json();
  } catch (error) {
    console.error('Error al obtener mis ejercicios por día:', error);
    throw error;
  }
};

export const getWorkoutDayExerciseById = async (id: number) => {
  try {
    const response = await authenticatedFetch(`/workout_day_exercise/${id}`);
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener ejercicio por día con ID ${id}:`, error);
    throw error;
  }
};

export const getWorkoutDayExercisesByTrainingPlan = async (trainingPlanId: number) => {
  try {
    const response = await authenticatedFetch(`/workout_day_exercise/training_plan/${trainingPlanId}`);
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener ejercicios por día para el plan de entrenamiento ${trainingPlanId}:`, error);
    throw error;
  }
};

export const createWorkoutDayExercise = async (data: Omit<WorkoutDayExerciseDAO, 'id'>) => {
  try {
    const response = await authenticatedFetch('/workout_day_exercise', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Error al crear ejercicio por día:', error);
    throw error;
  }
};

export const updateWorkoutDayExercise = async (id: number, data: WorkoutDayExerciseDAO) => {
  try {
    const response = await authenticatedFetch(`/workout_day_exercise/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error(`Error al actualizar ejercicio por día con ID ${id}:`, error);
    throw error;
  }
};

export const deleteWorkoutDayExercise = async (id: number) => {
  try {
    const response = await authenticatedFetch(`/workout_day_exercise/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  } catch (error) {
    console.error(`Error al eliminar ejercicio por día con ID ${id}:`, error);
    throw error;
  }
}; 