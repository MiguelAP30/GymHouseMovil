import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FormSelect } from '../FormSelect';

/**
 * Suite de pruebas para el componente FormSelect
 * Este componente es un selector de opciones que puede mostrar una etiqueta,
 * manejar errores y permitir la selección de valores.
 */
describe('FormSelect', () => {
  const options = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
  ];

  /**
   * Prueba que el selector se renderice correctamente cuando se proporciona una etiqueta
   * Verifica que la etiqueta sea visible en el componente
   */
  it('renders correctly with label', () => {
    const { getByText } = render(
      <FormSelect
        label="Test Select"
        options={options}
        value=""
        onValueChange={() => {}}
      />
    );
    expect(getByText('Test Select')).toBeTruthy();
  });

  /**
   * Prueba que el selector se renderice correctamente cuando no se proporciona una etiqueta
   * Verifica que no se muestre ninguna etiqueta en el componente
   */
  it('renders correctly without label', () => {
    const { queryByText } = render(
      <FormSelect
        options={options}
        value=""
        onValueChange={() => {}}
      />
    );
    expect(queryByText('Test Select')).toBeNull();
  });

  /**
   * Prueba que el selector muestre un mensaje de error cuando se proporciona la prop error
   * Verifica que el mensaje de error sea visible en el componente
   */
  it('shows error message when error prop is provided', () => {
    const { getByText } = render(
      <FormSelect
        label="Test Select"
        options={options}
        value=""
        error="This is an error"
        onValueChange={() => {}}
      />
    );
    expect(getByText('This is an error')).toBeTruthy();
  });

  /**
   * Prueba que el selector maneje correctamente los cambios de valor
   * Verifica que la función onValueChange sea llamada con el valor correcto
   * cuando se selecciona una opción
   */
  it('handles value change correctly', () => {
    const onValueChange = jest.fn();
    const { getByTestId } = render(
      <FormSelect
        label="Test Select"
        options={options}
        value=""
        onValueChange={onValueChange}
      />
    );
    
    fireEvent(getByTestId('select'), 'onValueChange', '1');
    expect(onValueChange).toHaveBeenCalledWith('1');
  });
});