import React from 'react';
import { render } from '@testing-library/react-native';
import { FormLabel } from '../FormLabel';

describe('FormLabel', () => {
  it('renders correctly with text', () => {
    const { getByText } = render(<FormLabel text="Test Label" />);
    expect(getByText('Test Label')).toBeTruthy();
  });

  it('renders with required indicator when required is true', () => {
    const { getByText } = render(<FormLabel text="Test Label" required />);
    expect(getByText('*')).toBeTruthy();
  });

  it('applies custom styles when provided', () => {
    const { getByText } = render(
      <FormLabel text="Test Label" style={{ color: 'red' }} />
    );
    const label = getByText('Test Label');
    expect(label.props.style).toContainEqual({ color: 'red' });
  });

  it('renders with error state', () => {
    const { getByText } = render(
      <FormLabel text="Test Label" error="Error message" />
    );
    expect(getByText('Error message')).toBeTruthy();
  });
}); 