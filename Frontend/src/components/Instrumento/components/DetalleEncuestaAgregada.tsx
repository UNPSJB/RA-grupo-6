import { Card, Button, ListGroup, Badge } from "react-bootstrap";
import type { EncuestaAgregadaDetail } from "../types";
import Estadisticas from "./Estadisticas";

type Props = {
  informe: EncuestaAgregadaDetail;
  onVolver: () => void;
};

export default function DetalleEncuestaAgregada({ informe, onVolver }: Props) {
  return (
    <Card className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
      <Card.Body className="p-4 p-md-5">
        <div className="mb-4">
          <h1 className="fw-bold mb-2">{informe.titulo_formulario}</h1>
          <p className="text-muted mb-0">Resultados agregados de la encuesta</p>
        </div>
        
        <hr className="my-4" />
        <Estadisticas instrumentoId={informe.id} />

        <hr className="my-4" />
        <h3 className="fw-semibold fs-5 mb-3">Respuestas Abiertas:</h3>
        
        {informe.respuestas_agregadas.map((pregunta, index) => (
          <div key={index} className="mb-4">
            <h5 className="fw-bold">{pregunta.pregunta_texto}</h5>
            <ListGroup variant="flush">
              {pregunta.respuestas_abiertas.map((respuesta, rIndex) => (
                <ListGroup.Item key={rIndex} className="ps-2">
                  <blockquote className="blockquote fst-italic text-muted mb-0 border-start border-2 ps-3">
                    <p className="mb-0 small">{respuesta || "(Sin respuesta)"}</p>
                  </blockquote>
                </ListGroup.Item>
              ))}
              <ListGroup.Item className="text-end">
                <Badge pill bg="secondary">
                  {pregunta.respuestas_abiertas.length} respuestas
                </Badge>
              </ListGroup.Item>
            </ListGroup>
          </div>
        ))}

        <div className="d-grid mt-5">
          <Button variant="secondary" onClick={onVolver}>
            Volver al Listado
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}