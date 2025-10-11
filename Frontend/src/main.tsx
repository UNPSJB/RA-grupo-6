
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VerPregunta from './components/Pregunta/VerPregunta.tsx';
import CrearPlantillaFormulario from './components/Formulario/PlantillaFormularioCreate.tsx';
import { RespuestasFormulario } from './components/RespuestasFormulario/RespuestasFormulario.tsx';
// createRoot(document.getElementById('root')!).render(

ReactDOM.createRoot(document.getElementById('root')!).render(
    
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<RespuestasFormulario id_respuestas_formulario={1}/>}></Route>
        <Route path='/VerPregunta' element={<VerPregunta/>}></Route>
        <Route path='/CrearFormulario' element={<CrearPlantillaFormulario/>}></Route>
      </Routes>
    </BrowserRouter>

)

