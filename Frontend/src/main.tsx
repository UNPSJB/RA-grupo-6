import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from './components/Menu.tsx'

import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VerPregunta from './components/Pregunta/VerPregunta.tsx';
import CrearPregunta from './components/Pregunta/CrearPregunta.tsx';


// createRoot(document.getElementById('root')!).render(

ReactDOM.createRoot(document.getElementById('root')!).render(
    
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Menu/>}></Route>
        <Route path='/VerPregunta' element={<VerPregunta/>}></Route>
        <Route path='/CrearPregunta' element={<CrearPregunta/>}></Route>
      </Routes>
    </BrowserRouter>

)

