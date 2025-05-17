export interface NotificationTokenDAO {
    token: string;
    is_active: boolean;
}

export interface SendNotificationDAO {
    title: string;
    message: string;
    token: string;
} 