import { useState, useEffect } from "react";
import DetalleEncuestaAgregada from "../components/DetalleEncuestaAgregada";
import InstrumentoList from "../components/InstrumentoList";
import type { instrumentoList, EncuestaAgregadaDetail } from "../types";

// --- datos hardcodeados para encuesta de estudiante ---
const mockEncuestas: instrumentoList[] = [
  { 
    id: 301, tipo: 'ENCUESTA_ESTUDIANTE', 
    fecha_inicio: '2025-07-20', 
    fecha_cierre: '2025-08-20', 
    materia: { id: 'PROG1', nombre: 'Algorítmica y Programación I' },
    plantilla_formulario: { id: 4, titulo: 'Encuesta de fin de cursada - Algorítmica y Programación I' } 
    },
  { 
    id: 302, 
    tipo: 'ENCUESTA_ESTUDIANTE', 
    fecha_inicio: '2025-07-20', 
    fecha_cierre: '2025-08-20', 
    materia: { id: 'ARQ', nombre: 'Arquitectura de Computadoras' }, 
    plantilla_formulario: { id: 5, titulo: 'Encuesta de fin de cursada - Arquitectura' } 
    }
];

const mockDetalleAgregado: EncuestaAgregadaDetail = { 
  id: 301, 
  tipo: 'ENCUESTA_ESTUDIANTE', 
  titulo_formulario: 'Encuesta de fin de cursada - Algorítmica y Programación I', 
  respuestas_agregadas: [ 
    { 
      pregunta_texto: '¿Qué tema te resultó más interesante?', 
      respuestas_abiertas: [
        'El manejo de punteros y memoria dinámica.', 
        'La recursividad fue un concepto que me gustó mucho.',
        'Entender cómo funcionan los arrays por dentro.'
      ]
    }, 
    { 
      pregunta_texto: 'Sugerencias para el próximo cuatrimestre', 
      respuestas_abiertas: [
        'Más ejercicios prácticos de integración.',
        'Quizás un proyecto final un poco más grande.',
        'Me gustaría que se explique la compilación con más detalle.',
        'Ninguna, todo perfecto.'
      ] 
    } 
  ] 
};

export default function PaginaEncuestasEstudiantes() {
  const TIPO_INSTRUMENTO = "ENCUESTA_ESTUDIANTE";
  const [instrumentos, setInstrumentos] = useState<instrumentoList[]>([]);
  const [seleccionado, setSeleccionado] = useState<EncuestaAgregadaDetail | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setInstrumentos(mockEncuestas);
      setCargando(false);
    }, 500);
  }, []);

  const handleSeleccionar = (id: number) => {
    console.log(`Buscando detalle AGREGADO del ID: ${id}`);
    setSeleccionado(mockDetalleAgregado);
  };
  
  if (cargando) return <p>Cargando encuestas de estudiantes...</p>;

  if (seleccionado) {
    return <DetalleEncuestaAgregada informe={seleccionado} onVolver={() => setSeleccionado(null)} />;
  }
  
  return <InstrumentoList tipo={TIPO_INSTRUMENTO} instrumentos={instrumentos} onSeleccionar={handleSeleccionar} />;
}