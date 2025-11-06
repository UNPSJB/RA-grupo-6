import { useState, useEffect } from "react";
import { Card, Button, ListGroup, Badge, Spinner, Alert } from "react-bootstrap";
import type { instrumentoList, EstadisticaPregunta, GrupoPreguntasAbiertas } from "../types";
import Estadisticas from "./Estadisticas";
import { mockDetalleCompleto } from "../MockInformes";

// --------------------------------------------------------------------------------

type Props = {
  instrumento: instrumentoList;
  onVolver: () => void;
};

// --------------------------------------------------------------------------------

export default function DetalleEncuestaAgregada({ instrumento, onVolver }: Props) {
  if (!instrumento) {
    return null; 
  }

  const [estadisticas, setEstadisticas] = useState<EstadisticaPregunta[]>([]);
  const [gruposDeRespuestas, setGruposDeRespuestas] = useState<GrupoPreguntasAbiertas[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(`Cargando detalle completo para la encuesta ID: ${instrumento.id}`);
    setLoading(true);
    setError(null);
    
    setTimeout(() => { 
      setEstadisticas(mockDetalleCompleto.estadisticas);
      setGruposDeRespuestas(mockDetalleCompleto.respuestas_abiertas_agrupadas);
      setLoading(false);
    }, 100);
    
  }, [instrumento.id]);

  return (
    <Card className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
      <Card.Body className="p-4 p-md-5">
        <div className="mb-4">
          <h1 className="fw-bold mb-2">{instrumento.plantilla_formulario.titulo}</h1>
          <p className="text-muted mb-0">Resultados agregados de la encuesta</p>
        </div>
        
        <hr className="my-4" />

        <Estadisticas 
          stats={estadisticas}
          loading={loading}
          error={error}
        />
        
        {loading ? (
            <div className="text-center py-3"><Spinner size="sm" /></div>
        ) : error ? (
            <Alert variant="danger" className="mt-4">{error}</Alert>
        ) : (
            gruposDeRespuestas.map(grupo => (
              <div key={grupo.grupo}>
                <hr className="my-4" />
                <h3 className="fw-semibold fs-5 mb-3">{grupo.titulo_grupo}:</h3>
                
                {grupo.preguntas.map((pregunta, index) => (
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
                      {pregunta.respuestas_abiertas.length > 0 && (
                        <ListGroup.Item className="text-end">
                          <Badge pill bg="secondary">
                            {pregunta.respuestas_abiertas.length} respuestas
                          </Badge>
                        </ListGroup.Item>
                      )}
                    </ListGroup>
                  </div>
                ))}
              </div>
            ))
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

