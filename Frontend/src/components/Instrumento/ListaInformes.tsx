import { Card, Button, ListGroup } from "react-bootstrap";
import type { instrumentoList } from "./types";

type ListaInformesProps = {
  informes: instrumentoList[]; 
  onSeleccionar: (id: number) => void; 
};

export default function ListaInformes({ informes, onSeleccionar }: ListaInformesProps) {
  return (
    <Card className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
      <Card.Body className="p-4 p-md-5">
        <div className="mb-5 text-center text-md-start">
          <h1 className="fw-bold mb-2">Informes Sintéticos</h1>
          <p className="text-muted mb-0">Seleccione un informe para visualizar su contenido.</p>
        </div>
        {informes.length > 0 ? (
          <ListGroup variant="flush">
            {informes.map((informe) => (
              <ListGroup.Item key={informe.id} className="d-flex justify-content-between align-items-center p-3">
                <div>
                  <div className="fw-bold">{informe.plantilla_formulario.titulo}</div>
                  <small className="text-muted">
                    Desde {new Date(informe.fecha_inicio).toLocaleDateString()} hasta {new Date(informe.fecha_cierre).toLocaleDateString()}
                  </small>
                </div>
                <Button variant="outline-success" size="sm" onClick={() => onSeleccionar(informe.id)}>
                  Seleccionar
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p className="text-center text-muted">No hay informes sintéticos disponibles.</p>
        )}
      </Card.Body>
    </Card>
  );
}