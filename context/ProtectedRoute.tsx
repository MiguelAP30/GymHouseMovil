import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthStore';
import { Redirect } from 'expo-router';
import { ROLES } from '../interfaces/interfaces';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: number[]; 
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, role } = useContext(AuthContext);

  console.log('Role del usuario actual:', role);
  console.log('Roles permitidos para esta ruta:', allowedRoles);

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    console.log('Usuario no autenticado, redirigiendo a login');
    return <Redirect href="/login" />;
  }

  // Si no se especifican roles permitidos, permitir acceso
  if (!allowedRoles) {
    console.log('No hay roles específicos requeridos, permitiendo acceso');
    return <>{children}</>;
  }

  // Verificar si el rol del usuario está en los roles permitidos
  const hasPermission = allowedRoles.includes(role || 0);
  console.log('¿Usuario tiene permiso?:', hasPermission);

  if (!hasPermission) {
    console.log('Usuario no autorizado, redirigiendo');
    return <Redirect href="/unauthorized" />; 
  }

  console.log('Acceso permitido a la ruta');
  return <>{children}</>;
};

export default ProtectedRoute;
