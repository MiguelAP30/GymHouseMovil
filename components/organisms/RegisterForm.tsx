import React from 'react';
import { View, Text, TextInput, ActivityIndicator } from 'react-native';
import { FormButton } from '../atoms/FormButton';

interface RegisterFormProps {
  onSubmit: (data: { name: string; email: string; password: string }) => void;
  isLoading?: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = () => {
    onSubmit({ name, email, password });
  };

  return (
    <View className="p-4">
      <Text className="text-2xl font-bold mb-2">Registro</Text>
      <Text className="text-gray-600 mb-6">Crea tu cuenta para continuar</Text>
      
      <View className="mb-4">
        <Text className="text-gray-700 text-sm font-medium mb-2">Nombre completo</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3"
          placeholder="Ingresa tu nombre"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 text-sm font-medium mb-2">Correo electrónico</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3"
          placeholder="ejemplo@correo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View className="mb-6">
        <Text className="text-gray-700 text-sm font-medium mb-2">Contraseña</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3"
          placeholder="Ingresa tu contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <FormButton
        title="Registrarse"
        onPress={handleSubmit}
        loading={isLoading}
        disabled={isLoading}
      />
    </View>
  );
}; 