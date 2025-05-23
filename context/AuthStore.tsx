import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponseDAO, ProfileDAO, UserDAO } from '../interfaces/interfaces';
import { getEnvironment } from '../config/env';
import { router } from 'expo-router';
// import { registerNotificationToken } from '../lib/api_gymhouse';
// import * as Notifications from 'expo-notifications'

const API = getEnvironment().API_URL;

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserDAO | null;
  profile: UserDAO | null;
  token: string | null;
  role: number | null;
  login: (token: string, userData: UserDAO) => Promise<void>;
  logout: () => Promise<void>;
  fetchUserData: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  role: null,
  profile: null,
  login: async () => {},
  logout: async () => {},
  fetchUserData: async () => {},
  checkAuth: async () => false
});

interface AuthProviderProps {
  children: ReactNode;
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserDAO | null>(null);
  const [profile, setProfile] = useState<UserDAO | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<number | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');
      
      console.log('Token en checkAuthStatus:', storedToken); // Para debug
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setRole(userData.role_id);
        setIsAuthenticated(true);
        
        // Verificamos que el token sea válido
        const isValid = await checkAuth();
        if (!isValid) {
          await logout();
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      await logout();
    }
  };

  const fetchUserData = async () => {
    try {
      const currentToken = await AsyncStorage.getItem('token');
      if (!currentToken) {
        throw new Error('No hay token de autenticación');
      }

      console.log('Token actual:', currentToken);

      const response = await fetch(`${API}/user_data`, {
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 400) {
          // Si el error es 400, intentamos obtener los datos del token
          const tokenParts = currentToken.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            const userData: UserDAO = {
              email: payload.sub,
              name: payload['user.name'] || '',
              id_number: payload['user.id_number'] || '',
              role_id: payload['user.role'] || 0,
              status: payload['user.status'] || false,
              user_name: payload['user.name'] || '',
              phone: '',
              birth_date: 0,
              gender: '',
              address: '',
              password: '',
              start_date: null,
              final_date: null,
              is_verified: payload['user.is_verified'] === true
            };
            setUser(userData);
            setProfile(userData);
            return;
          }
        }
        throw new Error('Error al obtener datos del usuario');
      }

      const data = await response.json();
      console.log('Respuesta de user_data:', data);
      
      if (!data.data || !data.data["sub"]) {
        console.error('Datos de usuario inválidos:', data);
        throw new Error('Datos de usuario inválidos');
      }

      // Construir el objeto usuario con los datos disponibles
      const userData: UserDAO = {
        email: data.data["sub"] || '',
        name: data.data["user.name"] || '',
        id_number: data.data["user.id_number"] || '',
        role_id: data.data["user.role"] || 0,
        status: data.data["user.status"] || false,
        user_name: data.data["user.name"] || '',
        phone: '',
        birth_date: 0,
        gender: '',
        address: '',
        password: '',
        start_date: null,
        final_date: null,
        is_verified: data.data["user.is_verified"] === true
      };

      setUser(userData);
      setProfile(userData);
    } catch (error) {
      console.error('Error en fetchUserData:', error);
      // No lanzamos el error para evitar que la app se rompa
      // En su lugar, intentamos mantener los datos del token
    }
  };

  const login = async (token: string, userData: UserDAO) => {
    try {
      // Primero establecemos el token
      await AsyncStorage.setItem('token', token);
      setToken(token);

      // Guardamos los datos del usuario
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setRole(userData.role_id);
      setIsAuthenticated(true);

      // Verificamos que el token se haya guardado correctamente
      const storedToken = await AsyncStorage.getItem('token');
      if (!storedToken) {
        throw new Error('Error al guardar el token');
      }

      // Notifications setup - Currently disabled
      // const pushToken = await Notifications.getExpoPushTokenAsync();
      // if(pushToken){
      //   await registerNotificationToken({
      //     token: "ExponentPushToken[FVBhZHK9iQs0N6c-LzeTx_]",
      //     is_active: true
      //   })
      // }

      // Obtenemos los datos actualizados del usuario
      await fetchUserData();

    } catch (error) {
      // En caso de error, limpiamos todo
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setProfile(null);
      setRole(null);
      setIsAuthenticated(false);
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setRole(null);
      setProfile(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const getProfileByEmail = async (email: string, token: string) => {
    console.log("Entra a getProfileByEmail");
    try {
      
      if (!token) return null;
  
      const response = await fetch(`${API}/user/${email}`, {
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        }
      });
      console.log("response ", response);
      
      if (!response.ok) {
        throw new Error('Error al obtener datos del usuario');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  };

  const checkAuth = async () => {
    try {
      const currentToken = await AsyncStorage.getItem('token');
      console.log('Token en checkAuth:', currentToken); // Para debug

      if (!currentToken) {
        console.log('No hay token, redirigiendo a login...');
        await logout(); // Ensure we clean up any stale data
        router.replace('/');
        return false;
      }

      const response = await fetch(`${API}/user_data`, {
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Respuesta de checkAuth:', response.status); // Para debug

      if (!response.ok) {
        // If we get a 401 or 403, the token is definitely invalid
        if (response.status === 401 || response.status === 403) {
          console.log('Token inválido detectado, eliminando...');
          await logout();
          router.replace('/');
          return false;
        }
        // For other errors, we'll still logout to be safe
        console.log('Error en la respuesta del servidor, eliminando token...');
        await logout();
        router.replace('/');
        return false;
      }

      const data = await response.json();
      console.log('Datos de usuario en checkAuth:', data); // Para debug

      // Solo actualizamos los datos del usuario si la autenticación es exitosa
      // y no estamos en medio de una actualización
      if (!isAuthenticated) {
        await fetchUserData();
      }
      
      return true;
    } catch (error) {
      console.error('Error checking auth:', error);
      // Ensure we clean up on any error
      await logout();
      router.replace('/');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      token, 
      role,
      profile,
      login, 
      logout,
      fetchUserData,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

