import { CContainer } from '@coreui/react'
import { Route, Routes } from 'react-router-dom'
import { MostrarEstadisticas } from './components/Estadisticas/MostrarEstadisticas'
import { MonitoreoRecordatorios } from './components/MonitoreoRecordatorios'
import { CompararPlantillas } from './components/Estadisticas/CompararPeriodos'
import VerPregunta from './components/Pregunta/VerPregunta'
import CrearPlantillaFormulario from './components/Formulario/PlantillaFormularioCreate'
import PaginaInformesSinteticos from './components/Instrumento/pages/PaginaInformesSinteticos'

const AppContent = () => {
  return (
    <CContainer lg>
      <Routes>
        {/* Rutas existentes */}
        <Route path='/' element={<CompararPlantillas />} />
        <Route path="/monitoreo-recordatorios" element={<MonitoreoRecordatorios />} />
        <Route path='/VerPregunta' element={<VerPregunta />} />
        <Route path='/CrearFormulario' element={<CrearPlantillaFormulario />} />
        <Route path='/VerInformesSinteticos' element={<PaginaInformesSinteticos />} />

        {/* --- Rutas a agregar --- */}
        {/* Rutas Departamento */}
        <Route path="/seleccionar-informe-sintetico" element={<PlaceholderComponent path="/seleccionar-informe-sintetico" />} />
        <Route path="/VerInformeActividadCurricular" element={<PlaceholderComponent path="/VerInformeActividadCurricular" />} />
        {/* Rutas Docente */}
        <Route path="/instrumentos-docente" element={<PlaceholderComponent path="/instrumentos-docente" />} />
        <Route path="/VerEncuestasEstudiante" element={<PlaceholderComponent path="/VerEncuestasEstudiante" />} />
        {/* Rutas Estudiante */}
        <Route path="/materias" element={<PlaceholderComponent path="/materias" />} />
        <Route path="/RespuestasFormularios" element={<PlaceholderComponent path="/RespuestasFormularios" />} />
        {/* Rutas Secretaria Académica */}
        <Route path="/MostrarEstadisticas" element={<MostrarEstadisticas />} />
        <Route path="/EstadisticasDeDocente" element={<PlaceholderComponent path="/EstadisticasDeDocente" />} />
        <Route path="/PlanificarPeriodos" element={<PlaceholderComponent path="/PlanificarPeriodos" />} />
      </Routes>
    </CContainer>
  )
}

export default AppContent