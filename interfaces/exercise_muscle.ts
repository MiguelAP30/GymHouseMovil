export interface ExerciseMuscleDAO {
    id?: number;
    exercise_id: number;
    rate: number;
    specific_muscle_id: number;
}

export interface MuscleAssignment {
    rate: number;
    specific_muscle_id: number;
}

export interface AssignMusclesRequest {
    exercise_id: number;
    muscle_assignments: MuscleAssignment[];
}

export interface ExerciseMuscleResponse {
    id: number;
    exercise_id: number;
    rate: number;
    specific_muscle_id: number;
    exercise?: {
        id: number;
        name: string;
        description: string;
    };
    specific_muscle?: {
        id: number;
        name: string;
        description: string;
        muscle_id: number;
    };
} 