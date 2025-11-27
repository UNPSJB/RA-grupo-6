import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const roleHomePages: { [key: string]: string } = {
    'secretaria academica': '/dashboard',
    'departamento': '/dashboard',
    'docente': '/dashboard',
    'estudiante': '/dashboard',
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