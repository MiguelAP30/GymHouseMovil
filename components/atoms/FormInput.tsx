import React from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';

interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const FormInput = ({ label, error, ...props }: FormInputProps) => {
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-1">
          {label}
        </Text>
      )}
      <TextInput
        className={`border rounded-lg px-4 py-2 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && (
        <Text className="text-red-500 text-sm mt-1">{error}</Text>
      )}
    </View>
  );
}; 