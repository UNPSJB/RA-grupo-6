import { Card, Button, ListGroup } from "react-bootstrap";
import type {ListaInstrumentosProps} from "../types";
import { INSTRUMENTO_CONFIG } from "../MockInformes";


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
              <ListGroup.Item key={instrumento.id} className="d-flex justify-content-between align-items-center p-3">
                <div>
                  <div className="fw-bold">{instrumento.plantilla_formulario.titulo}</div>
                  {instrumento.docente && (
                    <small className="text-primary fst-italic">
                      Realizado por: {instrumento.docente.nombre} {instrumento.docente.apellido}
                    </small>
                  )}
                  <small className="text-muted d-block"> 
                    {instrumento.materia.nombre} | Período {new Date(instrumento.fecha_inicio).toLocaleDateString()} al {new Date(instrumento.fecha_cierre).toLocaleDateString()}
                  </small>
                </div>
                <Button 
                  variant={`outline-${config.variant}`}
                  size="sm" 
                  onClick={() => onSeleccionar(instrumento)}
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