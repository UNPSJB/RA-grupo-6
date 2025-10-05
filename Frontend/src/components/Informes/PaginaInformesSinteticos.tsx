import { useState, useEffect } from "react";
import { Container, Card, Button, ListGroup, Spinner, Alert } from "react-bootstrap";
import type { InformeSinteticoList, InformeSinteticoDetail } from "./types";

function PaginaInformesSinteticos() {
  // Estado para guardar la lista de informes
  const [informes, setInformes] = useState<InformeSinteticoList[]>([]);
  // Estado para guardar el informe que se seleccionó para ver en detalle
  const [informeSeleccionado, setInformeSeleccionado] = useState<InformeSinteticoDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/informes-sinteticos/")
      .then((res) => {
        if (!res.ok) {
          throw new Error("No se pudieron cargar los informes.");
        }
        return res.json();
      })
      .then((data: InformeSinteticoList[]) => {
        setInformes(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSeleccionarInforme = (id: number) => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/informes-sinteticos/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("No se pudo cargar el detalle del informe.");
        }
        return res.json();
      })
      .then((data: InformeSinteticoDetail) => {
        setInformeSeleccionado(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleVolver = () => {
    setInformeSeleccionado(null);
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
        {/* Renderizado condicional: muestra el detalle o la lista */}
        {informeSeleccionado ? (
          <DetalleInforme informe={informeSeleccionado} onVolver={handleVolver} />
        ) : (
          <ListaInformes informes={informes} onSeleccionar={handleSeleccionarInforme} />
        )}
      </Container>
    </div>
  );
}

// --- Sub-componente para la Lista ---
type ListaProps = {
  informes: InformeSinteticoList[];
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
                  <div className="fw-bold">{informe.titulo_formulario}</div>
                  <div className="text-muted small">
                    Por: {informe.autor_nombre} - {new Date(informe.fecha_completado).toLocaleDateString()}
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
  informe: InformeSinteticoDetail;
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
            Elaborado por: <strong>{informe.autor_nombre}</strong>
          </p>
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

export default PaginaInformesSinteticos;