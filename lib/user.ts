import { ProfileDAO } from '../interfaces/user';
import { authenticatedFetch } from './utils';

export const postProfile = async (data: ProfileDAO) => {
  return authenticatedFetch('/profile', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export const getAllProfiles = async () => {
  return authenticatedFetch('/profile').then(res => res.json());
}

export const deleteProfile = async (id: number) => {
  return authenticatedFetch(`/profile/${id}`, {
    method: 'DELETE'
  }).then(res => res.json());
}

export const updateProfile = async (id: number, data: ProfileDAO) => {
  return authenticatedFetch(`/profile/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export const getProfileByEmail = async (email: string) => {
  return authenticatedFetch(`/profile/${encodeURIComponent(email)}`).then(res => res.json());
}

export const getProfileById = async (id: number) => {
  return authenticatedFetch(`/profile/id/${id}`).then(res => res.json());
}

export const getUserDataByEmail = async (email: string) => {
  return authenticatedFetch(`/user/${email}`).then(res => res.json());
}

export const getAllUsers = async () => {
  try {
    const response = await authenticatedFetch('/user');
    const data = await response.json();
    
    if (!data) {
      throw new Error('No se recibieron datos de usuarios');
    }
    
    return { data: Array.isArray(data) ? data : [data] };
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
}

export const updateUserRole = async (email: string, role_id: number, final_date: string) => {
  try {
    const response = await authenticatedFetch(`/user/role/${email}?role_id=${role_id}&final_date=${final_date}`, {
      method: 'PUT'
    });
    
    if (!response.ok) {
      throw new Error('Error al actualizar el rol del usuario');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al actualizar rol:', error);
    throw error;
  }
}

export const changePassword = async (data: { current_password: string; new_password: string }) => {
  return authenticatedFetch('/change_password', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export const updateUserData = async (email: string, data: {
  id_number: string;
  user_name: string;
  name: string;
  phone: string;
  address: string;
  birth_date: string;
  gender: string;
}) => {
  return authenticatedFetch(`/user/${encodeURIComponent(email)}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }).then(res => res.json());
} 