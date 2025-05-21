import { 
    ExerciseMuscleDAO, 
    AssignMusclesRequest, 
    ExerciseMuscleResponse 
} from '../interfaces/exercise_muscle';
import { authenticatedFetch } from './utils';

// Obtener todas las relaciones ejercicio-músculo
export const getExerciseMuscles = async () => {
    try {
        const response = await authenticatedFetch('/exercise_muscle');
        return await response.json();
    } catch (error) {
        console.error('Error al obtener relaciones ejercicio-músculo:', error);
        throw error;
    }
};

// Obtener relación ejercicio-músculo por ID
export const getExerciseMuscleById = async (id: number) => {
    try {
        const response = await authenticatedFetch(`/exercise_muscle/${id}`);
        return await response.json();
    } catch (error) {
        console.error(`Error al obtener relación ejercicio-músculo con ID ${id}:`, error);
        throw error;
    }
};

// Crear nueva relación ejercicio-músculo
export const createExerciseMuscle = async (data: ExerciseMuscleDAO) => {
    try {
        const response = await authenticatedFetch('/exercise_muscle', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Error al crear relación ejercicio-músculo:', error);
        throw error;
    }
};

// Actualizar relación ejercicio-músculo
export const updateExerciseMuscle = async (id: number, data: ExerciseMuscleDAO) => {
    try {
        const response = await authenticatedFetch(`/exercise_muscle/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error(`Error al actualizar relación ejercicio-músculo con ID ${id}:`, error);
        throw error;
    }
};

// Eliminar relación ejercicio-músculo
export const deleteExerciseMuscle = async (id: number) => {
    try {
        const response = await authenticatedFetch(`/exercise_muscle/${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    } catch (error) {
        console.error(`Error al eliminar relación ejercicio-músculo con ID ${id}:`, error);
        throw error;
    }
};

// Obtener relaciones por máquina
export const getExerciseMusclesByMachine = async (machineId: number) => {
    try {
        const response = await authenticatedFetch(`/exercise_muscle/machine/${machineId}`);
        return await response.json();
    } catch (error) {
        console.error(`Error al obtener relaciones ejercicio-músculo para máquina ${machineId}:`, error);
        throw error;
    }
};

// Obtener relaciones por músculo específico
export const getExerciseMusclesBySpecificMuscle = async (specificMuscleId: number) => {
    try {
        const response = await authenticatedFetch(`/exercise_muscle/specific-muscle/${specificMuscleId}`);
        return await response.json();
    } catch (error) {
        console.error(`Error al obtener relaciones ejercicio-músculo para músculo específico ${specificMuscleId}:`, error);
        throw error;
    }
};

// Obtener relaciones por músculo
export const getExerciseMusclesByMuscle = async (muscleId: number) => {
    try {
        const response = await authenticatedFetch(`/exercise_muscle/muscle/${muscleId}`);
        return await response.json();
    } catch (error) {
        console.error(`Error al obtener relaciones ejercicio-músculo para músculo ${muscleId}:`, error);
        throw error;
    }
};

// Asignar múltiples músculos a un ejercicio
export const assignMusclesToExercise = async (data: AssignMusclesRequest) => {
    try {
        const response = await authenticatedFetch('/exercise_muscle/assign-muscles', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Error al asignar músculos al ejercicio:', error);
        throw error;
    }
};

// Obtener músculos de un ejercicio específico
export const getExerciseMusclesByExercise = async (exerciseId: number) => {
    try {
        const response = await authenticatedFetch(`/exercise_muscle/exercise/${exerciseId}/muscles`);
        return await response.json();
    } catch (error) {
        console.error(`Error al obtener músculos para ejercicio ${exerciseId}:`, error);
        throw error;
    }
};

// Actualizar la tasa de una relación ejercicio-músculo
export const updateExerciseMuscleRate = async (id: number, rate: number) => {
    try {
        const response = await authenticatedFetch(`/exercise_muscle/${id}/rate`, {
            method: 'PATCH',
            body: JSON.stringify(rate)
        });
        return await response.json();
    } catch (error) {
        console.error(`Error al actualizar tasa de relación ejercicio-músculo ${id}:`, error);
        throw error;
    }
}; 