import { useState, useEffect } from "react";
import { Spinner, Alert } from "react-bootstrap";
import type { EstadisticaPregunta } from "../types";

// datos hardcodeados para el ejemplo
const datosEstadisticasHardcodeados: EstadisticaPregunta[] = [
    { pregunta_id: 1, pregunta_texto: "¿El material de estudio proporcionado fue claro y útil?", opciones: [{ texto_opcion: "Sí, completamente", cantidad: 15 }, { texto_opcion: "Parcialmente", cantidad: 8 }, { texto_opcion: "No, fue confuso", cantidad: 2 }] },
    { pregunta_id: 2, pregunta_texto: "¿La dificultad de las evaluaciones fue adecuada?", opciones: [{ texto_opcion: "Demasiado fácil", cantidad: 3 }, { texto_opcion: "Adecuada", cantidad: 20 }, { texto_opcion: "Demasiado difícil", cantidad: 2 }] },
];


export default function Estadisticas({ instrumentoId }: { instrumentoId: number }) {
  const [stats, setStats] = useState<EstadisticaPregunta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(`Cargando estadísticas para el instrumento ID: ${instrumentoId}`);
    // fetch(`http://127.0.0.1:8000/instrumentos/${instrumentoId}/estadisticas`)
    
    setTimeout(() => { 
      setStats(datosEstadisticasHardcodeados);
      setLoading(false);
    }, 500);
  }, [instrumentoId]);

  if (loading) return <div className="text-center"><Spinner size="sm" /> Cargando estadísticas...</div>;
  if (error) return <Alert variant="warning">{error}</Alert>;

  return (
    <div>
      <h3 className="fw-semibold fs-5 mb-4">Estadísticas de Respuestas Cerradas:</h3>
      {stats.map((stat) => {
        const totalVotos = stat.opciones.reduce((sum, opt) => sum + opt.cantidad, 0);
        return (
          <div key={stat.pregunta_id} className="mb-4">
            <p className="fw-bold mb-2">{stat.pregunta_texto}</p>
            {stat.opciones.map((opcion, index) => {
              const porcentaje = totalVotos > 0 ? (opcion.cantidad / totalVotos) * 100 : 0;
              return (
                <div key={index} className="mb-2">
                  <div className="d-flex justify-content-between text-muted mb-1"><small>{opcion.texto_opcion}</small><small className="fw-bold">{opcion.cantidad} votos</small></div>
                  <div className="progress" style={{ height: '8px' }}><div className="progress-bar bg-success" style={{ width: `${porcentaje}%` }}></div></div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}