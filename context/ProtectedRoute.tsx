import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthStore';
import { Redirect } from 'expo-router';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: number[]; 
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }


  if (!allowedRoles) {
    return <>{children}</>;
  }


  if (user?.role_id === 1) {
    return <>{children}</>;
  }


  if (!allowedRoles.includes(user?.role_id || 0)) {
    return <Redirect href="/unauthorized" />; 
  }

  return <>{children}</>;
};

export default ProtectedRoute;
