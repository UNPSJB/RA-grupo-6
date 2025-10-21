import { Spinner, Alert, ProgressBar } from "react-bootstrap";
import type { EstadisticaPregunta } from "../types";

type EstadisticasProps = {
  stats: EstadisticaPregunta[];
  loading: boolean;
  error: string | null;
};

export default function Estadisticas({ stats, loading, error }: EstadisticasProps) {
  
  if (loading) return <div className="text-center"><Spinner size="sm" /> Cargando estadísticas...</div>;
  if (error) return <Alert variant="warning">{error}</Alert>;
  if (!stats || stats.length === 0) return <Alert variant="info">No hay estadísticas de respuestas cerradas para este informe.</Alert>;

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
                  <div className="d-flex justify-content-between text-muted mb-1">
                    <small>{opcion.texto_opcion}</small>
                    <small className="fw-bold">{opcion.cantidad} votos ({porcentaje.toFixed(1)}%)</small>
                  </div>
                  <ProgressBar 
                    now={porcentaje} 
                    variant="success" 
                    style={{ height: '8px' }} 
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}