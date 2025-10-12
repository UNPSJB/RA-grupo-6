import { useState, useEffect } from "react";
import DetalleInforme from "../components/DetalleInforme";
import InstrumentoList from "../components/InstrumentoList";
import type { instrumentoList, InstrumentoDetail } from "../types";

// --- datos hardcodeados  ---
const mockCatedra: instrumentoList[] = [
    { id: 201, tipo: 'INFORME_CATEDRA', 
        fecha_inicio: '2025-07-15', 
        fecha_cierre: '2025-08-15', 
        materia: { id: 'FIS1', nombre: 'Física I' }, 
        plantilla_formulario: { id: 3, titulo: 'Reporte de Cátedra Física I - 2C 2025' },
        docente: { id: 10, nombre: 'Juan', apellido: 'Martínez' }
    }
];
const mockDetalle: InstrumentoDetail = { 
  id: 201, 
  tipo: 'INFORME_CATEDRA', 
  titulo_formulario: 'Reporte de Cátedra Física I - 2C 2025', 
  fecha_completado: '2025-08-20',
  docente: { id: 10, nombre: 'Ana', apellido: 'Martínez' },
  respuestas: [ 
    {
        pregunta_texto: '¿Hubo inconvenientes durante la cursada?', respuesta_texto: 'No se reportaron inconvenientes mayores.',
        opcion_seleccionada: null
    },
    {
        pregunta_texto: 'Propuestas de mejora', respuesta_texto: 'Se sugiere actualizar la bibliografía complementaria.',
        opcion_seleccionada: null
    } 
  ]
};

export default function PaginaInformesCatedra() {
  const TIPO_INSTRUMENTO = "INFORME_CATEDRA";
  const [instrumentos, setInstrumentos] = useState<instrumentoList[]>([]);
  const [seleccionado, setSeleccionado] = useState<InstrumentoDetail | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setInstrumentos(mockCatedra);
      setCargando(false);
    }, 500);
  }, []);

  const handleSeleccionar = (id: number) => {
    console.log(`Buscando detalle del ID: ${id}`);
    setSeleccionado(mockDetalle);
  };
  
  if (cargando) return <p>Cargando informes de cátedra...</p>;
  if (seleccionado) return <DetalleInforme informe={seleccionado} onVolver={() => setSeleccionado(null)} />;

  return <InstrumentoList tipo={TIPO_INSTRUMENTO} instrumentos={instrumentos} onSeleccionar={handleSeleccionar} />;
}