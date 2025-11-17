import type { instrumentoList, TipoInstrumento } from "../types";
import { capitalizarCadena } from "../../Funciones";
import { CButton, CCardBody, CCardHeader, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from "@coreui/react";
import ShadowedCard from "../../coreui-components/ShadowedCard";


const INSTRUMENTO_CONFIG = {
  INFORME_SINTETICO: {
    titulo: "Informes Sintéticos",
    subtitulo: "Seleccione un informe para visualizar su contenido y estadísticas",
    emptyState: "No hay informes sintéticos disponibles en este momento",
    badgeText: "Informe Sintético",
    badgeColor: "success",
    buttonIcon: "fa-eye",
    buttonText: "Ver Informe",
  },
  INFORME_CATEDRA: {
    titulo: "Informes de Cátedra",
    subtitulo: "Seleccione un informe de cátedra para revisar los detalles",
    emptyState: "No se encontraron informes de cátedra",
    badgeText: "Informe Cátedra",
    badgeColor: "success",
    buttonIcon: "fa-eye",
    buttonText: "Ver Informe",
  },
  ENCUESTA_ESTUDIANTE: {
    titulo: "Encuestas de Estudiantes",
    subtitulo: "Seleccione una encuesta para analizar las respuestas agregadas",
    emptyState: "No hay encuestas de estudiantes para mostrar",
    badgeText: "Encuesta Estudiante",
    badgeColor: "success",
    buttonIcon: "fa-eye",
    buttonText: "Ver Resultados",
  },
};

type ListaInstrumentosProps = {
  instrumentos: instrumentoList[]; 
  tipo: TipoInstrumento;
  onSeleccionar: (instrumento: instrumentoList) => void; 
};


export default function InstrumentoList({ instrumentos, tipo, onSeleccionar }: ListaInstrumentosProps) {
  const config = INSTRUMENTO_CONFIG[tipo];

  return (
    <ShadowedCard >
      <CCardHeader>
        <div className="m-2">
              <h4 >{config.titulo}</h4>
              <p className="text-medium-emphasis">{config.subtitulo}</p>
        </div>
      </CCardHeader>
      <CCardBody>
        
        
        {instrumentos.length > 0 ? (
          <CTable className='border mb-1'  hover responsive>
            <CTableHead color="light" >
              <CTableRow>
                <CTableHeaderCell>Materia</CTableHeaderCell>
                <CTableHeaderCell>Período</CTableHeaderCell>
                {tipo === 'INFORME_CATEDRA' && <CTableHeaderCell>Docente</CTableHeaderCell>}
                <CTableHeaderCell className="text-center">Acción</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {instrumentos.map((instrumento) => (
                <CTableRow key={instrumento.id} onClick={() => onSeleccionar(instrumento)} style={{ cursor: 'pointer' }} >
                  <CTableDataCell>
                    <div className="fw-normal">{capitalizarCadena(instrumento.materia.nombre)}</div>
                    <div className="small text-medium-emphasis">Código: {instrumento.materia.id}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    {new Date(instrumento.fecha_inicio).toLocaleDateString()} - {new Date(instrumento.fecha_cierre).toLocaleDateString()}
                  </CTableDataCell>
                  {tipo === 'INFORME_CATEDRA' && instrumento.docente && (
                    <CTableDataCell>
                      {instrumento.docente.nombre} {instrumento.docente.apellido}
                    </CTableDataCell>
                  )}
                  <CTableDataCell className="text-center">
                    <CButton
                      color="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSeleccionar(instrumento);
                      }}
                    >
                      <i className={`fas ${config.buttonIcon}`}></i>
                      {config.buttonText}
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        ) : (
          <div className="text-center py-5">
            <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
            <h5 className="text-muted mb-3">No hay instrumentos disponibles</h5>
            <p className="text-muted">{config.emptyState}</p>
          </div>
        )}
      </CCardBody>
    </ShadowedCard>
  );
}