import React from 'react';
import { render } from '@testing-library/react-native';
import { RegisterForm } from '../RegisterForm';

/**
 * Suite de pruebas para el componente RegisterForm
 * Este componente es un formulario de registro que permite a los usuarios
 * ingresar su nombre, correo electrónico y contraseña.
 */
describe('RegisterForm', () => {
  /**
   * Prueba que el formulario se renderice correctamente con todos sus elementos
   * Verifica que el título, subtítulo y todos los campos de entrada sean visibles
   */
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <RegisterForm onSubmit={() => {}} />
    );

    expect(getByText('Registro')).toBeTruthy();
    expect(getByText('Crea tu cuenta para comenzar tu entrenamiento personalizado')).toBeTruthy();
    expect(getByPlaceholderText('Ingresa tu nombre completo')).toBeTruthy();
    expect(getByPlaceholderText('tucorreo@ejemplo.com')).toBeTruthy();
    expect(getByPlaceholderText('********')).toBeTruthy();
  });
}); 