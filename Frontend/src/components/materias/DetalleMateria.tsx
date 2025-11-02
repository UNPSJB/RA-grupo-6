import { Card, Container, Button, ProgressBar } from "react-bootstrap";
import type { MateriaEstadistica } from "../Estadisticas/MostrarEstadisticasCatedras";
import { CheckCircle, ExclamationCircle, ExclamationTriangle } from "react-bootstrap-icons";

interface Props {
    materia: MateriaEstadistica;
    onVolver: () => void;
}

function getEstado(promedio: number) {
    if (promedio >= 3.0) return { color: "success", icon: CheckCircle, label: "Bueno" };
    if (promedio >= 2.0) return { color: "warning", icon: ExclamationTriangle, label: "Regular" };
    return { color: "danger", icon: ExclamationCircle, label: "Requiere atención" };
}

export function DetalleMateria({ materia, onVolver }: Props) {
    return (
        <Container className="mx-auto px-3" style={{ maxWidth: "1000px", paddingTop: "40px" }}>
            <Button variant="secondary" className="mb-4" onClick={onVolver}>
                <i className="fa-solid fa-arrow-left"></i> Volver al listado
            </Button>

            <Card className="mb-4 shadow-sm border-0">
                <Card.Body className="p-4">
                    <h2 className="fw-bold mb-2">{materia.nombre} ({materia.id})</h2>
                    <p className="text-muted mb-4">{materia.docente_apellido}, {materia.docente_nombre}</p>

                    <div className="d-flex flex-wrap gap-3 justify-content-center">
                        <Card className="flex-fill bg-light border-0 p-3 text-center" style={{ minWidth: '180px' }}>
                            <small className="text-muted d-block mb-2">Promedio General</small>
                            <h3 className="text-primary fw-bold">{materia.promedio_general.toFixed(1)} / 4.0</h3>
                        </Card>
                        <Card className="flex-fill bg-light border-0 p-3 text-center" style={{ minWidth: '180px' }}>
                            <small className="text-muted d-block mb-2">Estudiantes</small>
                            <h3 className="fw-bold">
                                {materia.tasa_de_respuesta?.Respondidas_Alumno ?? 0} / {materia.tasa_de_respuesta?.Asignadas_Alumno ?? 0}
                            </h3>
                        </Card>
                    </div>
                </Card.Body>
            </Card>

            <h4 className="fw-semibold mb-3">Evaluación por Dimensiones</h4>

            <div className="d-flex flex-wrap gap-3 justify-content-center">
                {materia.promedios_por_grupo.map(g => {
                    const estado = getEstado(g.promedio);
                    const porcentaje = (g.promedio / 4) * 100;
                    return (
                        <Card key={g.letra} className="shadow-sm border-0 flex-fill" style={{ minWidth: '250px', flex: '1 1 300px' }}>
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap">
                                    <strong>{g.letra} - {g.titulo}</strong>
                                    <span className={`fw-bold text-${estado.color}`}>{g.promedio} / 4.0</span>
                                </div>
                                <ProgressBar now={porcentaje} label={`${porcentaje.toFixed(1)}%`} variant={estado.color} />
                            </Card.Body>
                        </Card>
                    )
                })}
            </div>
        </Container>
    )
}
