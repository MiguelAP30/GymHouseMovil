import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface FormCheckboxProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({
  label,
  value,
  onValueChange,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => !disabled && onValueChange(!value)}
        disabled={disabled}
        testID="checkbox"
      >
        <View style={[styles.checkbox, value && styles.checked, disabled && styles.checkboxDisabled]}>
          {value && <View style={styles.innerCheck} />}
        </View>
        <Text style={[styles.label, disabled && styles.disabled]}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checked: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  innerCheck: {
    width: 10,
    height: 10,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  checkboxDisabled: {
    borderColor: '#CCCCCC',
    backgroundColor: '#F0F0F0',
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  disabled: {
    color: '#999',
  },
}); 