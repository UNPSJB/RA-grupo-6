import React from 'react';
import { useAuth } from '../context/AuthContext';

type Props = {
  children: React.ReactNode;
  roles: string | string[];
};

const RequireAuth: React.FC<Props> = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const requiredRoles = Array.isArray(roles) ? roles : [roles];

  if (requiredRoles.includes(user.rol.nombre)) {
    return <>{children}</>;
  }

  return null;
};

export default RequireAuth;
