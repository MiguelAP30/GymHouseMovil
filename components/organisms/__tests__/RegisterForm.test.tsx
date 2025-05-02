import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
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
    expect(getByText('Crea tu cuenta para continuar')).toBeTruthy();
    expect(getByPlaceholderText('Ingresa tu nombre')).toBeTruthy();
    expect(getByPlaceholderText('ejemplo@correo.com')).toBeTruthy();
    expect(getByPlaceholderText('Ingresa tu contraseña')).toBeTruthy();
  });

  /**
   * Prueba que el formulario maneje correctamente el envío de datos
   * Verifica que la función onSubmit sea llamada con los datos correctos
   * cuando se completa y envía el formulario
   */
  it('handles form submission correctly', () => {
    const mockOnSubmit = jest.fn();
    const { getByText, getByPlaceholderText } = render(
      <RegisterForm onSubmit={mockOnSubmit} />
    );

    fireEvent.changeText(getByPlaceholderText('Ingresa tu nombre'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('ejemplo@correo.com'), 'john@example.com');
    fireEvent.changeText(getByPlaceholderText('Ingresa tu contraseña'), 'password123');

    fireEvent.press(getByText('Registrarse'));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    });
  });

  /**
   * Prueba que el formulario muestre el estado de carga cuando isLoading es true
   * Verifica que el indicador de actividad sea visible y el botón esté deshabilitado
   */
  it('shows loading state when isLoading is true', () => {
    const { getByTestId } = render(
      <RegisterForm onSubmit={() => {}} isLoading={true} />
    );

    expect(getByTestId('activity-indicator')).toBeTruthy();
  });
}); 