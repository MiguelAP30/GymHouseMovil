export interface TrainingPlanDAO {
    id?: number;
    name: string;
    description: string;
    is_visible: boolean;
    tag_of_training_plan_id: number;
    user_email?: string;
    is_gym_created?: boolean;
    user_gym_id?: number;
    created_at?: string;
    updated_at?: string;
}

export interface TagOfTrainingPlanDAO {
    id?: number;
    name: string;
    description?: string;
}

export interface WorkoutDayExerciseDAO {
    id?: number;
    week_day_id: number;
    training_plan_id: number;
    exercise_configurations?: number[];
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    size: number;
    pages: number;
} 