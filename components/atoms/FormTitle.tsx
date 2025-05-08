import React from 'react';
import { Text, TextProps } from 'react-native';

interface FormTitleProps extends TextProps {
  title: string;
  subtitle?: string;
}

export const FormTitle = ({ title, subtitle, ...props }: FormTitleProps) => {
  return (
    <Text className="text-2xl font-bold text-gray-900 mb-2" {...props}>
      {title}
    </Text>
  );
}; 