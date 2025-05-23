import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FormInput } from '../FormInput';

/**
 * Suite de pruebas para el componente FormInput
 * 
 * Este componente es un campo de entrada de texto reutilizable que incluye:
 * - Etiqueta opcional
 * - Mensaje de error opcional
 * - Estilos condicionales basados en el estado de error
 * - Manejo de eventos de cambio de texto
 */
describe('FormInput', () => {
  /**
   * Prueba el renderizado del componente cuando se proporciona una etiqueta
   * Verifica que la etiqueta sea visible en la interfaz
   */
  it('renders correctly with label', () => {
    const { getByText } = render(
      <FormInput label="Test Label" placeholder="Test Placeholder" />
    );
    expect(getByText('Test Label')).toBeTruthy();
  });

  /**
   * Prueba el renderizado del componente cuando no se proporciona una etiqueta
   * Verifica que no se muestre ningún elemento de etiqueta
   */
  it('renders correctly without label', () => {
    const { queryByText } = render(
      <FormInput placeholder="Test Placeholder" />
    );
    expect(queryByText('Test Label')).toBeNull();
  });

  /**
   * Prueba la visualización de mensajes de error
   * Verifica que el mensaje de error sea visible cuando se proporciona
   */
  it('shows error message when error prop is provided', () => {
    const { getByText } = render(
      <FormInput error="Test Error" placeholder="Test Placeholder" />
    );
    expect(getByText('Test Error')).toBeTruthy();
  });

  /**
   * Prueba el manejo de eventos de entrada de texto
   * Verifica que la función onChangeText sea llamada con el valor correcto
   * cuando el usuario ingresa texto
   */
  it('handles text input correctly', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <FormInput 
        placeholder="Test Placeholder" 
        onChangeText={onChangeText}
      />
    );
    
    fireEvent.changeText(getByPlaceholderText('Test Placeholder'), 'test input');
    expect(onChangeText).toHaveBeenCalledWith('test input');
  });

  /**
   * Prueba la aplicación de estilos cuando hay un error
   * Verifica que se aplique la clase de estilo de error (border-red-500)
   * cuando se proporciona un mensaje de error
   */
  it('applies error styles when error is present', () => {
    const { getByPlaceholderText } = render(
      <FormInput 
        error="Test Error" 
        placeholder="Test Placeholder"
      />
    );
    
    const input = getByPlaceholderText('Test Placeholder');
    expect(input.props.className).toContain('border-red-500');
  });

  /**
   * Prueba el renderizado del componente cuando se proporciona una etiqueta diferente
   * Verifica que la etiqueta sea visible en la interfaz
   */
  it('renders with another label', () => {
    const { getByText } = render(<FormInput label="Otro Label" placeholder="Test" />);
    expect(getByText('Otro Label')).toBeTruthy();
  });

  /**
   * Prueba el renderizado del componente cuando no se proporciona una etiqueta y el input existe
   * Verifica que el input exista en la interfaz
   */
  it('renders without label and input exists', () => {
    const { getByPlaceholderText } = render(<FormInput placeholder="TestInput" />);
    expect(getByPlaceholderText('TestInput')).toBeTruthy();
  });
}); 