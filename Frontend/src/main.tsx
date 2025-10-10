
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VerPregunta from './components/Pregunta/VerPregunta.tsx';
import CrearPlantillaFormulario from './components/Formulario/PlantillaFormularioCreate.tsx';
import Menu from './components/Menu.tsx';
import PaginaInformesSinteticos from './components/Instrumento/pages/PaginaInformesSinteticos.tsx';
import PaginaEncuestasEstudiantes from './components/Instrumento/pages/PaginaEncuestasEstudiantes.tsx';
import PaginaInformesCatedra from './components/Instrumento/pages/PaginaInformesCatedra.tsx';
// createRoot(document.getElementById('root')!).render(

ReactDOM.createRoot(document.getElementById('root')!).render(
    
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Menu/>}></Route>
        <Route path='/VerPregunta' element={<VerPregunta/>}></Route>
        <Route path='/CrearFormulario' element={<CrearPlantillaFormulario/>}></Route>
        <Route path='/VerInformesSinteticos' element={<PaginaInformesSinteticos/>}></Route>
        <Route path='/VerEncuestasEstudiante' element={<PaginaEncuestasEstudiantes/>}></Route>
        <Route path='/VerInformesCatedra' element={<PaginaInformesCatedra/>}></Route>
      </Routes>
    </BrowserRouter>

)

