import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const roleHomePages: { [key: string]: string } = {
    'secretaria academica': '/MostrarEstadisticas',
    'departamento': '/seleccionar-informe-sintetico',
    'docente': '/instrumentos-docente',
    'estudiante': '/materias',
};

const Home = () => {
    const { user } = useAuth();
    const userRole = user?.rol?.nombre.toLowerCase();

    if (userRole && roleHomePages[userRole]) {
        return <Navigate to={roleHomePages[userRole]} replace />;
    }

    return <Navigate to="/login" replace />;
};

export default Home;