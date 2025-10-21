// PaginaInformesSinteticos.tsx

import { useState, useEffect } from "react";
import DetalleInforme from "../components/DetalleInforme";
import InstrumentoList from "../components/InstrumentoList";
import type { instrumentoList } from "../types";

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


export default function PaginaInformesSinteticos() {
  const TIPO_INSTRUMENTO = "INFORME_SINTETICO";
  const [instrumentos, setInstrumentos] = useState<instrumentoList[]>([]);
  const [seleccionado, setSeleccionado] = useState<instrumentoList | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setInstrumentos(mockSinteticos);
      setCargando(false);
    }, 500);
  }, []);

  const handleSeleccionar = (instrumento: instrumentoList) => {
    console.log(`Seleccionando instrumento con ID: ${instrumento.id}`);
    setSeleccionado(instrumento);
  };

  if (cargando) return <p>Cargando informes sintéticos...</p>;

  if (seleccionado) {
    return <DetalleInforme informe={seleccionado} onVolver={() => setSeleccionado(null)} />;
  }

  return <InstrumentoList tipo={TIPO_INSTRUMENTO} instrumentos={instrumentos} onSeleccionar={handleSeleccionar} />;
}