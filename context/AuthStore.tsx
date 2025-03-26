import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponseDAO, ProfileDAO, UserDAO } from '../interfaces/interfaces';
import { getEnvironment } from '../config/env';

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
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  role: null,
  profile: null,
  login: async () => {},
  logout: async () => {},
  fetchUserData: async () => {}
});

interface AuthProviderProps {
  children: ReactNode;
}

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
      
      const profileData = await getProfileByEmail(data.data["sub"], currentToken);

      console.log("profileData ",profileData);

      //Usuario de migue      
      const userData: UserDAO = {
        ...user!,
        role_id: data.data["user.role"],
        name: data.data["user.name"],
        email: data.data["sub"], 
        id_number: user?.id_number || "",
        user_name: user?.user_name || "",
        phone: user?.phone || "",
        birth_date: user?.birth_date || 0,
        gender: user?.gender || "",
        address: user?.address || "",
        password: user?.password || "",
        status: user?.status || false,
        start_date: user?.start_date || null,
        final_date: user?.final_date || null
      };

      //usuario andres
      const profileUser: UserDAO = {
        ...profile!,
        role_id: profileData["role"],
        name: profileData["name"],
        email: profileData["email"], 
        id_number: profileData["id_number"],
        user_name: profileData["user_name"],
        phone: profileData["phone"],
        birth_date: profileData["birth_date"],
        gender: profileData["gender"] == 'm' ? 'Masculino' : 'Femenino',
        address: profileData["address"],
        password: profileData["password"],
        status: profileData["status"],
        start_date: profileData["start_date"],
        final_date: profileData["final_date"]
      };

      
      setUser(userData);
      setProfile(profileUser);
      setRole(data.data["user.role"]);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error fetching user data:', error);
      await logout();
    }
  };

  const login = async (token: string, userData: UserDAO) => {
    try {

      
      // Primero establecemos el token ya que es necesario para fetchUserData
      await AsyncStorage.setItem('token', token);
      console.log("token ", token);
      setToken(token);

      // Obtenemos los datos actualizados del usuario
      await fetchUserData();

      // Guardamos los datos del usuario después de obtener la info actualizada
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      
      setRole(userData.role_id);
      setIsAuthenticated(true);

    } catch (error) {
      // En caso de error, limpiamos todo
      //await AsyncStorage.removeItem('token');
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

  
  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      token, 
      role,
      profile,
      login, 
      logout,
      fetchUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

