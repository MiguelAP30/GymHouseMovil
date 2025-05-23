import { exercises, difficulties, machines } from "./schema";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getExercises, getDifficulties } from '../lib/exercise';
import { getMachines } from '../lib/machine';
import * as schema from './schema';

export const syncData = async (db: ExpoSQLiteDatabase<typeof schema>) => {
    console.log('Iniciando sincronización de datos...');
    try {
        // Obtener datos del backend
        console.log('Obteniendo datos del backend...');
        const [exercisesData, difficultiesData, machinesData] = await Promise.all([
            getExercises(1, 100),
            getDifficulties(),
            getMachines()
        ]);

        console.log('Datos obtenidos del backend:', {
            exercises: exercisesData?.items?.length || 0,
            difficulties: difficultiesData?.length || 0,
            machines: machinesData?.length || 0
        });

        if (!exercisesData?.items || !difficultiesData || !machinesData) {
            throw new Error('Datos incompletos del backend');
        }

        // Limpiar tablas existentes
        console.log('Limpiando tablas existentes...');
        await db.delete(exercises);
        await db.delete(difficulties);
        await db.delete(machines);

        // Insertar dificultades
        console.log('Insertando dificultades...');
        await db.insert(difficulties).values(
            difficultiesData.map((d:any) => ({
                id: d.id,
                name: d.name
            }))
        );

        // Insertar máquinas
        console.log('Insertando máquinas...');
        await db.insert(machines).values(
            machinesData.map((m:any) => ({
                id: m.id,
                name: m.name,
                description: m.description
            }))
        );

        // Insertar ejercicios
        console.log('Insertando ejercicios...');
        await db.insert(exercises).values(
            exercisesData.items.map((e:any) => ({
                id: e.id,
                name: e.name,
                description: e.description,
                dateAdded: e.dateAdded,
                dificulty_id: e.dificulty_id,
                image: e.image,
                machine_id: e.machine_id,
                video: e.video
            }))
        );

        // Marcar como sincronizado
        await AsyncStorage.setItem('dbInitialized', 'true');
        console.log('Sincronización completada exitosamente');
    } catch (error) {
        console.error('Error durante la sincronización:', error);
        throw error;
    }
};

export const addDummyData = async (db: ExpoSQLiteDatabase<typeof schema>) => {
    const value = await AsyncStorage.getItem('dbInitialized');
    if (value) {
        console.log('La base de datos ya está inicializada');
        return;
    }

    console.log('Inicializando base de datos con datos de prueba...');
    try {
        await syncData(db);
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
        throw error;
    }
};
