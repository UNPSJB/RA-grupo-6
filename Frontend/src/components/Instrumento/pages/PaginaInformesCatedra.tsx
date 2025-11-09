import { useState, useEffect } from "react";
import DetalleInforme from "../components/DetalleInforme";
import InstrumentoList from "../components/InstrumentoList";
import type { instrumentoList } from "../types"; 
import { mockCatedra } from "../MockInformes";


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