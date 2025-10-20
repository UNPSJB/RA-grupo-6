
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
import { VerPorcentajes } from './components/VerPorcentajes.tsx';
// createRoot(document.getElementById('root')!).render(

ReactDOM.createRoot(document.getElementById('root')!).render(
    <>
    <Menu></Menu>
    <BrowserRouter>
      <Routes>
        {/* <Route path='/' element={<SeleccionarMateria />} ></Route> */}
        <Route path='/' element={<VerPorcentajes id_plantilla_formulario={1} />} ></Route>
        <Route path='/seleccionar-materia' element={<SeleccionarMateria />} ></Route> 
        <Route path='/responder-instrumento/:instrumentoId' element={<ResponderInstrumento />} ></Route>
        <Route path='/VerPregunta' element={<VerPregunta/>}></Route>
        <Route path='/CrearFormulario' element={<CrearPlantillaFormulario/>}></Route>
        <Route path='/RespuestaFormulario' element={<RespuestasFormulario id_respuestas_formulario={1}/>} ></Route>
        <Route path='/VerInformesSinteticos' element={<PaginaInformesSinteticos/>}></Route>
        <Route path='/VerEncuestasEstudiante' element={<PaginaEncuestasEstudiantes/>}></Route>
        <Route path='/VerInformesCatedra' element={<PaginaInformesCatedra/>}></Route>
      </Routes>
    </BrowserRouter>
    </>

)

