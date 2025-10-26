import { useState, useEffect } from "react";
import DetalleEncuestaAgregada from "../components/DetalleEncuestaAgregada";
import InstrumentoList from "../components/InstrumentoList";
import type { instrumentoList, EncuestaAgregadaDetail } from "../types";

// --- Datos hardcodeados para la lista de encuestas ---
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

export default function PaginaEncuestasEstudiantes() {
  const TIPO_INSTRUMENTO = "ENCUESTA_ESTUDIANTE";
  const [instrumentos, setInstrumentos] = useState<instrumentoList[]>([]);
  const [seleccionado, setSeleccionado] = useState<instrumentoList | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setInstrumentos(mockEncuestas);
      setCargando(false);
    }, 100);
  }, []);

  const handleSeleccionar = (instrumento: instrumentoList) => {
    console.log(`Seleccionando instrumento con ID: ${instrumento.id}`);
    setSeleccionado(instrumento);
  };
  
  if (cargando) return <p>Cargando encuestas de estudiantes...</p>;

  if (seleccionado) {
    return <DetalleEncuestaAgregada instrumento={seleccionado} onVolver={() => setSeleccionado(null)} />;
  }
  
  return <InstrumentoList tipo={TIPO_INSTRUMENTO} instrumentos={instrumentos} onSeleccionar={handleSeleccionar} />;
}
