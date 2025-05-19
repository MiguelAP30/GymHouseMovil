import { Stack } from 'expo-router';
import React, { useContext } from 'react';
import { AuthContext } from '../../../context/AuthStore';
import { ROLES } from '../../../interfaces/user';
import { Redirect } from 'expo-router';

const LayoutRutinas = () => {
  const { isAuthenticated, role } = useContext(AuthContext);

  if (!isAuthenticated || (role ?? 0) < ROLES.premium) {
    return <Redirect href="/unauthorized" />;
  }

  return (
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: '#1F2937' },
          headerTintColor: '#37A4DF',
          contentStyle: { backgroundColor: '#1F2937' },
        }}
      />
  );
};

export default LayoutRutinas;
