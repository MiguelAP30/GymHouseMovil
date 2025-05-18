import { authenticatedFetch } from "./utils";
import { HistoryPRExercise, SeriesPRExercise, DropsetPRExercise } from "../interfaces/pr_exercise";

// History PR Exercise endpoints
export const createHistoryPRExercise = async (data: HistoryPRExercise) => {
  try {
    const response = await authenticatedFetch('/api/v1/history_pr_exercise', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Error al crear historial de PR:', error);
    throw error;
  }
};

export const getAllHistoryPRExercise = async () => {
  try {
    const response = await authenticatedFetch('/api/v1/history_pr_exercise');
    return await response.json();
  } catch (error) {
    console.error('Error al obtener historiales de PR:', error);
    throw error;
  }
};

export const updateHistoryPRExercise = async (id: number, data: Partial<HistoryPRExercise>) => {
  try {
    const response = await authenticatedFetch(`/api/v1/history_pr_exercise/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error(`Error al actualizar historial de PR con ID ${id}:`, error);
    throw error;
  }
};

export const deleteHistoryPRExercise = async (id: number) => {
  try {
    const response = await authenticatedFetch(`/api/v1/history_pr_exercise/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  } catch (error) {
    console.error(`Error al eliminar historial de PR con ID ${id}:`, error);
    throw error;
  }
};

export const getHistoryPRExerciseById = async (id: number) => {
  try {
    const response = await authenticatedFetch(`/api/v1/history_pr_exercise/${id}`);
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener historial de PR con ID ${id}:`, error);
    throw error;
  }
};

export const getHistoryPRExerciseByExercise = async (exerciseId: number) => {
  try {
    const response = await authenticatedFetch(`/api/v1/history_pr_exercise/exercise/${exerciseId}`);
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener historiales de PR para ejercicio ${exerciseId}:`, error);
    throw error;
  }
};

export const getHistoryPRExerciseByUser = async (userEmail: string) => {
  try {
    const response = await authenticatedFetch(`/api/v1/history_pr_exercise/user/${encodeURIComponent(userEmail)}`);
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener historiales de PR para usuario ${userEmail}:`, error);
    throw error;
  }
};

export const getHistoryPRExerciseByExerciseAndUser = async (exerciseId: number, userEmail: string) => {
  try {
    const response = await authenticatedFetch(`/api/v1/history_pr_exercise/exercise/${exerciseId}/user/${encodeURIComponent(userEmail)}`);
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener historiales de PR para ejercicio ${exerciseId} y usuario ${userEmail}:`, error);
    throw error;
  }
};

// Series PR Exercise endpoints
export const createSeriesPRExercise = async (data: SeriesPRExercise) => {
  try {
    const response = await authenticatedFetch('/api/v1/series_pr_exercise', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Error al crear serie de PR:', error);
    throw error;
  }
};

export const getSeriesPRExerciseByHistory = async (historyId: number) => {
  try {
    const response = await authenticatedFetch(`/api/v1/series_pr_exercise?history_pr_exercise_id=${historyId}`);
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener series de PR para historial ${historyId}:`, error);
    throw error;
  }
};

export const getSeriesPRExerciseById = async (id: number) => {
  try {
    const response = await authenticatedFetch(`/api/v1/series_pr_exercise/${id}`);
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener serie de PR con ID ${id}:`, error);
    throw error;
  }
};

export const updateSeriesPRExercise = async (id: number, data: Partial<SeriesPRExercise>) => {
  try {
    const response = await authenticatedFetch(`/api/v1/series_pr_exercise/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error(`Error al actualizar serie de PR con ID ${id}:`, error);
    throw error;
  }
};

export const deleteSeriesPRExercise = async (id: number) => {
  try {
    const response = await authenticatedFetch(`/api/v1/series_pr_exercise/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  } catch (error) {
    console.error(`Error al eliminar serie de PR con ID ${id}:`, error);
    throw error;
  }
};

// Dropset PR Exercise endpoints
export const createDropsetPRExercise = async (data: DropsetPRExercise) => {
  try {
    const response = await authenticatedFetch('/api/v1/dropset_pr_exercise', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Error al crear dropset de PR:', error);
    throw error;
  }
};

export const getDropsetPRExerciseBySeries = async (seriesId: number) => {
  try {
    const response = await authenticatedFetch(`/api/v1/dropset_pr_exercise?serie_pr_exercise_id=${seriesId}`);
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener dropsets de PR para serie ${seriesId}:`, error);
    throw error;
  }
};

export const getDropsetPRExerciseById = async (id: number) => {
  try {
    const response = await authenticatedFetch(`/api/v1/dropset_pr_exercise/${id}`);
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener dropset de PR con ID ${id}:`, error);
    throw error;
  }
};

export const updateDropsetPRExercise = async (id: number, data: Partial<DropsetPRExercise>) => {
  try {
    const response = await authenticatedFetch(`/api/v1/dropset_pr_exercise/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error(`Error al actualizar dropset de PR con ID ${id}:`, error);
    throw error;
  }
};

export const deleteDropsetPRExercise = async (id: number) => {
  try {
    const response = await authenticatedFetch(`/api/v1/dropset_pr_exercise/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  } catch (error) {
    console.error(`Error al eliminar dropset de PR con ID ${id}:`, error);
    throw error;
  }
};