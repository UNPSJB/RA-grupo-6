import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VerPregunta from './components/Pregunta/VerPregunta.tsx';
import CrearPregunta from './components/Pregunta/CrearPregunta.tsx';
import ResponderPreguntas from './components/Respuesta/ResponderPreguntaCerrada.tsx';


// createRoot(document.getElementById('root')!).render(

ReactDOM.createRoot(document.getElementById('root')!).render(
    
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ResponderPreguntas/>}></Route>
        <Route path='/VerPregunta' element={<VerPregunta/>}></Route>
        <Route path='/CrearPregunta' element={<CrearPregunta/>}></Route>
      </Routes>
    </BrowserRouter>

)

