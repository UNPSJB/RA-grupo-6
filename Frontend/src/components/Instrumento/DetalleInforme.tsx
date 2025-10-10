import { Card, Button, ListGroup } from "react-bootstrap";
import Estadisticas from "./Estadisticas";
import type { InstrumentoDetail } from "./types";

type DetalleInformeProps = {
  informe: InstrumentoDetail;
  onVolver: () => void; 
};

export default function DetalleInforme({ informe, onVolver }: DetalleInformeProps) {
  return (
    <Card className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
      <Card.Body className="p-4 p-md-5">
        <div className="mb-4">
          <h1 className="fw-bold mb-2">{informe.titulo_formulario}</h1>
          <p className="text-muted mb-0">
            Fecha: <strong>{new Date(informe.fecha_completado).toLocaleDateString()}</strong>
          </p>
        </div>
        <hr className="my-4" />
        <Estadisticas instrumentoId={informe.id} />
        {informe.respuestas && informe.respuestas.length > 0 && (
          <>
            <hr className="my-4" />
            <h3 className="fw-semibold fs-5 mb-3">Contenido del Informe</h3>
            <ListGroup variant="flush">
              {informe.respuestas.map((res, index) => (
                <ListGroup.Item key={index} className="p-3">
                  <p className="fw-bold mb-1">{res.pregunta_texto}</p>
                  <p className="text-muted fst-italic ps-3 border-start border-2">{res.respuesta_texto || "(Sin respuesta)"}</p>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </>
        )}

        <div className="d-grid mt-5">
          <Button variant="secondary" onClick={onVolver}>
            Volver al Listado
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}