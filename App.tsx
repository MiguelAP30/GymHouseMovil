import { useEffect } from 'react';
import { registerForPushNotificationsAsync, setupNotificationHandlers } from './lib/notificationSetup';
// ... existing imports ...

export default function App() {
  useEffect(() => {
    // Configurar los manejadores de notificaciones
    setupNotificationHandlers();

    // Registrar el token de notificaciones
    registerForPushNotificationsAsync();
  }, []);

  // ... rest of your App component code ...
} 