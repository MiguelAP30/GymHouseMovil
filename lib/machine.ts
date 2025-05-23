import { getEnvironment } from '../config/env';
import { authenticatedFetch } from './utils';
import { Alert } from 'react-native';

const API = getEnvironment().API_URL;

export const getMachines = async () => {
    try {
      const response = await fetch(`${API}/machine`);
      return await response.json();
    } catch (error) {
      console.error('Error al obtener máquinas:', error);
      Alert.alert('Error', 'No se pudieron obtener las máquinas');
      throw error;
    }
}

export const createMachine = async (data: { name: string, description: string }) => {
  try {
    const response = await authenticatedFetch('/machine', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const result = await response.json();
    Alert.alert('Éxito', 'Máquina creada correctamente');
    return result;
  } catch (error) {
    console.error('Error al crear máquina:', error);
    Alert.alert('Error', 'No se pudo crear la máquina');
    throw error;
  }
}

export const updateMachine = async (id: number, data: { name: string, description: string }) => {
  try {
    const response = await authenticatedFetch(`/machine/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    const result = await response.json();
    Alert.alert('Éxito', 'Máquina actualizada correctamente');
    return result;
  } catch (error) {
    console.error('Error al actualizar máquina:', error);
    Alert.alert('Error', 'No se pudo actualizar la máquina');
    throw error;
  }
}

export const deleteMachine = async (id: number) => {
  try {
    const response = await authenticatedFetch(`/machine/${id}`, {
      method: 'DELETE'
    });
    const result = await response.json();
    Alert.alert('Éxito', 'Máquina eliminada correctamente');
    return result;
  } catch (error) {
    console.error('Error al eliminar máquina:', error);
    Alert.alert('Error', 'No se pudo eliminar la máquina');
    throw error;
  }
}