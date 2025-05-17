import { GymDAO } from '../interfaces/gym';
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

export const getUserGym = async () => {
  return authenticatedFetch('/gym/user').then(res => res.json());
}

export const updateUserGym = async (data: GymDAO) => {
  return authenticatedFetch('/gym/user', {
    method: 'PUT',
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export const deleteUserGym = async () => {
  return authenticatedFetch('/gym/user', {
    method: 'DELETE'
  }).then(res => res.json());
} 