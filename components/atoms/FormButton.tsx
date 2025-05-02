import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';

interface FormButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
}

export const FormButton: React.FC<FormButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}) => {
  const baseStyles = 'py-3 px-6 rounded-lg font-medium';
  const variantStyles = {
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-gray-200 text-gray-800',
  };
  const disabledStyles = disabled ? 'opacity-50' : '';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]} ${disabledStyles}`}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator testID="activity-indicator" color={variant === 'primary' ? 'white' : 'gray'} />
      ) : (
        <Text className="text-center font-medium text-white">{title}</Text>
      )}
    </TouchableOpacity>
  );
}; 