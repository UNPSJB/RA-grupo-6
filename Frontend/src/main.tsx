
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
import ResponderInstrumento from './components/ResponderInstrumento';
import SeleccionarMateria from './components/materias/SeleccionarMateria.tsx';
import SeleccionarRespuestasFormularios from './components/RespuestasFormulario/SeleccionarRespuestasFormularios.tsx';
import { Llamadora} from './components/Respuesta/VerPorcentajes.tsx';
// createRoot(document.getElementById('root')!).render(




ReactDOM.createRoot(document.getElementById('root')!).render(


  <>
    <Menu></Menu>
    <BrowserRouter>
      <Routes>
        {/* <Route path='/' element={<SeleccionarMateria />} ></Route> */}
        <Route path='/' element={<Llamadora id_instrumento={1}  />} ></Route>
        <Route path='/seleccionar-materia' element={<SeleccionarMateria />} ></Route> 
        <Route path='/responder-instrumento/:instrumentoId' element={<ResponderInstrumento />} ></Route>
        <Route path='/VerPregunta' element={<VerPregunta/>}></Route>
        <Route path='/CrearFormulario' element={<CrearPlantillaFormulario/>}></Route>
        <Route path='/RespuestasFormularios' element={<SeleccionarRespuestasFormularios usuario_id={1}/>}></Route>
        <Route path='/RespuestaFormulario/:id' element={<RespuestasFormulario/>}></Route>
        <Route path='/VerInformesSinteticos' element={<PaginaInformesSinteticos/>}></Route>
        <Route path='/VerEncuestasEstudiante' element={<PaginaEncuestasEstudiantes/>}></Route>
        <Route path='/VerInformesCatedra' element={<PaginaInformesCatedra/>}></Route>
      </Routes>
    </BrowserRouter>
    </>

)

