import React, { useEffect } from 'react'
import NetInfo from '@react-native-community/netinfo'
import { Stack } from 'expo-router'
import { StatusBar } from 'react-native';
import "../global.css"



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
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />
      <Stack>
        <Stack.Screen name="index" options={{headerShown:false}}/>
        <Stack.Screen name="(auth)" options={{headerShown:false}}/>
        <Stack.Screen name="(account)" options={{headerShown:false}}/>
      </Stack>
    </>
  )
}

export default HomeLayout