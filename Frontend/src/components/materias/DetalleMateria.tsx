import { Container, Button, ProgressBar, Row, Col, Badge } from "react-bootstrap";
import type { MateriaEstadistica } from "../Estadisticas/MostrarEstadisticasCatedras";
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

export function DetalleMateria({ materia, onVolver }: Props) {
    return (
        <Container className="mx-auto px-3" style={{ maxWidth: "1000px", paddingTop: "40px" }}>
            <Button variant="secondary" className="mb-4" onClick={onVolver}>
                <i className="fa-solid fa-arrow-left"></i> Volver al listado
            </Button>

            <div className="header mb-5 border rounded-4 p-4">

                <h3 className="fw-bold mb-2">{capitalizarCadena(materia.nombre)} ({materia.id})</h3>
                <p className="text-muted mb-4">{materia.docente_apellido}, {materia.docente_nombre}</p> 
            
                <Row className="d-flex justify-content-around">
                    <Col xs={5} className="p-4 border rounded" style={{backgroundColor: "#f9f9fb"}}>
                        <small className="text-muted d-block mb-2">Promedio General</small>
                        <h3 className="text-primary fw-bold">{materia.promedio_general.toFixed(1)} / 4.0</h3>
                    </Col>
                    <Col xs={5} className="p-4 border rounded" style={{backgroundColor: "#f9f9fb"}}>
                        <small className="text-muted d-block mb-2">Estudiantes</small>
                        <h3 className="fw-bold">
                            {materia.tasa_de_respuesta?.Respondidas_Alumno ?? 0} / {materia.tasa_de_respuesta?.Asignadas_Alumno ?? 0}
                        </h3>
                    </Col>
                </Row>
            </div>


            <h4 className="fw-semibold mb-3">Evaluación por Dimensiones</h4>


            <div className="values d-flex flex-column gap-3">
                {materia.promedios_por_grupo.map((g,indice) => (
                    
                    <Row className="border rounded p-3" style={{backgroundColor:"white"}} key={indice}>
                        <Col xs={12} >
                            <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
                                <p >
                                    <Badge className="p-2"> {g.letra} </Badge>
                                    <span> {g.titulo} </span>
                                </p>
                                <span className={`fw-bold text-${getEstado(g.promedio).color}`}>{g.promedio} / 4.0</span>
                            </div>
                            <ProgressBar now={(g.promedio / 4) * 100} label={`${((g.promedio / 4) * 100).toFixed(1)}%`} variant={getEstado(g.promedio).color} />
                        </Col>
                    </Row>
                    
                ))}
            </div>
        </Container>
    )
}
