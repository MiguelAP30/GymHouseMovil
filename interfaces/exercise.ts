import { Permissions } from './training';

export interface ExerciseDAO {
    id?: number;
    name: string;
    description: string;
    dateAdded: string;
    dificulty_id: number;
    image: string;
    machine_id: number;
    video: string;
}

export interface DifficultyDAO {
    id?: number;
    name: string;
}

export interface MuscleDAO {
    id?: number;
    name: string;
    description: string;
}

export interface SpecificMuscleDAO {
    id?: number;
    name: string;
    description: string;
    muscle_id: number;
}

export interface WeekDayDAO {
    id?: number;
    name: string;
}

export interface ExerciseConfigurationDAO {
    id?: number;
    exercise_id: number;
    repsHigh: number;
    repsLow?: number;
    notes?: string;
    rest: number;
    sets: number;
    workout_day_exercise_id: number;
    permissions?: Permissions;
} 