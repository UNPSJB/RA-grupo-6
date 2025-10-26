// DetalleInforme.tsx

import { useState, useEffect } from "react";
import { PDFDownloadLink } from '@react-pdf/renderer'; 
import { Card, Button, ListGroup, Badge, Spinner } from "react-bootstrap";
import type { instrumentoList, EstadisticaPregunta, DetalleInformeCatedraCompleto } from "../types"; 
import InformePDFDocument from './InformePDFDocument';
import Estadisticas from "./Estadisticas";

const mockDetalleCompleto: DetalleInformeCatedraCompleto = {
  id: 101,
  titulo_formulario: "Informe de Actividad Curricular - Álgebra - 2C 2025",
  fecha_completado: "2025-09-05",
  estadisticas: [
    { pregunta_id: 1, pregunta_texto: "¿El material de estudio fue suficiente para comprender el contenido?", opciones: [{ texto_opcion: "Sí", cantidad: 15 }, { texto_opcion: "Parcialmente", cantidad: 8 }, { texto_opcion: "No", cantidad: 2 }] },
    { pregunta_id: 2, pregunta_texto: "¿La dificultad fue...?", opciones: [{ texto_opcion: "Adecuada", cantidad: 20 }, { texto_opcion: "Demasiado difícil", cantidad: 5 }] },
  ],
  respuestas_abiertas_agrupadas: [
    {
      "grupo": "A",
      "titulo_grupo": "Planificación de la enseñanza y prácticas docentes",
      "respuestas": [
        {
          "pregunta_texto": "¿En qué medida pudo cumplir con el cronograma y los contenidos estipulados en la planificación de la cátedra? Mencione eventuales desvíos y sus causas.",
          "respuesta_texto": "Se logró cubrir el 90% del programa..."
        },
        {
          "pregunta_texto": "Reflexione sobre las estrategias pedagógicas que implementó. ¿Cuáles resultaron más efectivas para el grupo de estudiantes de este ciclo?",
          "respuesta_texto": "La modalidad de taller en las últimas unidades..."
        },
        {
          "pregunta_texto": "Describa las principales dificultades conceptuales o prácticas que observó en los estudiantes durante la cursada.",
          "respuesta_texto": "Hubo problemas con los conceptos de la Unidad 3..."
        }
      ]
    },
    {
      "grupo": "B",
      "titulo_grupo": "Régimen de cursada, promoción y evaluación",
      "respuestas": [
        {
          "pregunta_texto": "Describa los instrumentos de evaluación utilizados (parciales, TPs, etc.) y fundamente su coherencia con los objetivos de la asignatura.",
          "respuesta_texto": "Se tomaron dos parciales escritos..."
        },
        {
          "pregunta_texto": "Analice los resultados de la cursada: ¿Qué porcentaje de estudiantes logró la regularidad y/o promoción? ¿A qué factores atribuye dichos resultados?",
          "respuesta_texto": "La promoción fue baja (15%)..."
        },
        {
          "pregunta_texto": "¿Considera que los criterios de promoción y regularización establecidos fueron claros y adecuados para el nivel de la asignatura?",
          "respuesta_texto": "Sí, los criterios son los mismos hace años..."
        }
      ]
    },
    {
      "grupo": "C",
      "titulo_grupo": "Material didáctico y bibliografía",
      "respuestas": [
        {
          "pregunta_texto": "¿La bibliografía obligatoria de la cátedra se mantiene actualizada y pertinente? ¿Pudo ser accedida sin dificultad por los estudiantes (física o digitalmente)?",
          "respuesta_texto": "El libro principal es de difícil acceso..."
        },
        {
          "pregunta_texto": "¿Qué utilidad tuvieron los trabajos prácticos diseñados para la integración de los contenidos teóricos? ¿Propone modificaciones para futuros ciclos?",
          "respuesta_texto": "El TP N°2 fue demasiado extenso..."
        },
        {
          "pregunta_texto": "¿Qué recursos (equipamiento, software, infraestructura de aulas, recursos en plataforma virtual) considera necesarios para optimizar el dictado de la asignatura?",
          "respuesta_texto": "Se necesita actualizar el software de los laboratorios..."
        }
      ]
    }
  ]
};

type DetalleInformeProps = {
  informe: instrumentoList; 
  onVolver: () => void;
};

export default function DetalleInforme({ informe, onVolver }: DetalleInformeProps) {
  
  if (!informe) return null;

  const [detalleCompleto, setDetalleCompleto] = useState<DetalleInformeCatedraCompleto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(`Cargando detalle completo para el instrumento ID: ${informe.id}`);
    setLoading(true);
    setError(null);
    
    setTimeout(() => { 
      setDetalleCompleto(mockDetalleCompleto);
      setLoading(false);
    }, 100);
    
  }, [informe.id]);

  return (
    <Card className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
      <Card.Body className="p-4 p-md-5">
        
        <div className="mb-4">
          <h1 className="fw-bold mb-2">{informe.plantilla_formulario.titulo}</h1>
          {!loading && detalleCompleto && (
            <small className="text-muted mb-0">
              Fecha de finalización: <strong>{new Date(detalleCompleto.fecha_completado).toLocaleDateString()}</strong>
            </small>
          )}
          <div>
            <small className="text-muted d-block"> 
            Período  <strong>{new Date(informe.fecha_inicio).toLocaleDateString()} al {new Date(informe.fecha_cierre).toLocaleDateString()}</strong>
          </small>
          {informe.docente && (
            <small className="text-primary fst-italic">
              Realizado por: {informe.docente.nombre} {informe.docente.apellido}
            </small>
          )}
          
        </div>
        </div>
        <hr className="my-4" />

        <Estadisticas 
          stats={detalleCompleto?.estadisticas || []}
          loading={loading}
          error={error}
        />

        {!loading && detalleCompleto && detalleCompleto.respuestas_abiertas_agrupadas.length > 0 && (
          <>
            <hr className="my-4" />
            <h3 className="fw-semibold fs-5 mb-3">Contenido del Informe por Aspectos</h3>
            {detalleCompleto.respuestas_abiertas_agrupadas.map(grupo => (
              <div key={grupo.grupo} className="mb-4">
                <h4 className="fw-bold fs-6 mb-3 p-2 bg-light rounded">
                  <Badge bg="secondary" className="me-2">{grupo.grupo}</Badge> 
                  {grupo.titulo_grupo}
                </h4>
                <ListGroup variant="flush">
                  {grupo.respuestas.map((res, index) => (
                    <ListGroup.Item key={index} className="px-0 py-3">
                      <p className="fw-bold mb-1">{res.pregunta_texto}</p>
                      <p className="text-muted fst-italic ps-3 border-start border-2 mb-0">{res.respuesta_texto || "(Sin respuesta)"}</p>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            ))}
          </>
        )}

        <div className="d-grid gap-2 mt-5">
          {loading || !detalleCompleto ? (
            <Button variant="primary" disabled>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              <span className="ms-2">Cargando datos para PDF...</span>
            </Button>
          ) : (
            <PDFDownloadLink
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