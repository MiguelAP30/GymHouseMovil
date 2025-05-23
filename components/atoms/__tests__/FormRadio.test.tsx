import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FormRadio } from '../FormRadio';

describe('FormRadio', () => {
  const options = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
  ];

  it('renders correctly with options', () => {
    const { getByText } = render(
      <FormRadio
        options={options}
        value=""
        onValueChange={() => {}}
      />
    );
    
    options.forEach(option => {
      expect(getByText(option.label)).toBeTruthy();
    });
  });

  it('handles value change correctly', () => {
    const onValueChange = jest.fn();
    const { getByTestId } = render(
      <FormRadio
        options={options}
        value=""
        onValueChange={onValueChange}
      />
    );
    
    const option = getByTestId('radio-option-2');
    fireEvent.press(option);
    expect(onValueChange).toHaveBeenCalledWith('2');
  });

  it('shows selected value correctly', () => {
    const { getByTestId } = render(
      <FormRadio
        options={options}
        value="2"
        onValueChange={() => {}}
      />
    );
    
    const selectedOption = getByTestId('radio-option-2');
    expect(selectedOption).toBeTruthy();
  });

  it('applies disabled state correctly', () => {
    const onValueChange = jest.fn();
    const { getByTestId } = render(
      <FormRadio
        options={options}
        value=""
        onValueChange={onValueChange}
        disabled={true}
      />
    );
    
    const option = getByTestId('radio-option-1');
    fireEvent.press(option);
    expect(onValueChange).not.toHaveBeenCalled();
  });
}); 