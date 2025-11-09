import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { CheckCircle, ExclamationCircle, ExclamationTriangle, ChevronRight } from "react-bootstrap-icons";
import { DetalleMateria } from "../materias/DetalleMateria";
import { capitalizarCadena } from "../Funciones";

export interface GrupoEstadistica {
    letra: string;
    titulo: string;
    promedio: number;
}

export interface MateriaEstadistica {
    id: string;
    nombre: string;
    docente_nombre: string;
    docente_apellido: string;
    promedios_por_grupo: GrupoEstadistica[];
    promedio_general: number;
    tasa_de_respuesta: { Respondidas_Alumno: number; Asignadas_Alumno: number };
    cuatrimestre: string;
}

function getEstado(promedio: number) {
    if (promedio >= 3.0) return { color: "success", icon: CheckCircle, label: "Bueno" };
    if (promedio >= 2.0) return { color: "warning", icon: ExclamationTriangle, label: "Regular" };
    return { color: "danger", icon: ExclamationCircle, label: "Requiere atención" };
}

interface CardMateriaProps {
    materia: MateriaEstadistica;
    onClick: () => void;
}

function CardMateria({ materia, onClick }: CardMateriaProps) {
    const estado = getEstado(materia.promedio_general);
    const Icon = estado.icon;
    
    const asignadas = materia.tasa_de_respuesta?.Asignadas_Alumno ?? 0;
    const respondidas = materia.tasa_de_respuesta?.Respondidas_Alumno ?? 0;
    const tasaRespuesta = asignadas > 0 
        ? ((respondidas / asignadas) * 100).toFixed(0)
        : "0";

    return (
        <Col xs={12} md={6}>
            <div
                onClick={onClick}
                style={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    minHeight: '280px',
                    backgroundColor: "white"
                }}
                className="border rounded-4 p-3 h-100"
            >
                <div className="p-3 d-flex flex-column justify-content-between h-100">
                    <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap">
                        <div className="flex-grow-1">
                            <h3 className="fw-semibold mb-1" style={{ fontSize: "18px" }}>
                                {capitalizarCadena(materia.nombre)} ({materia.id})
                            </h3>
                            <h4 className="text-muted" style={{ fontSize: "14px" }}>
                                {materia.docente_apellido}, {materia.docente_nombre}
                            </h4>
                        </div>
                        <ChevronRight size={24} className="text-muted" />
                    </div>

                    <div className={`bg-${estado.color}-subtle rounded-4 p-3 mb-3 d-flex align-items-center gap-4 justify-content-center flex-wrap`}>
                        <Icon size={24} className={`text-${estado.color}`} />
                        <div className="flex-grow-1 text-center">
                            <div className="fw-bold" style={{ fontSize: "28px", lineHeight: "1" }}>
                                {materia.promedio_general.toFixed(1)} / 4.0
                            </div>
                            <small>{estado.label}</small>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between pt-3 flex-wrap" style={{ borderTop: "1px solid #e9ecef" }}>
                        <div>
                            <small className="text-muted d-block mb-1" style={{ fontSize: "12px" }}>Tasa de Respuesta</small>
                            <div className="fw-semibold" style={{ fontSize: "18px" }}>{tasaRespuesta}%</div>
                        </div>
                        <div className="text-end">
                            <small className="text-muted d-block mb-1" style={{ fontSize: "12px" }}>Respondieron</small>
                            <div className="fw-semibold" style={{ fontSize: "18px" }}>
                                {respondidas} / {asignadas}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Col>
    );
}

export function EstadisticasCatedras() {
    const url_base = "http://127.0.0.1:8000/Dictados/PromediosDocentes";
    const [materias, setMaterias] = useState<MateriaEstadistica[]>([]);
    const [materiaSeleccionada, setMateriaSeleccionada] = useState<MateriaEstadistica | null>(null);

    useEffect(() => {
        fetch(url_base)
            .then(res => res.json())
            .then(data => setMaterias(data))
            .catch(err => console.log(err));
    }, []);

    if (materiaSeleccionada) {
        return (
            <DetalleMateria
                materia={materiaSeleccionada}
                onVolver={() => setMateriaSeleccionada(null)}
            />
        );
    }

    const totalCatedras = materias.length;
    const promedioGeneral = materias.length > 0
        ? (materias.reduce((sum, m) => sum + m.promedio_general, 0) / materias.length).toFixed(1)
        : "0.0";
    const requierenAtencion = materias.filter(m => parseFloat(m.promedio_general.toFixed(1)) < 2.5).length;
    const cuatrimestre = materias[0]?.cuatrimestre ?? "-";

    const materiasOrdenadas = [...materias].sort((a, b) => a.promedio_general - b.promedio_general);

    return (
        <Container fluid className="py-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            <Container className="mx-auto px-3" style={{ maxWidth: "1200px" }}>
                <div className="mb-4 text-center">
                    <h1 className="fw-bold mb-2" style={{ fontSize: "32px" }}>
                        Evaluación de Cátedras
                    </h1>
                    <p className="text-muted mb-0" style={{ fontSize: "16px" }}>
                        Cuatrimestre {cuatrimestre}
                    </p>
                </div>

                <Row className="g-4 justify-content-center mb-4 mt-4 border rounded-5 p-4" style={{ backgroundColor: "white" }}>
                    <Col xs={4} className="text-center mt-0">
                        <small className="text-muted d-block mb-2">Total Cátedras</small>
                        <h2 className="fw-bold mb-0">{totalCatedras}</h2>
                    </Col>
                    <Col xs={4} className="text-center mt-0">
                        <small className="text-muted d-block mb-2">Promedio General</small>
                        <h2 className="fw-bold mb-0 text-primary">{promedioGeneral}</h2>
                    </Col>
                    <Col xs={4} className="text-center mt-0">
                        <small className="text-muted d-block mb-2">Requieren Atención</small>
                        <h2 className="fw-bold mb-0 text-danger">{requierenAtencion}</h2>
                    </Col>
                </Row>

                <h3 className="fw-semibold mb-3" style={{ fontSize: "22px" }}>
                    Cátedras (ordenadas por prioridad de atención)
                </h3>

                <Row className="g-4">
                    {materiasOrdenadas.map(materia => (
                        <CardMateria
                            key={materia.id}
                            materia={materia}
                            onClick={() => setMateriaSeleccionada(materia)}
                        />
                    ))}
                </Row>
            </Container>
        </Container>
    );
}
