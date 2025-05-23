import React from 'react';
import { render } from '@testing-library/react-native';
import { LoginForm } from '../LoginForm';

describe('LoginForm', () => {
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <LoginForm onSubmit={() => {}} />
    );

    expect(getByText('Bienvenido a GymHouse')).toBeTruthy();
    expect(getByPlaceholderText('tucorreo@ejemplo.com')).toBeTruthy();
    expect(getByPlaceholderText('********')).toBeTruthy();
  });
}); 