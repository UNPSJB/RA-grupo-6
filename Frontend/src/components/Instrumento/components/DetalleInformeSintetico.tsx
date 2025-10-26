// DetalleInformeSintetico.tsx 

import { useState, useEffect } from "react";
import { PDFDownloadLink } from '@react-pdf/renderer'; 
import { Card, Button, ListGroup, Badge, Spinner, Accordion } from "react-bootstrap";
import type { instrumentoList, DetalleInformeSinteticoCompleto, GrupoRespuestasAbiertas } from "../types"; 
// import InformeSinteticoPDFDocument from './InformeSinteticoPDFDocument';
const mockInformeSinteticoCompleto: DetalleInformeSinteticoCompleto = {
  id: 201,
  titulo_formulario: "Informe Sintético - Departamento de Informática - 2C 2025",
  fecha_completado: "2025-10-01",
  autor_administrativo: "Personal Administrativo",
  respuestas_sintesis_agrupadas: [
    {
      "grupo": "A",
      "titulo_grupo": "Análisis de Patrones y Dificultades",
      "respuestas": [
        {
          "pregunta_texto": "Identifique patrones o dificultades recurrentes observadas en los informes de cátedra.",
          "respuesta_texto": "Se observa una dificultad generalizada en la retención de alumnos de primer año..."
        }
      ]
    },
    {
      "grupo": "B",
      "titulo_grupo": "Propuestas de Mejora Departamentales",
      "respuestas": [
         {
          "pregunta_texto": "Describa las propuestas de mejora o acompañamiento que el Departamento implementará.",
          "respuesta_texto": "Se propondrá un taller de 'Nuevas Estrategias de Evaluación'..."
        }
      ]
    },
    {
      "grupo": "C",
      "titulo_grupo": "Gestión de Recursos",
      "respuestas": [
        {
          "pregunta_texto": "Reflexión sobre los recursos solicitados por las cátedras (software, equipamiento, etc.).",
          "respuesta_texto": "Es recurrente la solicitud de actualización de software de laboratorios..."
        }
      ]
    }
  ],
  informes_academicos_base: [
    {
      id: 101,
      titulo_formulario: "Informe de Actividad Curricular - Álgebra - 2C 2025",
      docente_nombre: "Dr. Juan Pérez",
      respuestas_abiertas_agrupadas: [
        {
          "grupo": "A",
          "titulo_grupo": "Planificación de la enseñanza...",
          "respuestas": [
            {
              "pregunta_texto": "¿En qué medida pudo cumplir con el cronograma...?",
              "respuesta_texto": "Se logró cubrir el 90% del programa..."
            },
            {
              "pregunta_texto": "Reflexione sobre las estrategias pedagógicas...",
              "respuesta_texto": "La modalidad de taller en las últimas unidades..."
            }
          ]
        },
        {
          "grupo": "B",
          "titulo_grupo": "Régimen de cursada...",
          "respuestas": [
            {
              "pregunta_texto": "Analice los resultados de la cursada...",
              "respuesta_texto": "La promoción fue baja (15%)..."
            }
          ]
        }
      ]
    },
    {
      id: 102,
      titulo_formulario: "Informe de Actividad Curricular - Algoritmos - 2C 2025",
      docente_nombre: "Ing. Ana Gómez",
      respuestas_abiertas_agrupadas: [
        {
          "grupo": "A",
          "titulo_grupo": "Planificación de la enseñanza...",
          "respuestas": [
            {
              "pregunta_texto": "¿En qué medida pudo cumplir con el cronograma...?",
              "respuesta_texto": "Tuvimos que acortar la Unidad 4 por el paro."
            }
          ]
        },
        {
          "grupo": "C",
          "titulo_grupo": "Material didáctico y bibliografía",
          "respuestas": [
            {
              "pregunta_texto": "¿Qué recursos considera necesarios...",
              "respuesta_texto": "Se solicita un ayudante de segunda adicional..."
            }
          ]
        }
      ]
    }
  ]
};

type DetalleInformeProps = {
  informe: instrumentoList; 
  onVolver: () => void;
};

export default function DetalleInformeSintetico({ informe, onVolver }: DetalleInformeProps) {
  
  const [detalleCompleto, setDetalleCompleto] = useState<DetalleInformeSinteticoCompleto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => { 
      setDetalleCompleto(mockInformeSinteticoCompleto);
      setLoading(false);
    }, 500);
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
          <Button variant="secondary" onClick={onVolver}>
            Volver al Listado
          </Button>
        </div>
        
      </Card.Body>
    </Card>
  );
}