import React from 'react';
import { View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fondoTotal } from '../../../components/tokens';

const About = () => {
    return (
        <SafeAreaView className={`${fondoTotal} flex-1`} edges={['bottom']}>
            <View className="flex-1 p-6">
                <Image 
                    source={require('../../../assets/logo.png')} 
                    className="w-32 h-32 mb-6 self-center" 
                />
                <Text className="text-white text-xl font-bold mb-4 text-center">
                    Sobre GymHouse
                </Text>
                <Text className="text-white text-base text-center">
                    GymHouse es una aplicación móvil diseñada para ayudarte a alcanzar tus objetivos fitness de manera personalizada y efectiva.
                </Text>
            </View>
        </SafeAreaView>
    );
}

export default About;