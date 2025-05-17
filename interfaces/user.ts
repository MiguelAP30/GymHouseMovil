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
    user_email: string;
    weight: number;
    height: number;
    physical_activity: number;
    date: string;
}

export const ROLES = {
    admin: 4,
    gym: 3,
    premium: 2,
    logued: 1
} as const; 