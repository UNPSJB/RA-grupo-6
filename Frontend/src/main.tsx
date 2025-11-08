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
import SeleccionarInformeSintetico from './components/Instrumento/components/SeleccionarInformeSintetico.tsx';
import { MostrarEstadisticas } from './components/Estadisticas/MostrarEstadisticas.tsx';
import {EstadisticasCatedras} from './components/Estadisticas/MostrarEstadisticasCatedras.tsx'
// createRoot(document.getElementById('root')!).render(
import { AuthProvider } from './context/AuthContext.tsx';
import ProtectedRoute from './components/Auth/ProtectedRoute.tsx';
import Login from './context/Login.tsx';
import { MostrarEstadisticasDepartamento } from './components/Estadisticas/MostrarEstadisticasDepartamento.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
            <ProtectedRoute>
              <Menu />
              <Routes>
                <Route path='/' element={<MostrarEstadisticasDepartamento/>} ></Route>
                <Route path='/EstadisticasDeDocente' element={<EstadisticasCatedras/>} ></Route>
                <Route path='/seleccionar-rol' element={<SeleccionarRol/>}></Route>
                <Route path='/Materias' element={<SeleccionarMateria/>}></Route>
                <Route path='/instrumentos-docente' element={<InstrumentosDocente/>}></Route>
                <Route path='/Responder-instrumento/:instrumentoId' element={<ResponderInstrumento/>}></Route>
                <Route path='/seleccionar-informe-sintetico' element= {<SeleccionarInformeSintetico/>} ></Route>
                <Route path='/seleccionar-materia' element={<SeleccionarMateria />} ></Route> 
                <Route path='/responder-instrumento/:instrumentoId' element={<ResponderInstrumento />} ></Route>
                <Route path='/VerPregunta' element={<VerPregunta/>}></Route>
                <Route path='/CrearFormulario' element={<CrearPlantillaFormulario/>}></Route>
                <Route path='/RespuestasFormularios' element={<SeleccionarRespuestasFormularios usuario_id={10}/>}></Route>
                <Route path='/RespuestaFormulario/:id' element={<RespuestasFormulario/>}></Route>
                <Route path='/VerInformesSinteticos' element={<PaginaInformesSinteticos/>}></Route>
                <Route path='/VerEncuestasEstudiante' element={<PaginaEncuestasEstudiantes/>}></Route>
                <Route path='/VerInformeActividadCurricular' element={<PaginaInformesCatedra/>}></Route>
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);
