import { Card, Button, ListGroup, Badge } from "react-bootstrap";
import type { instrumentoList, TipoInstrumento } from "../types";
import { capitalizarCadena } from "../../Funciones";
import { CBadge, CButton, CCard, CCardBody, CCardHeader, CListGroup, CListGroupItem } from "@coreui/react";


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
    <CCard >
      <CCardHeader>
        <div className="m-2">
              <h4 >{config.titulo}</h4>
              <p className="text-medium-emphasis">{config.subtitulo}</p>
        </div>
      </CCardHeader>
      <CCardBody>
        
        
        {instrumentos.length > 0 ? (
          <CListGroup>
            {instrumentos.map((instrumento) => (
              <CListGroupItem 
                key={instrumento.id} 
                onClick={() => onSeleccionar(instrumento)}
                className="d-flex justify-content-between align-items-center p-4"
                
              >
                <div className="flex-grow-1">
                  <div className="fw-bold fs-5 mb-1">
                    {capitalizarCadena(instrumento.materia.nombre)}
                  </div>
                  <div className="d-flex align-items-center gap-3 flex-wrap">
                    <small className="text-muted">
                      Código: {instrumento.materia.id}
                    </small>
                    <CBadge color={config.badgeColor} >
                      {config.badgeText}
                    </CBadge>
                    {instrumento.docente && (
                      <small className="text-muted">
                        Docente: {instrumento.docente.nombre} {instrumento.docente.apellido}
                      </small>
                    )}
                    <small className="text-muted">
                      Período {new Date(instrumento.fecha_inicio).toLocaleDateString()} al {new Date(instrumento.fecha_cierre).toLocaleDateString()}
                    </small>
                  </div>
                </div>
                
                <CButton 
                  color="primary" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSeleccionar(instrumento);
                  }}
                  className="px-4 py-2"
                >
                  <i className={`fas ${config.buttonIcon} me-2`}></i>
                  {config.buttonText}
                </CButton>
              </CListGroupItem>
            ))}
          </CListGroup>
        ) : (
          <div className="text-center py-5">
            <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
            <h5 className="text-muted mb-3">No hay instrumentos disponibles</h5>
            <p className="text-muted">{config.emptyState}</p>
          </div>
        )}
      </CCardBody>
    </CCard>
  );
}