import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FormCheckbox } from '../FormCheckbox';

describe('FormCheckbox', () => {
  it('renders correctly with label', () => {
    const { getByText } = render(
      <FormCheckbox label="Test Checkbox" value={false} onValueChange={() => {}} />
    );
    expect(getByText('Test Checkbox')).toBeTruthy();
  });

  it('handles value change correctly', () => {
    const onValueChange = jest.fn();
    const { getByTestId } = render(
      <FormCheckbox
        label="Test Checkbox"
        value={false}
        onValueChange={onValueChange}
      />
    );
    
    fireEvent.press(getByTestId('checkbox'));
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('shows checked state correctly', () => {
    const { getByTestId } = render(
      <FormCheckbox
        label="Test Checkbox"
        value={true}
        onValueChange={() => {}}
      />
    );
    
    const checkbox = getByTestId('checkbox');
    const innerCheck = checkbox.findAllByType('View').find(
      v => v.props.style && v.props.style.backgroundColor === '#fff' && v.props.style.width === 10
    );
    expect(innerCheck).toBeTruthy();
  });

  it('applies disabled state correctly', () => {
    const onValueChange = jest.fn();
    const { getByTestId } = render(
      <FormCheckbox
        label="Test Checkbox"
        value={false}
        disabled
        onValueChange={onValueChange}
      />
    );
    
    fireEvent.press(getByTestId('checkbox'));
    expect(onValueChange).not.toHaveBeenCalled();
  });
}); 