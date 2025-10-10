import { useState, useEffect } from "react";
import { Spinner, Alert } from "react-bootstrap";

// datos hardcodeados para el ejemplo
const datosEstadisticasHardcodeados = [
    { pregunta_id: 1, pregunta_texto: "¿El material fue claro?", opciones: [{ texto_opcion: "Sí", cantidad: 15 }, { texto_opcion: "No", cantidad: 5 }] },
    { pregunta_id: 2, pregunta_texto: "¿La dificultad fue adecuada?", opciones: [{ texto_opcion: "Fácil", cantidad: 8 }, { texto_opcion: "Adecuada", cantidad: 10 }, { texto_opcion: "Difícil", cantidad: 2 }] },
];

type Opcion = { texto_opcion: string; cantidad: number };
type PreguntaStat = { pregunta_id: number; pregunta_texto: string; opciones: Opcion[] };

export default function Estadisticas({ instrumentoId }: { instrumentoId: number }) {
  const [stats, setStats] = useState<PreguntaStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // en caso real, se puede hacer el fetch aca:
    // fetch(`http://127.0.0.1:8000/instrumentos/${instrumentoId}/estadisticas`)
    //   .then(...)

    setTimeout(() => { 
      setStats(datosEstadisticasHardcodeados);
      setLoading(false);
    }, 500);
  }, [instrumentoId]);

  if (loading) return <div className="text-center"><Spinner size="sm" /> Cargando estadísticas...</div>;
  if (error) return <Alert variant="warning">{error}</Alert>;

  return (
    <div>
      <h3 className="fw-semibold fs-5 mb-4">Respuestas de los Estudiantes:</h3>
      {stats.map((stat) => {
        const totalVotos = stat.opciones.reduce((sum, opt) => sum + opt.cantidad, 0);
        return (
          <div key={stat.pregunta_id} className="mb-4">
            <h5 className="fw-semibold small">{stat.pregunta_texto}</h5>
            {stat.opciones.map((opcion, index) => {
              const porcentaje = totalVotos > 0 ? (opcion.cantidad / totalVotos) * 100 : 0;
              return (
                <div key={index} className="mb-2">
                  <div className="d-flex justify-content-between"><small>{opcion.texto_opcion}</small><small>{opcion.cantidad} votos</small></div>
                  <div className="progress" style={{ height: '10px' }}><div className="progress-bar" style={{ width: `${porcentaje}%` }}></div></div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}