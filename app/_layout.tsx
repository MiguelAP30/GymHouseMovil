import React, { useEffect } from 'react'
import NetInfo from '@react-native-community/netinfo'
import { Stack } from 'expo-router'
import "../global.css"
import { NetworkProvider } from '../contexts/NetworkProvider'



const HomeLayout = () => {
  const [isConnected, setIsConnected] = React.useState(false)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected as boolean)
    })
    return () => {
      unsubscribe();
    }
  }, [])

  return (
    <NetworkProvider>
    <Stack>
      <Stack.Screen name="index" options={{headerShown:false}}/>
      <Stack.Screen name="profile" options={{headerShown:false}}/>
      <Stack.Screen name="(auth)" options={{headerShown:false}}/>
      <Stack.Screen name="(account)" options={{headerShown:false}}/>
      
    </Stack>
    </NetworkProvider>
  )
}

export default HomeLayout