import { useContext, useEffect, useState } from 'react';
import { router, useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { syncData } from '../db/addDummyData';
import { db } from '../db';
import { LoginForm } from '../components/organisms/LoginForm';
import { ConnectivityContext } from './_layout';
import { AuthContext } from '../context/AuthStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ROLES } from '../interfaces/user';

export default function Index() {

  const { isConnected } = useContext(ConnectivityContext);
  const { checkAuth, role } = useContext(AuthContext);
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Iniciando sincronización de datos...');
        await syncData(db);
      } catch (error) {
        console.log("Error ", error)
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const isValid = await checkAuth();
          if (isValid) {
            router.replace('/account/exercises');
            return; // Importante: salimos de la función si el token es válido
          } else {
            await AsyncStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Error checking token:', error);
        await AsyncStorage.removeItem('token');
      } finally {
        setIsChecking(false);
      }
    };

    checkToken();
  }, [checkAuth, role]);

    // Mostrar un indicador de carga mientras verificamos el token
    if (isChecking) {
      return (
        <View className="flex-1 justify-center items-center bg-gray-900">
          <ActivityIndicator size="large" color="#6200ea" />
        </View>
      );
    }
    
  return (
     <LoginForm isConnected={isConnected ?? false} />
     
  );
}

