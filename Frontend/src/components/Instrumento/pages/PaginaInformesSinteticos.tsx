import { useState, useEffect } from "react";
import InstrumentoList from "../components/InstrumentoList";
import type { instrumentoList } from "../types";
import DetalleInformeSintetico from "../components/DetalleInformeSintetico";
import { mockSinteticos } from "../MockInformes";


export default function PaginaInformesSinteticos() {
  const TIPO_INSTRUMENTO = "INFORME_SINTETICO";
  const [instrumentos, setInstrumentos] = useState<instrumentoList[]>([]);
  const [seleccionado, setSeleccionado] = useState<instrumentoList | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setInstrumentos(mockSinteticos);
      setCargando(false);
    }, 100);
  }, []);

  const handleSeleccionar = (instrumento: instrumentoList) => {
    console.log(`Seleccionando instrumento con ID: ${instrumento.id}`);
    setSeleccionado(instrumento);
  };

  if (cargando) return <p>Cargando informes sintéticos...</p>;

  if (seleccionado) {
    return <DetalleInformeSintetico informe={seleccionado} onVolver={() => setSeleccionado(null)} />;
  }

  return <InstrumentoList tipo={TIPO_INSTRUMENTO} instrumentos={instrumentos} onSeleccionar={handleSeleccionar} />;
}