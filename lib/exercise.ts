import { 
  ExerciseDAO, 
  DifficultyDAO, 
  MuscleDAO, 
  SpecificMuscleDAO, 
  WeekDayDAO,
  ExerciseConfigurationDAO 
} from '../interfaces/exercise';
import { authenticatedFetch } from './utils';

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
  try {
    const response = await authenticatedFetch('/muscle');
    return await response.json();
  } catch (error) {
    console.error('Error al obtener músculos:', error);
    throw error;
  }
}

export const getMuscleById = async (id: number) => {
  try {
    const response = await authenticatedFetch(`/muscle/${id}`);
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener músculo con ID ${id}:`, error);
    throw error;
  }
}

export const postMuscle = async (data: Omit<MuscleDAO, 'id'>) => {
  try {
    const response = await authenticatedFetch('/muscle', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Error al crear músculo:', error);
    throw error;
  }
}

export const putMuscle = async (id: number, data: MuscleDAO) => {
  try {
    const response = await authenticatedFetch(`/muscle/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error(`Error al actualizar músculo con ID ${id}:`, error);
    throw error;
  }
}

export const deleteMuscle = async (id: number) => {
  try {
    const response = await authenticatedFetch(`/muscle/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  } catch (error) {
    console.error(`Error al eliminar músculo con ID ${id}:`, error);
    throw error;
  }
}

// Músculos Específicos
export const getSpecificMuscles = async () => {
  try {
    const response = await authenticatedFetch('/specific_muscle');
    return await response.json();
  } catch (error) {
    console.error('Error al obtener músculos específicos:', error);
    throw error;
  }
}

export const getSpecificMuscleById = async (id: number) => {
  try {
    const response = await authenticatedFetch(`/specific_muscle/${id}`);
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener músculo específico con ID ${id}:`, error);
    throw error;
  }
}

export const postSpecificMuscle = async (data: Omit<SpecificMuscleDAO, 'id'>) => {
  try {
    const response = await authenticatedFetch('/specific_muscle', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Error al crear músculo específico:', error);
    throw error;
  }
}

export const putSpecificMuscle = async (id: number, data: SpecificMuscleDAO) => {
  try {
    const response = await authenticatedFetch(`/specific_muscle/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error(`Error al actualizar músculo específico con ID ${id}:`, error);
    throw error;
  }
}

export const deleteSpecificMuscle = async (id: number) => {
  try {
    const response = await authenticatedFetch(`/specific_muscle/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  } catch (error) {
    console.error(`Error al eliminar músculo específico con ID ${id}:`, error);
    throw error;
  }
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

// Exercise Configuration
export const getExerciseConfigurations = async () => {
  try {
    const response = await authenticatedFetch('/exercise_configuration');
    return await response.json();
  } catch (error) {
    console.error('Error al obtener configuraciones de ejercicios:', error);
    throw error;
  }
};

export const getExerciseConfigurationById = async (id: number) => {
  try {
    const response = await authenticatedFetch(`/exercise_configuration/${id}`);
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener configuración de ejercicio con ID ${id}:`, error);
    throw error;
  }
};

export const createExerciseConfiguration = async (data: Omit<ExerciseConfigurationDAO, 'id'>) => {
  try {
    const response = await authenticatedFetch('/exercise_configuration', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Error al crear configuración de ejercicio:', error);
    throw error;
  }
};

export const updateExerciseConfiguration = async (id: number, data: ExerciseConfigurationDAO) => {
  try {
    const response = await authenticatedFetch(`/exercise_configuration/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error(`Error al actualizar configuración de ejercicio con ID ${id}:`, error);
    throw error;
  }
};

export const deleteExerciseConfiguration = async (id: number) => {
  try {
    const response = await authenticatedFetch(`/exercise_configuration/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  } catch (error) {
    console.error(`Error al eliminar configuración de ejercicio con ID ${id}:`, error);
    throw error;
  }
}; 