import { View, Text } from 'react-native'
import { Link } from 'expo-router'
import React from 'react'

const Index = () => {
  return (
    <View>
      <Text className='text-4xl text-red-600'>Index</Text>
      <Link href='/login' >
        <Text className='bg-slate-200 text-3xl p-5 rounded-lg'>
            Autenticacion
        </Text>
      </Link>
      <Link href='/profile' >
        <Text className='rounded p-4 bg-slate-200 text-3xl'>
            Login
        </Text>
      </Link>
      <Link href='/recomendations' >
        <Text className='rounded p-4 bg-slate-200 text-3xl'>
            recomendaciones
        </Text>
      </Link>
    </View>
  )
}

export default Index