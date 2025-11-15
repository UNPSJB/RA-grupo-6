import React, { Suspense, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Importamos los estilos de CoreUI en el componente de más alto nivel
import '@coreui/coreui/dist/css/coreui.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Importa los estilos SCSS de tu proyecto si los tienes, similar al ejemplo
// import './scss/style.scss';

import { CSpinner, useColorModes } from '@coreui/react';

// Importa tus componentes y páginas
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Lazy load para los componentes principales
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));
const Login = React.lazy(() => import('./context/Login'));

function App() {
  // Lógica para manejar el tema de color de CoreUI
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const storedTheme = useSelector((state: any) => state.theme);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
    const themeParam = urlParams.get('theme');
    const theme = themeParam ? (themeParam.match(/^[A-Za-z0-9\s]+/)?.[0] ?? null) : null;
    if (theme) {
      setColorMode(theme);
    }

    if (isColorModeSet()) {
      return;
    }

    setColorMode(storedTheme);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Suspense fallback={<div className="pt-3 text-center"><CSpinner color="primary" variant="grow" /></div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <ProtectedRoute><DefaultLayout /></ProtectedRoute>
          } />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;