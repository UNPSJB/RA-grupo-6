import { useState, useEffect } from "react";
import DetalleInforme from "../components/DetalleInforme";
import InstrumentoList from "../components/InstrumentoList";
import type { instrumentoList, InstrumentoDetail } from "../types";

const mockSinteticos: instrumentoList[] = [
  { id: 101, tipo: 'INFORME_SINTETICO', 
    fecha_inicio: '2025-08-01', 
    fecha_cierre: '2025-08-31', 
    materia: { id: 'ALG', nombre: 'Álgebra' }, 
    plantilla_formulario: { id: 1, titulo: 'Informe Sintético de Álgebra - 2C 2025' } },
  { id: 102, 
    tipo: 'INFORME_SINTETICO', 
    fecha_inicio: '2025-08-01', 
    fecha_cierre: '2025-08-31', 
    materia: { id: 'AM1', nombre: 'Análisis Matemático I' }, 
    plantilla_formulario: { id: 2, titulo: 'Informe Sintético de Análisis Matemático I - 2C 2025' } }
];
const mockDetalle: InstrumentoDetail = { 
  id: 101, 
  tipo: 'INFORME_SINTETICO', 
  titulo_formulario: 'Informe Sintético de Álgebra - 2C 2025', 
  fecha_completado: '2025-09-05', 
  respuestas: [ 
    {
        grupo: 'A',
        pregunta_texto: 'Comentarios sobre la claridad de las explicaciones en clase.',
        respuesta_texto: 'Las explicaciones fueron claras en general, aunque los temas de la segunda mitad del curso necesitaron más ejemplos.',
        opcion_seleccionada: null
    },
    {
        grupo: 'B', 
        pregunta_texto: 'Evaluación de la bibliografía obligatoria.',
        respuesta_texto: 'El libro principal fue de mucha utilidad.',
        opcion_seleccionada: null
    },
    {
        grupo: 'C',
        pregunta_texto: '¿Los trabajos prácticos fueron útiles para comprender los temas?',
        respuesta_texto: 'Sí, especialmente los últimos dos trabajos prácticos ayudaron a integrar todos los conceptos.',
        opcion_seleccionada: null
    }
  ] 
};

export default function PaginaInformesSinteticos() {
  const TIPO_INSTRUMENTO = "INFORME_SINTETICO";
  const [instrumentos, setInstrumentos] = useState<instrumentoList[]>([]);
  const [seleccionado, setSeleccionado] = useState<InstrumentoDetail | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // fetch(`/api/instrumentos?tipo=${TIPO_INSTRUMENTO}`).then(...)
    setTimeout(() => {
      setInstrumentos(mockSinteticos);
      setCargando(false);
    }, 500);
  }, []);

  const handleSeleccionar = (id: number) => {
    // fetch(`/api/instrumentos/${id}`).then(...)
    console.log(`Buscando detalle del ID: ${id}`);
    setSeleccionado(mockDetalle);
  };

  if (cargando) return <p>Cargando informes sintéticos...</p>;
  if (seleccionado) return <DetalleInforme informe={seleccionado} onVolver={() => setSeleccionado(null)} />;

  return <InstrumentoList tipo={TIPO_INSTRUMENTO} instrumentos={instrumentos} onSeleccionar={handleSeleccionar} />;
}