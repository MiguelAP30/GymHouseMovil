import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Option {
  label: string;
  value: string;
}

interface FormRadioProps {
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export const FormRadio: React.FC<FormRadioProps> = ({
  options,
  value,
  onValueChange,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.optionContainer,
            disabled && styles.disabled,
          ]}
          onPress={() => !disabled && onValueChange(option.value)}
          disabled={disabled}
          testID={`radio-option-${option.value}`}
        >
          <View style={[
            styles.radio,
            value === option.value && styles.radioSelected,
            disabled && styles.radioDisabled
          ]}>
            {value === option.value && <View style={styles.radioInner} />}
          </View>
          <Text style={[
            styles.label,
            disabled && styles.labelDisabled
          ]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#007AFF',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  radioDisabled: {
    borderColor: '#CCCCCC',
  },
  label: {
    fontSize: 16,
    color: '#000000',
  },
  labelDisabled: {
    color: '#CCCCCC',
  },
  disabled: {
    opacity: 0.5,
  },
}); 