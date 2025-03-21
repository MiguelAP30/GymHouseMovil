import React, { useEffect, createContext } from 'react'
import NetInfo from '@react-native-community/netinfo'
import { Stack } from 'expo-router'
import "../global.css"
import { AuthProvider } from '../context/AuthStore';

export const ConnectivityContext = createContext<{
  isConnected: boolean | null;
}>({
  isConnected: null,
});

const HomeLayout = () => {
  const [isConnected, setIsConnected] = React.useState<boolean | null>(null)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected)
    })
    return () => {
      unsubscribe();
    }
  }, [])

  return (
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