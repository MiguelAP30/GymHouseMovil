import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { router } from 'expo-router';
import { db } from '../db';
import { exercises, difficulties, machines } from '../db/schema';
import { eq } from 'drizzle-orm';
import { ExerciseDAO, DifficultyDAO } from '../interfaces/exercise';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Machine {
    id: number;
    name: string;
    description: string;
}

export default function ExercisesWithoutInternet() {
    const netInfo = useNetInfo();
    const [loading, setLoading] = useState(true);
    const [exercisesList, setExercisesList] = useState<ExerciseDAO[]>([]);
    const [difficultiesList, setDifficultiesList] = useState<DifficultyDAO[]>([]);
    const [machinesList, setMachinesList] = useState<Machine[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        console.log('Cargando datos de la base de datos local...');
        try {
            const [exercisesData, difficultiesData, machinesData] = await Promise.all([
                db.select().from(exercises),
                db.select().from(difficulties),
                db.select().from(machines)
            ]);

            console.log('Datos cargados:', {
                exercises: exercisesData.length,
                difficulties: difficultiesData.length,
                machines: machinesData.length
            });

            setExercisesList(exercisesData);
            setDifficultiesList(difficultiesData);
            setMachinesList(machinesData);
        } catch (error) {
            console.error('Error al cargar datos:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#1F2937' }}>

        
        <View className="flex-1 p-5 bg-gray-100">
            <View className="flex-row justify-between items-center mb-5">
                <Text className="text-2xl font-bold text-black">Ejercicios (Modo Offline)</Text>
                {netInfo.isConnected && (
                    <TouchableOpacity 
                        className="bg-blue-500 px-4 py-2 rounded-lg"
                        onPress={() => router.push('/')}
                    >
                        <Text className="text-white font-bold">Ver en línea</Text>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView className="flex-1">
                {exercisesList.map(exercise => (
                    <View 
                        key={exercise.id} 
                        className="bg-white p-4 rounded-lg mb-2.5 shadow-md"
                    >
                        <Text className="text-lg font-bold">{exercise.name}</Text>
                        <Text className="text-gray-600">{exercise.description}</Text>
                        <Text className="text-blue-500 mt-1">
                            Dificultad: {difficultiesList.find(d => d.id === exercise.dificulty_id)?.name || 'No especificada'}
                        </Text>
                        <Text className="text-blue-500">
                            Máquina: {machinesList.find(m => m.id === exercise.machine_id)?.name || 'No especificada'}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </View>
        </SafeAreaView>
    );
}
