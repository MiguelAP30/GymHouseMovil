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
    current_users: number;
    max_users: number;
}

export interface UserGymDAO {
    id?: number;
    user_email: string;
    gym_id: number;
    start_date: Date;
    final_date: Date;
    is_active: boolean;
    is_premium: boolean;
    permissions?: {
        can_edit: boolean;
        can_delete: boolean;
    };
}
