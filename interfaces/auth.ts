import { UserDAO } from "./user";

export interface StandardResponseDAO {
    status: number
    message: string
}

export interface AuthResponseDAO extends StandardResponseDAO {
    access_token: string;
    user: UserDAO;
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