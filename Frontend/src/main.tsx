import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VerPregunta from './components/Pregunta/VerPregunta.tsx';
import CrearPlantillaFormulario from './components/Formulario/PlantillaFormularioCreate.tsx';
import PaginaInformesSinteticos from './components/Instrumento/pages/PaginaInformesSinteticos.tsx';
import PaginaEncuestasEstudiantes from './components/Instrumento/pages/PaginaEncuestasEstudiantes.tsx';
import PaginaInformesCatedra from './components/Instrumento/pages/PaginaInformesCatedra.tsx';
import { RespuestasFormulario } from './components/RespuestasFormulario/RespuestasFormulario.tsx';
import Menu from './components/Menu.tsx';
import SeleccionarMateria from './components/materias/SeleccionarMateria';
import ResponderInstrumento from './components/Instrumento/ResponderInstrumento';
import SeleccionarRol from './components/SeleccionarRol';
import InstrumentosDocente from './components/Instrumento/InstrumentosDocente';
import SeleccionarRespuestasFormularios from './components/RespuestasFormulario/SeleccionarRespuestasFormularios.tsx';
import { Llamadora } from './components/Respuesta/VerPorcentajes.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import ProtectedRoute from './components/Auth/ProtectedRoute.tsx';
import Login from './context/Login.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        {/* 🔐 Pantalla de login sin menú */}
        <Route path="/login" element={<Login />} />

        {/* 🔒 Rutas protegidas con menú */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Menu />
              <Routes>
                <Route path="/" element={<SeleccionarRol />} />
                <Route path="/seleccionar-rol" element={<SeleccionarRol />} />
                <Route path="/materias" element={<SeleccionarMateria />} />
                <Route path="/instrumentos-docente" element={<InstrumentosDocente />} />
                <Route path="/responder-instrumento/:instrumentoId" element={<ResponderInstrumento />} />
                <Route path="/VerPregunta" element={<VerPregunta />} />
                <Route path="/CrearFormulario" element={<CrearPlantillaFormulario />} />
                <Route path="/RespuestasFormularios" element={<SeleccionarRespuestasFormularios usuario_id={1} />} />
                <Route path="/RespuestaFormulario/:id" element={<RespuestasFormulario />} />
                <Route path="/VerInformesSinteticos" element={<PaginaInformesSinteticos />} />
                <Route path="/VerEncuestasEstudiante" element={<PaginaEncuestasEstudiantes />} />
                <Route path="/VerInformeActividadCurricular" element={<PaginaInformesCatedra />} />
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);
