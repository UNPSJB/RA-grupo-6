import { Card, Button, ListGroup } from "react-bootstrap";
import type { instrumentoList, TipoInstrumento } from "../types";

const INSTRUMENTO_CONFIG = {
  INFORME_SINTETICO: {
    titulo: "Informes Sintéticos",
    subtitulo: "Seleccione un informe para visualizar su contenido y estadísticas.",
    emptyState: "No hay informes sintéticos disponibles en este momento.",
    variant: "primary",
  },
  INFORME_CATEDRA: {
    titulo: "Informes de Cátedra",
    subtitulo: "Seleccione un informe de cátedra para revisar los detalles.",
    emptyState: "No se encontraron informes de cátedra.",
    variant: "primary",
  },
  ENCUESTA_ESTUDIANTE: {
    titulo: "Encuestas de Estudiantes",
    subtitulo: "Seleccione una encuesta para analizar las respuestas individuales.",
    emptyState: "No hay encuestas de estudiantes para mostrar.",
    variant: "primary",
  },
};

type ListaInstrumentosProps = {
  instrumentos: instrumentoList[]; 
  tipo: TipoInstrumento;
  onSeleccionar: (id: number) => void; 
};

export default function InstrumentoList({ instrumentos, tipo, onSeleccionar }: ListaInstrumentosProps) {
  const config = INSTRUMENTO_CONFIG[tipo];

  return (
    <Card className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
      <Card.Body className="p-4 p-md-5">
        <div className="mb-5 text-center text-md-start">
          <h1 className="fw-bold mb-2">{config.titulo}</h1>
          <p className="text-muted mb-0">{config.subtitulo}</p>
        </div>
        
        {instrumentos.length > 0 ? (
          <ListGroup variant="flush">
            {instrumentos.map((instrumento) => (
              <ListGroup.Item key={instrumento.id} action onClick={() => onSeleccionar(instrumento.id)} className="d-flex justify-content-between align-items-center p-3">
                <div>
                  <div className="fw-bold">{instrumento.plantilla_formulario.titulo}</div>
                  {instrumento.docente && (
                    <small className="text-primary fst-italic">
                      Realizado por: {instrumento.docente.nombre} {instrumento.docente.apellido}
                    </small>
                  )}
                  <small className="text-muted">
                    {instrumento.materia.nombre} | Período {new Date(instrumento.fecha_inicio).toLocaleDateString()} al {new Date(instrumento.fecha_cierre).toLocaleDateString()}
                  </small>
                </div>
                <Button 
                  variant={`outline-${config.variant}`}
                  size="sm" 
                  onClick={(e) => { e.stopPropagation(); onSeleccionar(instrumento.id); }}
                >
                  Ver Detalle
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p className="text-center text-muted fst-italic py-5">{config.emptyState}</p>
        )}
      </Card.Body>
    </Card>
  );
}