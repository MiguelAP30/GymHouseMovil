import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface FormGroupProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  style?: any;
}

export const FormGroup: React.FC<FormGroupProps> = ({
  title,
  description,
  children,
  style,
}) => {
  return (
    <View style={[styles.container, style]} testID="form-group">
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  content: {
    gap: 16,
  },
}); 