import React from 'react';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  component: React.ElementType;
  [key: string]: any;
}

interface Props {
  children?: React.ReactNode;
  roles: string[];
  item?: NavItem;
}

const RequireAuthNavItem: React.FC<Props> = ({ children, roles, item }) => {
  const { user } = useAuth();

  if (user && roles.includes(user.rol.nombre)) {
    if (item) {
      const { component: Component, ...rest } = item;
      return <Component {...rest} />;
    }
    return <>{children}</>;
  }

  return null;
};

export default RequireAuthNavItem;