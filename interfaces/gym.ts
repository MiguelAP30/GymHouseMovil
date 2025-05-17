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