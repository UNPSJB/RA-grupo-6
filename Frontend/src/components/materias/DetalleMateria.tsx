import { CButton, CProgressBar, CRow, CCol, CBadge, CCardHeader, CCardBody } from "@coreui/react";
import type { MateriaEstadistica, GrupoEstadistica } from "../Estadisticas/MostrarEstadisticasCatedras";
import { CheckCircle, ExclamationCircle, ExclamationTriangle } from "react-bootstrap-icons";
import { capitalizarCadena } from "../Funciones";
import ShadowedCard from '../coreui-components/ShadowedCard';

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
            className="border rounded-4 p-4 bg-body"
            style={{
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
                value={(grupo.promedio / 4) * 100}
                color={estado.color}
            >
                {`${((grupo.promedio / 4) * 100).toFixed(1)}%`}
            </CProgressBar>
        </div>
    );
}

export function DetalleMateria({ materia, onVolver }: Props) {
    const tienePromedios = materia.promedios_por_grupo && materia.promedios_por_grupo.length > 0;

    return (
        <div className="py-4">
            <CButton color="secondary" className="mb-4" onClick={onVolver}>
                <i className="fa-solid fa-arrow-left me-2"></i>
                Volver al listado
            </CButton>

            <ShadowedCard className="mb-4">
                <CCardHeader>
                    <div className="m-2">
                        <h4 className="fw-bold mb-2">
                            {capitalizarCadena(materia.nombre)} ({materia.id})
                        </h4>
                        <p className="text-medium-emphasis mb-0">
                            {materia.docente_apellido}, {materia.docente_nombre}
                        </p>
                    </div>
                </CCardHeader>
                <CCardBody>
                    <CRow className="g-3 text-center">
                        <CCol xs={12} md={6}>
                            <div className="p-3 border rounded h-100 bg-body">
                                <small className="text-medium-emphasis d-block mb-2 text-uppercase">
                                    Promedio General
                                </small>
                                <h3 className="text-primary fw-bold mb-0">
                                    {materia.promedio_general.toFixed(1)} / 4.0
                                </h3>
                            </div>
                        </CCol>
                        <CCol xs={12} md={6}>
                            <div className="p-3 border rounded h-100 bg-body">
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
            </ShadowedCard>
            
            <ShadowedCard>
                <CCardHeader>
                    <div className="m-2">
                        <h4 className="fw-semibold mb-0">Evaluación por Dimensiones</h4>
                    </div>
                </CCardHeader>
                <CCardBody>
                    {tienePromedios ? (
                        <div className="d-flex flex-column" style={{ gap: "1.25rem" }}>
                            {materia.promedios_por_grupo.map((grupo, index) => (
                                <CardDimension key={index} grupo={grupo} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <i className="fas fa-chart-bar fa-3x text-medium-emphasis mb-3"></i>
                            <h5 className="text-medium-emphasis mb-3">No hay datos de dimensiones disponibles</h5>
                            <p className="text-medium-emphasis">
                                No se encontraron promedios por dimensiones para esta materia.
                            </p>
                        </div>
                    )}
                </CCardBody>
            </ShadowedCard>
        </div>
    );
}