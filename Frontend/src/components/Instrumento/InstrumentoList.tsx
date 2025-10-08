import { useState, useEffect } from "react";
import { Container, Card, Button, ListGroup, Spinner, Alert } from "react-bootstrap";
import type { InstrumentoList, InstrumentoDetail } from "./types";

function InstrumentoList() {
  const [instrumentos, setInstrumentos] = useState<InstrumentoList[]>([]);
  const [instrumentoSeleccionado, setInstrumentoSeleccionado] = useState<InstrumentoDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/instrumentos/INFORME_SINTETICO")
      .then((res) => {
        if (!res.ok) {
          throw new Error("No se pudieron cargar los informes.");
        }
        return res.json();
      })
      .then((data: InstrumentoList[]) => {
        setInstrumentos(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSeleccionarInforme = (id: number) => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/instrumentos/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("No se pudo cargar el detalle del informe.");
        }
        return res.json();
      })
      .then((data: InstrumentoDetail) => {
        setInstrumentoSeleccionado(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleVolver = () => {
    setInstrumentoSeleccionado(null);
    setError(null); 
  };

  // --- Renderizado ---

  if (loading) {
    return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;
  }

  if (error) {
    return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;
  }

  return (
    <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh", paddingTop: "2.5rem", paddingBottom: "2.5rem" }}>
      <Container style={{ maxWidth: "900px" }}>
        {instrumentoSeleccionado ? (
          <DetalleInforme informe={instrumentoSeleccionado} onVolver={handleVolver} />
        ) : (
          <ListaInformes informes={instrumentos} onSeleccionar={handleSeleccionarInforme} />
        )}
      </Container>
    </div>
  );
}

// --- Sub-componente para la Lista ---
type ListaProps = {
  informes: InstrumentoList[];
  onSeleccionar: (id: number) => void;
};

function ListaInformes({ informes, onSeleccionar }: ListaProps) {
  return (
    <Card className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
      <Card.Body className="p-4 p-md-5">
        <div className="mb-5 text-center text-md-start">
          <h1 className="fw-bold mb-2" style={{ color: "#1f2937", fontSize: "1.875rem" }}>
            Informes Sintéticos
          </h1>
          <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>
            Seleccione un informe para visualizar su contenido.
          </p>
        </div>
        {informes.length > 0 ? (
          <ListGroup variant="flush">
            {informes.map((informe) => (
              <ListGroup.Item key={informe.id} className="d-flex justify-content-between align-items-center p-3">
                <div>
                  <div className="fw-bold">{informe.tipo}</div>
                  <div className="text-muted small">
                    <small>Desde  {new Date(informe.fecha_inicio).toLocaleDateString()} </small> <small>hasta  {new Date(informe.fecha_cierre).toLocaleDateString()}</small>
                  </div>
                </div>
                <Button variant="outline-success" size="sm" onClick={() => onSeleccionar(informe.id)}>
                  <i className="fa-solid fa-eye me-2"></i> Seleccionar
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

// --- Sub-componente para el Detalle ---
type DetalleProps = {
  informe: InstrumentoDetail;
  onVolver: () => void;
};

function DetalleInforme({ informe, onVolver }: DetalleProps) {
  return (
    <Card className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
      <Card.Body className="p-4 p-md-5">
        <div className="mb-4">
          <h1 className="fw-bold mb-2" style={{ color: "#1f2937", fontSize: "1.875rem" }}>
            {informe.titulo_formulario}
          </h1>
          <p className="text-muted mb-0">
            Fecha: <strong>{new Date(informe.fecha_completado).toLocaleDateString()}</strong>
          </p>
        </div>
        <hr className="my-4" />
        <h3 className="fw-semibold fs-5 mb-3">Contenido del Informe</h3>
        <ListGroup variant="flush">
          {informe.respuestas.map((res, index) => (
            <ListGroup.Item key={index} className="p-3">
              <p className="fw-bold mb-1">{res.pregunta_texto}</p>
              <p className="text-muted fst-italic ps-3 border-start border-2">
                {res.respuesta_texto || res.opcion_seleccionada || "(Sin respuesta)"}
              </p>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <div className="d-grid mt-4">
          <Button variant="secondary" onClick={onVolver}>
            <i className="fa-solid fa-arrow-left me-2"></i> Volver al Listado
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default InstrumentoList;