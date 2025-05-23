import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface FormLabelProps {
  text: string;
  required?: boolean;
  error?: string;
  style?: any;
}

export const FormLabel: React.FC<FormLabelProps> = ({
  text,
  required = false,
  error,
  style,
}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.label, style]}>
        {text}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  required: {
    color: 'red',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 2,
  },
}); 