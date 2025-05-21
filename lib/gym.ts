import { GymDAO, UserGymDAO } from '../interfaces/gym';
import { TrainingPlanDAO } from '../interfaces/training';
import { authenticatedFetch } from './utils';

export const postGym = async (data: GymDAO) => {
  return authenticatedFetch('/gym', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export const getGym = async () => {
  return authenticatedFetch('/gym').then(res => res.json());
}

export const getGymByUser = async () => {
  return authenticatedFetch('/gym/by_user').then(res => res.json());
}

export const updateUserGym = async (data: GymDAO) => {
  return authenticatedFetch('/gym/by_user', {
    method: 'PUT',
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export const deleteGymByUser = async () => {
  return authenticatedFetch('/gym/by_user', {
    method: 'DELETE'
  }).then(res => res.json());
}

// User Gym Management
export const getGymUsers = async () => {
  return authenticatedFetch('/user_gym').then(res => res.json());
}

export const getUserGymById = async (id: number) => {
  return authenticatedFetch(`/user_gym/${id}`).then(res => res.json());
}

export const createUserGym = async (data: Omit<UserGymDAO, 'id'>) => {
  return authenticatedFetch('/user_gym', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export const updateUserGymById = async (id: number, data: Partial<UserGymDAO>) => {
  return authenticatedFetch(`/user_gym/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export const deleteUserGymById = async (gymId: number, userEmail: string) => {
  return authenticatedFetch(`/user_gym/gym/${gymId}/user/${encodeURIComponent(userEmail)}`, {
    method: 'DELETE'
  }).then(res => res.json());
}

// Training Plan Management for Gym
export const createGymTrainingPlan = async (data: Omit<TrainingPlanDAO, 'id'>) => {
  return authenticatedFetch('/training_plan/gym', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then(res => res.json());
}