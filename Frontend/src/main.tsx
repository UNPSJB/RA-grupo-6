import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import CrearPregunta from './components/Pregunta/CrearPregunta.tsx'
import MateriaList from './components/materia.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App></App>
    <CrearPregunta numero={1}/>
  </StrictMode>
)
