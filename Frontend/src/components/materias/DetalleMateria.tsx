import { Container, Button, ProgressBar, Row, Col, Badge } from "react-bootstrap";
import type { MateriaEstadistica, GrupoEstadistica } from "../Estadisticas/MostrarEstadisticasCatedras";
import { CheckCircle, ExclamationCircle, ExclamationTriangle } from "react-bootstrap-icons";
import { capitalizarCadena } from "../Funciones";

interface Props {
    materia: MateriaEstadistica;
    onVolver: () => void;
}

function getEstado(promedio: number) {
    if (promedio >= 3.0) return { color: "success", icon: CheckCircle, label: "Bueno" };
    if (promedio >= 2.0) return { color: "warning", icon: ExclamationTriangle, label: "Regular" };
    return { color: "danger", icon: ExclamationCircle, label: "Requiere atención" };
}

interface CardDimensionProps {
    grupo: GrupoEstadistica;
}

function CardDimension({ grupo }: CardDimensionProps) {
    const estado = getEstado(grupo.promedio);

    return (
        <div
            className="border rounded-4 p-4"
            style={{
                backgroundColor: "white",
                flex: "1 1 0",
                boxSizing: "border-box",
            }}
        >
            <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
                <p className="mb-0">
                    <Badge className="p-2 me-2">{grupo.letra}</Badge>
                    <span>{grupo.titulo}</span>
                </p>
                <span className={`fw-bold text-${estado.color}`}>
                    {grupo.promedio.toFixed(1)} / 4.0
                </span>
            </div>

            <ProgressBar
                now={(grupo.promedio / 4) * 100}
                label={`${((grupo.promedio / 4) * 100).toFixed(1)}%`}
                variant={estado.color}
            />
        </div>
    );
}

export function DetalleMateria({ materia, onVolver }: Props) {
    return (
        <Container
            fluid
            className="py-4"
            style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
        >
            <Container className="mx-auto px-3" style={{ maxWidth: "1000px" }}>
                <Button variant="secondary" className="mb-4" onClick={onVolver}>
                    <i className="fa-solid fa-arrow-left"></i> Volver al listado
                </Button>

                <div
                    className="header mb-5 border rounded-4 p-4"
                    style={{ backgroundColor: "white" }}
                >
                    <h3 className="fw-bold mb-2">
                        {capitalizarCadena(materia.nombre)} ({materia.id})
                    </h3>
                    <p className="text-muted mb-4">
                        {materia.docente_apellido}, {materia.docente_nombre}
                    </p>

                    <Row className="g-3">
                        <Col xs={12} md={6}>
                            <div
                                className="p-4 border rounded"
                                style={{ backgroundColor: "#f9f9fb" }}
                            >
                                <small className="text-muted d-block mb-2">
                                    Promedio General
                                </small>
                                <h3 className="text-primary fw-bold mb-0">
                                    {materia.promedio_general.toFixed(1)} / 4.0
                                </h3>
                            </div>
                        </Col>
                        <Col xs={12} md={6}>
                            <div
                                className="p-4 border rounded"
                                style={{ backgroundColor: "#f9f9fb" }}
                            >
                                <small className="text-muted d-block mb-2">
                                    Estudiantes
                                </small>
                                <h3 className="fw-bold mb-0">
                                    {materia.tasa_de_respuesta?.Respondidas_Alumno ?? 0} /{" "}
                                    {materia.tasa_de_respuesta?.Asignadas_Alumno ?? 0}
                                </h3>
                            </div>
                        </Col>
                    </Row>
                </div>

                <h4 className="fw-semibold mb-3">Evaluación por Dimensiones</h4>
                <div
                    className="d-flex flex-column"
                    style={{
                        gap: "1.25rem", 
                        padding: "1.25rem",
                        backgroundColor: "#f8f9fa",
                    }}
                >
                    {materia.promedios_por_grupo.map((grupo, index) => (
                        <CardDimension key={index} grupo={grupo} />
                    ))}
                </div>
            </Container>
        </Container>
    );
}
