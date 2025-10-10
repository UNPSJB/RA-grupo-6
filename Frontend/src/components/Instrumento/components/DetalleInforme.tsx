import { Card, Button, ListGroup, Badge } from "react-bootstrap";
import type { InstrumentoDetail } from "../types";
import Estadisticas from "./Estadisticas";

const GRUPO_TITULOS: { [key: string]: string } = {
  A: "Planificación de la enseñanza y prácticas docentes",
  B: "Régimen de cursada, promoción y evaluación",
  C: "Material didáctico y bibliografía",
  D: "Desempeño y relaciones interpersonales",
  E: "Infraestructura y equipamiento",
  F: "Opinión general de los estudiantes",
  SIN_GRUPO: "Respuestas Generales"
};

type DetalleInformeProps = {
  informe: InstrumentoDetail;
  onVolver: () => void;
};

export default function DetalleInforme({ informe, onVolver }: DetalleInformeProps) {

  const respuestasAgrupadas = informe.tipo === 'INFORME_SINTETICO' 
    ? informe.respuestas.reduce((acc, respuesta) => {
        const grupo = respuesta.grupo || 'SIN_GRUPO';
        if (!acc[grupo]) {
          acc[grupo] = [];
        }
        acc[grupo].push(respuesta);
        return acc;
      }, {} as { [key: string]: typeof informe.respuestas })
    : null;

  return (
    <Card className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
      <Card.Body className="p-4 p-md-5">
        <div className="mb-4">
          <h1 className="fw-bold mb-2">{informe.titulo_formulario}</h1>
          <p className="text-muted mb-0">
            Fecha de finalización: <strong>{new Date(informe.fecha_completado).toLocaleDateString()}</strong>
            {informe.docente && (
              <span className="d-block mt-1">
                Informe realizado por: <strong>{informe.docente.nombre} {informe.docente.apellido}</strong>
              </span>
            )}
          </p>
        </div>
        
        <hr className="my-4" />
        <Estadisticas instrumentoId={informe.id} />

        {respuestasAgrupadas ? (
          <>
            <hr className="my-4" />
            <h3 className="fw-semibold fs-5 mb-3">Contenido del Informe por Aspectos</h3>
            {Object.keys(respuestasAgrupadas).sort().map(grupoKey => (
              <div key={grupoKey} className="mb-4">
                <h4 className="fw-bold fs-6 mb-3 p-2 bg-light rounded">
                  <Badge bg="secondary" className="me-2">{grupoKey}</Badge> 
                  {GRUPO_TITULOS[grupoKey]}
                </h4>
                <ListGroup variant="flush">
                  {respuestasAgrupadas[grupoKey].map((res, index) => (
                    <ListGroup.Item key={index} className="px-0 py-3">
                      <p className="fw-bold mb-1">{res.pregunta_texto}</p>
                      <p className="text-muted fst-italic ps-3 border-start border-2 mb-0">{res.respuesta_texto || "(Sin respuesta)"}</p>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            ))}
          </>
        ) : (
          informe.respuestas && informe.respuestas.length > 0 && (
            <>
              <hr className="my-4" />
              <h3 className="fw-semibold fs-5 mb-3">Respuestas Individuales</h3>
              <ListGroup variant="flush">
                {informe.respuestas.map((res, index) => (
                  <ListGroup.Item key={index} className="p-3">
                    <p className="fw-bold mb-1">{res.pregunta_texto}</p>
                    <p className="text-muted fst-italic ps-3 border-start border-2">{res.respuesta_texto || "(Sin respuesta)"}</p>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )
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