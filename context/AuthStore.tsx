import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponseDAO, UserDAO } from '../interfaces/interfaces';
import { getEnvironment } from '../config/env';

const API = getEnvironment().API_URL;

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserDAO | null;
  token: string | null;
  role: number | null;
  login: (token: string, userData: UserDAO) => Promise<void>;
  logout: () => Promise<void>;
  fetchUserData: () => Promise<void>;
  getProfileByEmail: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  role: null,
  login: async () => {},
  logout: async () => {},
  fetchUserData: async () => {},
  getProfileByEmail: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserDAO | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<number | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setRole(userData.role_id);
        setIsAuthenticated(true);
        await fetchUserData();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const currentToken = await AsyncStorage.getItem('token');
      if (!currentToken) return;

      const response = await fetch(`${API}/user_data`, {
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener datos del usuario');
      }

      const data = await response.json();
      
      const profileData = await getProfileByEmail(data.data["sub"]);
      
      const userData: UserDAO = {
        ...user!,
        role_id: profileData["role_id"],
        name: profileData["name"],
        email: profileData["email"], 
        id_number: profileData["id_number"],
        user_name: profileData["user_name"],
        phone: profileData["phone"],
        birth_date: profileData["birth_date"],
        gender: profileData["gender"] == 'm' ? 'Masculino' : 'Femenino',
        address: profileData["address"],
        password: profileData["password"],
        status: user?.status || false,
        start_date: user?.start_date || null,
        final_date: user?.final_date || null
      };
      console.log("profileData ",profileData);
      
      console.log("userData ",userData);
      
      //setUser(userData);
      setRole(data.data["user.role"]);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error fetching user data:', error);
      await logout();
    }
  };

  const login = async (token: string, userData: UserDAO) => {
    try {
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setToken(token);
      setUser(userData);
      setRole(userData.role_id);
      setIsAuthenticated(true);
      await fetchUserData();
    } catch (error) {
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
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      token, 
      role,
      login, 
      logout,
      fetchUserData ,
      getProfileByEmail
    }}>
      {children}
    </AuthContext.Provider>
  );
};

const getProfileByEmail = async (email: string) => {
  try {
    const currentToken = await AsyncStorage.getItem('token');
    if (!currentToken) return null;

    const response = await fetch(`${API}/user/${email}`, {
      headers: {
        'Authorization': `Bearer ${currentToken}`, 
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener datos del usuario');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};
