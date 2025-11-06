import { useState, useEffect } from "react";
import { Card, Button, ListGroup, Badge, Spinner, Accordion } from "react-bootstrap";
import type {DetalleInformeSinteticoCompleto, DetalleInformeProps } from "../types"; 
import { mockInformeSinteticoCompleto } from "../MockInformes";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InformePDFDocument from "./InformePDFDocument";

export default function DetalleInformeSintetico({ informe, onVolver }: DetalleInformeProps) {
  
  const [detalleCompleto, setDetalleCompleto] = useState<DetalleInformeSinteticoCompleto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => { 
      setDetalleCompleto(mockInformeSinteticoCompleto);
      setLoading(false);
    }, 100);
  }, [informe.id]);

  if (loading || !detalleCompleto) {
    return (
      <Card className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
        <Card.Body className="p-4 p-md-5 text-center">
          <Spinner animation="border" />
          <p className="mt-2">Cargando detalle del informe sintético...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
      <Card.Body className="p-4 p-md-5">
        
        <div className="mb-4">
          <h1 className="fw-bold mb-2">{detalleCompleto.titulo_formulario}</h1>
          <small className="text-muted mb-0 d-block">
            Fecha de finalización: <strong>{new Date(detalleCompleto.fecha_completado).toLocaleDateString()}</strong>
          </small>
          <small className="text-primary fst-italic">
            Realizado por: {detalleCompleto.autor_administrativo}
          </small>
        </div>
        
        <hr className="my-4" />
        <h3 className="fw-semibold fs-5 mb-3">Informes Académicos Analizados</h3>
        <Accordion>
          {detalleCompleto.informes_academicos_base.map((informeBase, index) => (
            <Accordion.Item eventKey={String(index)} key={informeBase.id}>
              <Accordion.Header>
                <span className="fw-bold me-2">{informeBase.titulo_formulario}</span>
                <Badge bg="info" pill>Docente: {informeBase.docente_nombre}</Badge>
              </Accordion.Header>
              <Accordion.Body>
                {informeBase.respuestas_abiertas_agrupadas.map(grupoDocente => (
                  <div key={grupoDocente.grupo} className="mb-3">
                    <h4 className="fw-bold fs-6 mb-3 p-2 bg-light rounded">
                      <Badge bg="secondary" className="me-2">{grupoDocente.grupo}</Badge> 
                      {grupoDocente.titulo_grupo}
                    </h4>
                    <ListGroup variant="flush">
                      {grupoDocente.respuestas.map((resDocente, idx) => (
                        <ListGroup.Item key={idx} className="px-0 py-2">
                          <p className="fw-bold mb-1" style={{fontSize: '0.9rem'}}>{resDocente.pregunta_texto}</p>
                          <p className="text-muted fst-italic ps-3 border-start border-2 mb-0">
                            {resDocente.respuesta_texto || "(Sin respuesta)"}
                          </p>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                ))}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>

        <hr className="my-4" />
        <h3 className="fw-semibold fs-5 mb-3">Conclusiones del Informe Sintético</h3>
        
        {detalleCompleto.respuestas_sintesis_agrupadas.map(grupo => (
          <div key={grupo.grupo} className="mb-4">
            <h4 className="fw-bold fs-6 mb-3 p-2 bg-light rounded">
              <Badge bg="secondary" className="me-2">{grupo.grupo}</Badge> 
              {grupo.titulo_grupo}
            </h4>
            <ListGroup variant="flush">
              {grupo.respuestas.map((res, index) => (
                <ListGroup.Item key={index} className="px-0 py-3">
                  <p className="fw-bold mb-1">{res.pregunta_texto}</p>
                  <p className="text-muted fst-italic ps-3 border-start border-2 mb-0">
                    {res.respuesta_texto || "(Sin respuesta)"}
                  </p>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        ))}


        
        <div className="d-grid gap-2 mt-5">
          {loading || !detalleCompleto ? (
            <Button variant="primary" disabled>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              <span className="ms-2">Cargando datos para PDF...</span>
            </Button>
          ) : (
            <PDFDownloadLink
              key={detalleCompleto?.id || Math.random()}
              document={<InformePDFDocument informe={detalleCompleto}  />}
              fileName={`${informe.plantilla_formulario.titulo}-${informe.id}.pdf`}
              className="btn btn-primary"
            >
              {({ loading: pdfLoading }) => 
                pdfLoading 
                  ? <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Generando PDF...</>
                  : 'Descargar Informe en PDF'
              }
            </PDFDownloadLink>
          )}
                  
          <Button variant="secondary" onClick={onVolver}>
            Volver al Listado
          </Button>
        </div>
        
      </Card.Body>
    </Card>
  );
}