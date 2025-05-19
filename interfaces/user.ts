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

export interface ProfileDAO {
    biceps: number;
    chest: number;
    date: string;
    fat: number;
    height: number;
    hips: number;
    muscle: number;
    notes: string;
    physical_activity: number;
    thigh: number;
    waist: number;
    weight: number;
}

export interface ProfileDTO {
    biceps: number;
    chest: number;
    date: string;
    fat: number;
    height: number;
    hips: number;
    muscle: number;
    notes: string;
    email: string;
    physical_activity: number;
    thigh: number;
    waist: number;
    weight: number;
}

export interface ProfileWithId extends ProfileDAO {
    id: number;
}
  

export const ROLES = {
    admin: 4,
    gym: 3,
    premium: 2,
    logued: 1
} as const; 