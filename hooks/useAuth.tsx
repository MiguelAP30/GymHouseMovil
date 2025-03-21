import { useEffect, useContext } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthStore';

export const useAuth = () => {
  const router = useRouter();
  const { logout } = useContext(AuthContext);

  const verifyToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('http://192.168.153.228:8000/api/v1/user_data', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      });

      if (!response.ok) {
        throw new Error('Token inválido o expirado');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error verificando token:', error);
      await logout();
      router.replace('/');
      return null;
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  return { verifyToken };
};

// HOC para proteger rutas
export const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  return function WithAuthComponent(props: any) {
    useAuth();
    return <WrappedComponent {...props} />;
  };
}; 