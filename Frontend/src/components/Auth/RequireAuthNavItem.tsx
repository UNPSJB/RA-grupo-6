import React from 'react';
import { useAuth } from '../../context/AuthContext';

interface RequireAuthNavItemProps {
  roles: string[];
  item: {
    component: React.ElementType;
    [key: string]: any;
  };
}

const RequireAuthNavItem: React.FC<RequireAuthNavItemProps> = ({ roles, item }) => {
  const { user } = useAuth();
  const { component: Component, ...itemProps } = item;

  const userHasRequiredRole = user && user.rol && roles.includes(user.rol.nombre);

  return userHasRequiredRole ? <Component {...itemProps} /> : null;
};

export default RequireAuthNavItem;