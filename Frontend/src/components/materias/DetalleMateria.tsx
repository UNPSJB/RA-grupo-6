import { CContainer, CButton, CProgressBar, CRow, CCol, CBadge, CCard, CCardHeader, CCardBody } from "@coreui/react";
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
                    <CBadge color="secondary" className="p-2 me-2">{grupo.letra}</CBadge>
                    <span>{grupo.titulo}</span>
                </p>
                <span className={`fw-bold text-${estado.color}`}>
                    {grupo.promedio.toFixed(1)} / 4.0
                </span>
            </div>

            <CProgressBar
                now={(grupo.promedio / 4) * 100}
                variant={estado.color}
            >
                {`${((grupo.promedio / 4) * 100).toFixed(1)}%`}
            </CProgressBar>
        </div>
    );
}

export function DetalleMateria({ materia, onVolver }: Props) {
    return (
        <CContainer
            fluid
            className="py-4"
            style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
        >
            <CContainer className="mx-auto px-3" style={{ maxWidth: "1000px" }}>
                <CButton color="secondary" className="mb-4" onClick={onVolver}>
                    <i className="fa-solid fa-arrow-left"></i> Volver al listado
                </CButton>

                <CCard className="mb-4">
                    <CCardHeader>
                        <h3 className="fw-bold mb-0">
                            {capitalizarCadena(materia.nombre)} ({materia.id})
                        </h3>
                        <p className="text-medium-emphasis mb-0">
                            {materia.docente_apellido}, {materia.docente_nombre}
                        </p>
                    </CCardHeader>
                    <CCardBody>
                        <CRow className="g-3 text-center">
                            <CCol xs={12} md={6}>
                                <div className="p-3 border rounded h-100">
                                    <small className="text-medium-emphasis d-block mb-2 text-uppercase">
                                        Promedio General
                                    </small>
                                    <h3 className="text-primary fw-bold mb-0">
                                        {materia.promedio_general.toFixed(1)} / 4.0
                                    </h3>
                                </div>
                            </CCol>
                            <CCol xs={12} md={6}>
                                <div className="p-3 border rounded h-100">
                                    <small className="text-medium-emphasis d-block mb-2 text-uppercase">
                                        Respuestas de Estudiantes
                                    </small>
                                    <h3 className="fw-bold mb-0">
                                        {materia.tasa_de_respuesta?.Respondidas_Alumno ?? 0} /{" "}
                                        {materia.tasa_de_respuesta?.Asignadas_Alumno ?? 0}
                                    </h3>
                                </div>
                            </CCol>
                        </CRow>
                    </CCardBody>
                </CCard>
                
                <CCard>
                    <CCardHeader>
                        <h4 className="fw-semibold mb-0">Evaluación por Dimensiones</h4>
                    </CCardHeader>
                    <CCardBody>
                        <div className="d-flex flex-column" style={{ gap: "1.25rem" }}>
                            {materia.promedios_por_grupo.map((grupo, index) => (
                                <CardDimension key={index} grupo={grupo} />
                            ))}
                        </div>
                    </CCardBody>
                </CCard>
            </CContainer>
        </CContainer>
    );
}
