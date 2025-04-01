import React, { useEffect, createContext, useState } from 'react'
import NetInfo from '@react-native-community/netinfo'
import { Stack } from 'expo-router'
import "../global.css"
import { AuthProvider } from '../context/AuthStore';
import { usePushNotifications } from '../hooks/usePushNotifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from 'react-native-onboarding-swiper';
import { View, ActivityIndicator, Text } from 'react-native';

export const ConnectivityContext = createContext<{
  isConnected: boolean | null;
}>({
  isConnected: null,
});

const HomeLayout = () => {
  const [isConnected, setIsConnected] = React.useState<boolean | null>(null)
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null)
  const { expoPushToken, notification } = usePushNotifications()

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const value = await AsyncStorage.getItem('alreadyLaunched');
        if (value === null) {
          await AsyncStorage.setItem('alreadyLaunched', 'true');
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error('Error checking first launch:', error);
        setIsFirstLaunch(false);
      }
    };

    checkFirstLaunch();
  }, []);

  useEffect(() => {
    console.log('expoPushToken', expoPushToken)
    console.log("notificacion", notification)
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected)
    })
    return () => {
      unsubscribe();
    }
  }, [])

  if (isFirstLaunch === null) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (isFirstLaunch) {
    return (
      <Onboarding
        pages={[
          {
            backgroundColor: '#fdeb93',
            image: <Text className="text-6xl">💪</Text>,
            title: 'Bienvenido a GymHouse',
            subtitle: 'Tu compañero personal para alcanzar tus objetivos fitness',
          },
          {
            backgroundColor: '#e6f4fa',
            image: <Text className="text-6xl">🎯</Text>,
            title: 'Rutinas Personalizadas',
            subtitle: 'Accede a rutinas adaptadas a tu nivel y objetivos',
          },
          {
            backgroundColor: '#d4edda',
            image: <Text className="text-6xl">📊</Text>,
            title: 'Seguimiento de Progreso',
            subtitle: 'Monitorea tu evolución y alcanza tus metas',
          },
        ]}
        onDone={() => setIsFirstLaunch(false)}
        onSkip={() => setIsFirstLaunch(false)}
        showSkip={true}
        showNext={true}
        showDone={true}
        containerStyles={{
          paddingHorizontal: 20,
        }}
        titleStyles={{
          fontSize: 24,
          fontWeight: 'bold',
        }}
        subTitleStyles={{
          fontSize: 16,
        }}
      />
    );
  }

  return (
    //<Text selectable={true}>{expoPushToken?.data}</Text>
    <AuthProvider>
      <ConnectivityContext.Provider value={{ isConnected }}>
        <Stack>
          <Stack.Screen name="index" options={{headerShown:false}}/>
          <Stack.Screen name="account" options={{headerShown:false}}/>
          <Stack.Screen name="register" options={{headerShown:false}}/>
          <Stack.Screen name="unauthorized" options={{headerShown:false}}/>
        </Stack>
      </ConnectivityContext.Provider>
    </AuthProvider>
  )
}

export default HomeLayout