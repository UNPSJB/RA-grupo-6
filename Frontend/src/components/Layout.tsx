import React from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="bg-black text-white min-vh-100">
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <Link to="/" className="navbar-brand">
            Sistema de Encuestas
          </Link>
          <div className="navbar-nav flex-row">
            <Link to="/alumno" className="nav-link me-3">
              Alumno
            </Link>
            <Link to="/profesor" className="nav-link">
              Profesor
            </Link>
          </div>
        </div>
      </nav>
      <div className="container py-4">
        {children}
      </div>
    </div>
  );
};

export default Layout;