import { useState, useEffect } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import type { InstrumentoDetail, instrumentoList } from "./types";
import DetalleInforme from "./DetalleInforme";
import ListaInformes from "./ListaInformes";

export default function instrumentoList(tipo: string) {
  const [instrumentos, setInstrumentos] = useState<instrumentoList[]>([]);
  const [instrumentoSeleccionado, setInstrumentoSeleccionado] = useState<InstrumentoDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/instrumentos/${tipo}`)
      .then((res) => res.json())
      .then((data) => setInstrumentos(data))
      .catch((err) => setError("No se pudieron cargar los informes."))
      .finally(() => setLoading(false));
  }, []);

  const handleSeleccionarInforme = (id: number) => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/instrumentos/${id}/detail`)
      .then((res) => res.json())
      .then((data) => setInstrumentoSeleccionado(data))
      .catch((err) => setError("No se pudo cargar el detalle."))
      .finally(() => setLoading(false));
  };

  const handleVolver = () => setInstrumentoSeleccionado(null);

  if (loading) return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;
  if (error) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh", paddingTop: "2.5rem" }}>
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