import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthStore';

export function withProtectedRoute(Component: React.ComponentType, requiredRoles?: number[]) {
  return function ProtectedComponent(props: any) {
    const { isAuthenticated, role } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
      console.log('==== Protected Route Check ====');
      console.log('Required Roles:', requiredRoles);
      console.log('Current Role:', role);
      console.log('Is Authenticated:', isAuthenticated);

      if (!isAuthenticated) {
        console.log('Redirecting: Not authenticated');
        router.replace('/login');
        return;
      }

      if (requiredRoles && role !== null && !requiredRoles.includes(role)) {
        console.log('Redirecting: Unauthorized role');
        router.replace('/unauthorized');
        return;
      }
    }, [isAuthenticated, role, router]);

    if (!isAuthenticated || (requiredRoles && role !== null && !requiredRoles.includes(role))) {
      return null;
    }

    return <Component {...props} />;
  };
} 