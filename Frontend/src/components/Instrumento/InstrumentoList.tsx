import { Card, Button, ListGroup } from "react-bootstrap";
import type InstrumentoList from "../Instrumento copy/InstrumentoList";
import type { TipoInstrumento } from "./types";
// Importamos los tipos necesarios

// Objeto de configuración para los textos
const INSTRUMENTO_CONFIG = {
  INFORME_SINTETICO: {
    titulo: "Informes Sintéticos",
    subtitulo: "Seleccione un informe para visualizar su contenido.",
    emptyState: "No hay informes sintéticos disponibles.",
    variant: "success",
  },
  INFORME_CATEDRA: {
    titulo: "Informes de Cátedra",
    subtitulo: "Seleccione un informe de cátedra para ver los detalles.",
    emptyState: "No hay informes de cátedra disponibles.",
    variant: "info",
  },
  ENCUESTA_ESTUDIANTE: {
    titulo: "Encuestas de Estudiantes",
    subtitulo: "Seleccione una encuesta para analizar las respuestas.",
    emptyState: "No hay encuestas de estudiantes disponibles.",
    variant: "primary",
  },
};

// Actualizamos las props para recibir el 'tipo'
type ListaInstrumentosProps = {
  instrumentos: InstrumentoList[]; 
  tipo: TipoInstrumento;
  onSeleccionar: (id: number) => void; 
};

export default function ListaInstrumentos({ instrumentos, tipo, onSeleccionar }: ListaInstrumentosProps) {
  // Obtenemos la configuración correcta basada en la prop 'tipo'
  const config = INSTRUMENTO_CONFIG[tipo];

  return (
    <Card className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
      <Card.Body className="p-4 p-md-5">
        <div className="mb-5 text-center text-md-start">
          {/* Usamos los textos de la configuración */}
          <h1 className="fw-bold mb-2">{config.titulo}</h1>
          <p className="text-muted mb-0">{config.subtitulo}</p>
        </div>
        
        {instrumentos.length > 0 ? (
          <ListGroup variant="flush">
            {instrumentos.map((instrumento) => (
              <ListGroup.Item key={instrumento.id} className="d-flex justify-content-between align-items-center p-3">
                <div>
                  <div className="fw-bold">{instrumento.plantilla_formulario.titulo}</div>
                  <small className="text-muted">
                    Desde {new Date(instrumento.fecha_inicio).toLocaleDateString()} hasta {new Date(instrumento.fecha_cierre).toLocaleDateString()}
                  </small>
                </div>
                <Button 
                  variant={`outline-${config.variant}`} // Color del botón dinámico
                  size="sm" 
                  onClick={() => onSeleccionar(instrumento.id)}
                >
                  Seleccionar
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          // Usamos el texto de estado vacío de la configuración
          <p className="text-center text-muted">{config.emptyState}</p>
        )}
      </Card.Body>
    </Card>
  );
}