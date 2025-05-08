import React from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface FormSelectProps {
  label?: string;
  options: { label: string; value: string }[];
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  options,
  value,
  onValueChange,
  error,
}) => {
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-gray-700 text-sm font-medium mb-2">{label}</Text>
      )}
      <View
        className={`border rounded-lg ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          testID="select"
        >
          {options.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>
      {error && (
        <Text className="text-red-500 text-xs mt-1">{error}</Text>
      )}
    </View>
  );
}; 