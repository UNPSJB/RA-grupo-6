import { useEffect, useState } from "react";
import {
    CCol,
    CContainer,
    CRow,
    CCard,
    CCardBody,
    CSpinner,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilCheckCircle, cilWarning, cilXCircle, cilChevronRight } from "@coreui/icons";
//import { DetalleMateria } from "../materias/DetalleMateria";
import { capitalizarCadena } from "../Funciones";
import { DetalleMateria } from "../Materias/DetalleMateria";


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
    if (promedio >= 3.0) return { color: "success", icon: cilCheckCircle, label: "Bueno" };
    if (promedio >= 2.0) return { color: "warning", icon: cilWarning, label: "Regular" };
    return { color: "danger", icon: cilXCircle, label: "Requiere atención" };
}

interface CardMateriaProps {
    materia: MateriaEstadistica;
    onClick: () => void;
}

function CardMateria({ materia, onClick }: CardMateriaProps) {
    const estado = getEstado(materia.promedio_general);    
    
    const asignadas = materia.tasa_de_respuesta?.Asignadas_Alumno ?? 0;
    const respondidas = materia.tasa_de_respuesta?.Respondidas_Alumno ?? 0;
    const tasaRespuesta = asignadas > 0 
        ? ((respondidas / asignadas) * 100).toFixed(0)
        : "0";

    return (
        <CCol xs={12} md={6}>
            <CCard
                onClick={onClick}
                className="h-100 shadow-sm"
                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
            >
                <CCardBody className="p-4 d-flex flex-column justify-content-between">
                    <div>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="flex-grow-1">
                                <h5 className="fw-semibold mb-1">
                                    {capitalizarCadena(materia.nombre)} ({materia.id})
                                </h5>
                                <p className="text-medium-emphasis mb-0 small">
                                    {materia.docente_apellido}, {materia.docente_nombre}
                                </p>
                            </div>
                            <CIcon icon={cilChevronRight} size="xl" className="text-medium-emphasis" />
                        </div>

                        <div className={`bg-${estado.color}-subtle text-${estado.color} rounded p-3 mb-4 d-flex align-items-center gap-3`}>
                            <CIcon icon={estado.icon} size="xxl" />
                            <div className="flex-grow-1 text-center">
                                <div className="fw-bold display-6" style={{ lineHeight: "1" }}>
                                    {materia.promedio_general.toFixed(1)}
                                    <span className="fs-5">/ 4.0</span>
                                </div>
                                <small className="fw-medium">{estado.label}</small>
                            </div>
                        </div>
                    </div>

                    <div className="pt-3 border-top">
                        <CRow>
                            <CCol>
                                <div className="text-medium-emphasis small text-uppercase">Tasa de Respuesta</div>
                                <div className="fw-semibold fs-5">{tasaRespuesta}%</div>
                            </CCol>
                            <CCol className="text-end">
                                <div className="text-medium-emphasis small text-uppercase">Respondieron</div>
                                <div className="fw-semibold fs-5">
                                {respondidas} / {asignadas}
                                </div>
                            </CCol>
                        </CRow>
                            </div>
                </CCardBody>
            </CCard>
        </CCol>
    );
}

export function EstadisticasCatedras() {
    const url_base = "http://127.0.0.1:8000/Dictados/PromediosDocentes";
    const [materias, setMaterias] = useState<MateriaEstadistica[]>([]);
    const [loading, setLoading] = useState(true);
    const [materiaSeleccionada, setMateriaSeleccionada] = useState<MateriaEstadistica | null>(null);

    useEffect(() => {
        fetch(url_base)
            .then(res => res.json())
            .then(data => {
                setMaterias(data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
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
        <CContainer fluid className="py-4">
            <div className="mb-4">
                <h2 className="fw-bold">Evaluación de Cátedras</h2>
                <p className="text-medium-emphasis">
                    Cuatrimestre {cuatrimestre}
                </p>
            </div>

            <CCard className="mb-4">
                <CCardBody>
                    <CRow className="text-center">
                        <CCol md={4}>
                            <div className="text-medium-emphasis small text-uppercase">Total Cátedras</div>
                            <div className="fs-4 fw-semibold">{totalCatedras}</div>
                        </CCol>
                        <CCol md={4}>
                            <div className="text-medium-emphasis small text-uppercase">Promedio General</div>
                            <div className="fs-4 fw-semibold text-primary">{promedioGeneral}</div>
                        </CCol>
                        <CCol md={4}>
                            <div className="text-medium-emphasis small text-uppercase">Requieren Atención</div>
                            <div className="fs-4 fw-semibold text-danger">{requierenAtencion}</div>
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-semibold mb-0">
                    Cátedras (ordenadas por prioridad de atención)
                </h4>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <CSpinner />
                    <p className="mt-2">Cargando estadísticas de cátedras...</p>
                </div>
            ) : (
                <CRow className="g-4">
                    {materiasOrdenadas.map(materia => (
                        <CardMateria
                            key={materia.id}
                            materia={materia}
                            onClick={() => setMateriaSeleccionada(materia)} />
                    ))}
                </CRow>
            )}
        </CContainer>
    );
}
