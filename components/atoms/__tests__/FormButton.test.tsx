import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FormButton } from '../FormButton';

/**
 * Suite de pruebas para el componente FormButton
 * Este componente es un botón reutilizable que puede tener diferentes variantes,
 * estados de carga y deshabilitado.
 */
describe('FormButton', () => {
  /**
   * Prueba que el botón se renderice correctamente con la variante primaria (por defecto)
   * Verifica que el texto del botón sea visible
   */
  it('renders correctly with primary variant', () => {
    const { getByText } = render(
      <FormButton title="Test Button" />
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  /**
   * Prueba que el botón se renderice correctamente con la variante secundaria
   * Verifica que el texto del botón sea visible cuando se usa la variante secundaria
   */
  it('renders correctly with secondary variant', () => {
    const { getByText } = render(
      <FormButton title="Test Button" variant="secondary" />
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  /**
   * Prueba que el botón muestre un indicador de carga cuando la prop loading es true
   * Verifica que el ActivityIndicator sea visible y tenga el testID correcto
   */
  it('shows loading indicator when loading prop is true', () => {
    const { getByTestId } = render(
      <FormButton title="Test Button" loading={true} />
    );
    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  /**
   * Prueba que el botón maneje correctamente los eventos de presión
   * Verifica que la función onPress sea llamada cuando se presiona el botón
   */
  it('handles press event correctly', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <FormButton title="Test Button" onPress={onPress} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(onPress).toHaveBeenCalled();
  });

  /**
   * Prueba que el botón esté deshabilitado cuando la prop disabled es true
   * Verifica que el botón no llame a la función onPress cuando está deshabilitado
   */
  it('is disabled when disabled prop is true', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <FormButton title="Test Button" disabled={true} onPress={onPress} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('renders with different title', () => {
    const { getByText } = render(<FormButton title="Otro Botón" />);
    expect(getByText('Otro Botón')).toBeTruthy();
  });
}); 