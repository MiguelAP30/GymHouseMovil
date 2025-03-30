import React, { useEffect, createContext } from 'react'
import NetInfo from '@react-native-community/netinfo'
import { Stack } from 'expo-router'
import "../global.css"
import { AuthProvider } from '../context/AuthStore';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { Text } from 'react-native';

export const ConnectivityContext = createContext<{
  isConnected: boolean | null;
}>({
  isConnected: null,
});

const HomeLayout = () => {
  const [isConnected, setIsConnected] = React.useState<boolean | null>(null)
  const { expoPushToken, notification } = usePushNotifications()

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