import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthStore';
import { Redirect } from 'expo-router';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
