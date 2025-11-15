import { CContainer } from '@coreui/react'
import { Routes, Route } from 'react-router-dom'
import { CompararPlantillas } from '../Estadisticas/CompararPeriodos'
import { MonitoreoRecordatorios } from '../MonitoreoRecordatorios'
import VerPregunta from '../Pregunta/VerPregunta'
import CrearPlantillaFormulario from '../Formulario/PlantillaFormularioCreate'
import PaginaInformesSinteticos from '../Instrumento/pages/PaginaInformesSinteticos'


const AppContent = () => {
  return (
    <CContainer lg>
      <Routes>
        <Route path='/' element={<CompararPlantillas />} />
        <Route path="/monitoreo-recordatorios" element={<MonitoreoRecordatorios />} />
        <Route path='/VerPregunta' element={<VerPregunta />} />
        <Route path='/CrearFormulario' element={<CrearPlantillaFormulario />} />
        <Route path='/VerInformesSinteticos' element={<PaginaInformesSinteticos />} />
        {/* Aquí puedes añadir el resto de tus rutas */}
      </Routes>
    </CContainer>
  )
}

export default AppContent