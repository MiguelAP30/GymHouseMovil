import React, { useEffect, createContext, useState } from 'react'
import NetInfo from '@react-native-community/netinfo'
import { Stack } from 'expo-router'
import "../global.css"
import { AuthProvider } from '../context/AuthStore';
import { usePushNotifications } from '../hooks/usePushNotifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from 'react-native-onboarding-swiper';
import { View, ActivityIndicator, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

//import { Suspense } from 'react';
//import { SQLiteProvider, openDatabaseSync, } from 'expo-sqlite';
//import { drizzle } from 'drizzle-orm/expo-sqlite';
//import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
//import migrations  from '../drizzle/migrations';
//import { addDummyData } from '../db/addDummyData';


//export const DATABASE_NAME = 'gymhouse.db'

export const ConnectivityContext = createContext<{
  isConnected: boolean | null;
}>({
  isConnected: null,
});

const HomeLayout = () => {
  //const expoDB = openDatabaseSync(DATABASE_NAME)
  //const db = drizzle(expoDB)
  //const { success, error } = useMigrations(db, migrations)

  const [isConnected, setIsConnected] = React.useState<boolean | null>(null)
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null)
  const { expoPushToken, notification} = usePushNotifications()
/*
  useEffect(() =>{
    if (success) {
      addDummyData(db)
    }
  },[])
*/
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
    console.log('expoPushToken', expoPushToken);
    console.log('notification', notification)
    
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
  //<Suspense>
    //<SQLiteProvider 
      //databaseName={DATABASE_NAME}
      //options={{enableChangeListener:true}}
      //useSuspense
    //>
    <SafeAreaProvider>
      
      <AuthProvider>
        <ConnectivityContext.Provider value={{ isConnected }}>
          <StatusBar style="light"/>
          <Stack>
            <Stack.Screen name="index" options={{headerShown:false}}/>
            <Stack.Screen name="account" options={{headerShown:false}}/>
            <Stack.Screen name="register" options={{headerShown:false}}/>
            <Stack.Screen name="unauthorized" options={{headerShown:false}}/>
          </Stack>
        </ConnectivityContext.Provider>
      </AuthProvider>

    </SafeAreaProvider>
    //</SQLiteProvider>
  //</Suspense>
  )
}

export default HomeLayout