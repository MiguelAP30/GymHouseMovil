export interface StandardResponseDAO {
    status: number
    message: string
}

export interface AuthResponseDAO extends StandardResponseDAO {
    access_token: string;
    user: UserDAO;
}

export interface UserDAO {
    email: string;
    id_number: string;
    user_name: string;
    name: string;
    phone: string;
    birth_date: number;
    gender: string;
    address: string;
    password: string;
    status: boolean;
    start_date: string | null;
    final_date: string | null;
    role_id: number;
    is_verified?: boolean;
    verification_code?: string | null;
}

export interface GymDAO {
    id?: number;
    user_email: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    open_time: string;
    close_time: string;
    price: number;
    description: string;
    image: string;
    city: string;
    country: string;
    start_date: Date;
    final_date: Date;
    is_active: boolean;
}

export interface NotificationTokenDAO{
    token:string;
    is_active: boolean;
}


export interface SendNotificationDAO{
    title: string;
    message: string;
    token:string
}

export interface ProfileDAO {
    user_email: string;
    weight: number;
    height: number;
    physical_activity: number;
    date: string;
}

export interface LoginDAO {
    email: string;
    password: string;
}

export interface RegisterDAO {
    email: string;
    id_number: string;
    password: string;
    user_name: string;
    name: string;
    phone: string;
    address: string;
    birth_date: string;
    gender: string;
    status?: boolean;
}



export const ROLES = {
    admin: 4,
    gym: 3,
    premium: 2,
    logued: 1
} as const;


export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

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

export interface VerifyEmailDAO {
    email: string;
    verification_code: string;
}

export interface ResendVerificationDAO {
    email: string;
}

export interface ResetPasswordDAO {
    email: string;
    new_password: string;
    reset_code: string;
}

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

export interface ExerciseConfigurationDAO {
    id?: number;
    exercise_id: number;
    repsHigh: number;
    repsLow?: number;
    notes?:string;
    rest: number;
    sets: number;
    workout_day_exercise_id: number;

}