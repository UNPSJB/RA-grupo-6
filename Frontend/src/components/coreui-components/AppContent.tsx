import { CContainer } from '@coreui/react'
import { Routes, Route } from 'react-router-dom'
import { CompararPlantillas } from '../Estadisticas/CompararPeriodos'
import { MonitoreoRecordatorios } from '../MonitoreoRecordatorios'
import VerPregunta from '../Pregunta/VerPregunta'
import CrearPlantillaFormulario from '../Formulario/PlantillaFormularioCreate'
import PaginaInformesSinteticos from '../Instrumento/pages/PaginaInformesSinteticos'
import { MostrarEstadisticas } from '../Estadisticas/MostrarEstadisticas'
import SeleccionarInformeSintetico from '../Instrumento/components/SeleccionarInformeSintetico'
import InstrumentosDocente from '../Instrumento/InstrumentosDocente'
import PaginaInformesCatedra from '../Instrumento/pages/PaginaInformesCatedra'
import PaginaEncuestasEstudiantes from '../Instrumento/pages/PaginaEncuestasEstudiantes'
import SeleccionarMateria from '../Materias/SeleccionarMateria'
import { RespuestasFormulario } from '../RespuestasFormulario/RespuestasFormulario'
import { EstadisticasCatedras } from '../Estadisticas/MostrarEstadisticasCatedras'
import { PlanificarPeriodos } from '../Planificacion/PlanificarInstrumentos'
import SeleccionarRespuestasFormularios from '../RespuestasFormulario/SeleccionarRespuestasFormularios'


const PlaceholderComponent = ({ path }: { path: string }) => (
  <div>
    <h3>Página en construcción</h3>
    <p>
      Ruta: <code>{path}</code>
    </p>
  </div>
)


const AppContent = () => {
  return (
    <CContainer lg>
      <Routes>
        <Route path='/' element={<CompararPlantillas />} />
        <Route path="/monitoreo-recordatorios" element={<MonitoreoRecordatorios />} />
        <Route path='/VerPregunta' element={<VerPregunta />} />
        <Route path='/CrearFormulario' element={<CrearPlantillaFormulario />} />
        <Route path='/VerInformesSinteticos' element={<PaginaInformesSinteticos />} />

        {/* Rutas Departamento */}
        <Route path="/seleccionar-informe-sintetico" element={<SeleccionarInformeSintetico/>} />
        <Route path="/VerInformeActividadCurricular" element={<PaginaInformesCatedra/>} />
        {/* Rutas Docente */}
        <Route path="/instrumentos-docente" element={<InstrumentosDocente/>} />
        <Route path="/VerEncuestasEstudiante" element={<PaginaEncuestasEstudiantes/>} />
        {/* Rutas Estudiante */}
        <Route path="/materias" element={<SeleccionarMateria/>} />
        <Route path='/RespuestasFormularios' element={<SeleccionarRespuestasFormularios usuario_id={10}/>}></Route>
        <Route path='/RespuestaFormulario/:id' element={<RespuestasFormulario/>}></Route>
        {/* Rutas Secretaria Académica */}
        <Route path="/MostrarEstadisticas" element={<MostrarEstadisticas />} />
        <Route path="/EstadisticasDeDocente" element={<EstadisticasCatedras/>} />
        <Route path="/PlanificarPeriodos" element={<PlanificarPeriodos/>} />
      </Routes>
    </CContainer>
  )
}

export default AppContent

//