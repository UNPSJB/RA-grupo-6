import { Card, Button, ListGroup, Badge } from "react-bootstrap";
import type { instrumentoList, TipoInstrumento } from "../types";
import { capitalizarCadena } from "../../Funciones";


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
    <Card className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
      <Card.Body className="p-4 p-md-5">
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h1 className="fw-bold mb-2">{config.titulo}</h1>
              <p className="text-muted mb-0">{config.subtitulo}</p>
            </div>
          </div>
        </div>
        
        {instrumentos.length > 0 ? (
          <ListGroup variant="flush">
            {instrumentos.map((instrumento) => (
              <ListGroup.Item 
                key={instrumento.id} 
                action 
                onClick={() => onSeleccionar(instrumento)}
                className="d-flex justify-content-between align-items-center p-4"
                style={{ 
                  cursor: 'pointer',
                  borderBottom: '1px solid #e9ecef'
                }}
              >
                <div className="flex-grow-1">
                  <div className="fw-bold fs-5 mb-1">
                    {capitalizarCadena(instrumento.materia.nombre)}
                  </div>
                  <div className="d-flex align-items-center gap-3 flex-wrap">
                    <small className="text-muted">
                      Código: {instrumento.materia.id}
                    </small>
                    <Badge bg={config.badgeColor}>
                      {config.badgeText}
                    </Badge>
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
                
                <Button 
                  variant="primary"
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSeleccionar(instrumento);
                  }}
                  className="px-4 py-2"
                >
                  <i className={`fas ${config.buttonIcon} me-2`}></i>
                  {config.buttonText}
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <div className="text-center py-5">
            <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
            <h5 className="text-muted mb-3">No hay instrumentos disponibles</h5>
            <p className="text-muted">{config.emptyState}</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}