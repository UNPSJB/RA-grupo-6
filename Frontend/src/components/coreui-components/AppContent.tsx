import { CContainer } from '@coreui/react'
import { Routes, Route } from 'react-router-dom'
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
import { MostrarEstadisticasDepartamento } from '../Estadisticas/MostrarEstadisticasDepartamento'
import ResponderInstrumento from '../Instrumento/ResponderInstrumento'
import Home from '../../Home'
import VerRespuestasEstudiante from '../RespuestasFormulario/VerRespuestasEstudiante'
import VerRespuestasDocente from '../RespuestasFormulario/VerRespuestasDocente'
import VerRespuestasDepartamento from '../RespuestasFormulario/VerRespuestasDepartamento'
import VerRespuestas from '../RespuestasFormulario/VerRespuestas'
import { CompararPlantillas } from '../Estadisticas/CompararPeriodos'
import { MostrarEstadisticasAlumnos } from '../Estadisticas/MostrarEstadisticasAlumnos'
import HomeDashboard from '../../HomeDashboard'


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
        <Route path='/' element={<Home />} />
        <Route path="/monitoreo-recordatorios" element={<MonitoreoRecordatorios />} />
        <Route path='/VerPregunta' element={<VerPregunta />} />
        <Route path='/CrearFormulario' element={<CrearPlantillaFormulario />} />
        <Route path='/VerInformesSinteticos' element={<PaginaInformesSinteticos />} />
        <Route path='/Responder-instrumento/:instrumentoId' element={<ResponderInstrumento/>}></Route>
        {/* Rutas Departamento */}
        <Route path='/dashboard' element={<HomeDashboard/>} ></Route>
        <Route path="/seleccionar-informe-sintetico" element={<SeleccionarInformeSintetico/>} />
        <Route path="/VerInformeActividadCurricular" element={<PaginaInformesCatedra/>} />
        <Route path="/respuestas-informe-sintetico" element={<VerRespuestasDepartamento/>}>Informes Sintéticos Respondidos</Route>
        <Route path='/mostrar-estadisticas-departamento' element={<MostrarEstadisticasDepartamento departamento_id={1}/>} ></Route>
        {/* Rutas Docente */}
        <Route path='/dashboard' element={<HomeDashboard/>} ></Route>
        <Route path="/instrumentos-docente" element={<InstrumentosDocente/>} />
        <Route path="/VerEncuestasEstudiante" element={<PaginaEncuestasEstudiantes/>} />
        <Route path="/respuestas-informe-catedra" element={<VerRespuestasDocente/>}>Informes de Cátedra Respondidos</Route>
        <Route path="/TasaRespuestasAlumnos/" element={<MostrarEstadisticasAlumnos docente_id={2}/>} ></Route>


        {/* Rutas Estudiante */}
        <Route path='/dashboard' element={<HomeDashboard/>} ></Route>
        <Route path="/materias" element={<SeleccionarMateria/>} />
        <Route path='/RespuestasFormularios' element={<SeleccionarRespuestasFormularios usuario_id={10}/>}></Route>
        <Route path='/RespuestaFormulario/:id' element={<RespuestasFormulario/>}></Route>
        <Route path="/respuestas-encuesta-estudiante" element={<VerRespuestasEstudiante/>}>Ver Mis Respuestas</Route>
        {/* Rutas Secretaria Académica */}
        <Route path='/dashboard' element={<HomeDashboard/>} ></Route>
        <Route path='/mostrar-estadisticas-despartamento' element={<MostrarEstadisticasDepartamento departamento_id={1}/>} ></Route>
        <Route path="/MostrarEstadisticas" element={<MostrarEstadisticas />} />
        <Route path="/EstadisticasDeDocente" element={<EstadisticasCatedras/>} />
        <Route path="/PlanificarPeriodos" element={<PlanificarPeriodos/>} />
        <Route path="/ver-respuestas/:respuestasFormularioId" element={<VerRespuestas/>}></Route>
        <Route path='/comparar-plantillas' element={<CompararPlantillas/>} ></Route>

        
      </Routes>
    </CContainer>
  )
}

export default AppContent

//