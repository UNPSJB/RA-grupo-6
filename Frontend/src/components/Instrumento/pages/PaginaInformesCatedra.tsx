// PaginaInformesCatedra.tsx 

import { useState, useEffect } from "react";
import DetalleInforme from "../components/DetalleInforme";
import InstrumentoList from "../components/InstrumentoList";
import type { instrumentoList } from "../types"; 

// --- datos hardcodeados ---
const mockCatedra: instrumentoList[] = [
    { id: 201, tipo: 'INFORME_CATEDRA', 
      fecha_inicio: '2025-07-15', 
      fecha_cierre: '2025-08-15', 
      materia: { id: 'FIS1', nombre: 'Física I' }, 
      plantilla_formulario: { id: 3, titulo: 'Reporte de Cátedra Física I - 2C 2025' },
      docente: { id: 10, nombre: 'Juan', apellido: 'Martínez' }
    }
];

export default function PaginaInformesCatedra() {
  const TIPO_INSTRUMENTO = "INFORME_CATEDRA";
  const [instrumentos, setInstrumentos] = useState<instrumentoList[]>([]);
  const [seleccionado, setSeleccionado] = useState<instrumentoList | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setInstrumentos(mockCatedra);
      setCargando(false);
    }, 100);
  }, []);
  const handleSeleccionar = (instrumento: instrumentoList) => {
    console.log(`Seleccionando instrumento con ID: ${instrumento.id}`);
    setSeleccionado(instrumento);
  };
  
  if (cargando) return <p>Cargando informes de cátedra...</p>;

  if (seleccionado) {
    return <DetalleInforme informe={seleccionado} onVolver={() => setSeleccionado(null)} />;
  }

  return <InstrumentoList tipo={TIPO_INSTRUMENTO} instrumentos={instrumentos} onSeleccionar={handleSeleccionar} />;
}