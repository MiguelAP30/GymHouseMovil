import { authenticatedFetch } from "./utils";

export const getMachines = async () => {
    try {
      const response = await authenticatedFetch('/machine');
      return await response.json();
    } catch (error) {
      console.error('Error al obtener máquinas:', error);
      throw error;
    }
  }
  
  export const createMachine = async (data: { name: string, description: string }) => {
    try {
      const response = await authenticatedFetch('/machine', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error('Error al crear máquina:', error);
      throw error;
    }
  }
  
  export const updateMachine = async (id: number, data: { name: string, description: string }) => {
    try {
      const response = await authenticatedFetch(`/machine/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error('Error al actualizar máquina:', error);
      throw error;
    }
  }
  
  export const deleteMachine = async (id: number) => {
    try {
      const response = await authenticatedFetch(`/machine/${id}`, {
        method: 'DELETE'
      });
      return await response.json();
    } catch (error) {
      console.error('Error al eliminar máquina:', error);
      throw error;
    }
  }