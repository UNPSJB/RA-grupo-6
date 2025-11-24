import { GraficoRespondidos } from "../Graficos/GraficoRespondidos";
import { useEffect, useState } from "react";
import { CAlert, CButton, CCard, CCardBody, CCardHeader, CCol, CContainer, CRow } from "@coreui/react";
import ShadowedCard from "../coreui-components/ShadowedCard";


export interface EstadisticaBase {
    asignados: number;
    respondidos: number;
    no_respondidos: number;
    carrera_nombre?: string;
    materia_nombre?: string;
    anio?: number;
    carrera_id?: number;
    departamento_id?: number;
    departamento_nombre?: string;
}
export interface EstadisticasDepartamento {
    [key: string]: EstadisticaBase;
}
export interface EstadisticaDetallada extends EstadisticaBase {
    instrumento_id: number;
    materia_id: string;
    fecha_inicio: string;
    fecha_cierre: string;
}

export function MostrarEstadisticasDepartamento({departamento_id} : {departamento_id:number}) {


    const [estadisticasDetalladas, setEstadisticasDetalladas] = useState<EstadisticaDetallada[]>([]);


    const [vistaActiva, setVistaActiva] = useState<string>('carrera');
    const [cargando, setCargando] = useState(false);


    useEffect(() => {
        if (departamento_id) {
            cargarEstadisticas();
        } 
    }, [departamento_id]);


    const cargarEstadisticas = async () => {
        if (!departamento_id) return;
        
        setCargando(true);
        try {
            const baseUrl = "http://127.0.0.1:8000/Dictados";
            const departamentoParam = `?departamento_id=${departamento_id}`;
            
            const [resCarrera, resAnio, resDetalladas] = await Promise.all([
                fetch(`${baseUrl}/EstadisticasPorCarrera${departamentoParam}`),
                fetch(`${baseUrl}/EstadisticasPorAnio${departamentoParam}`),
                fetch(`${baseUrl}/EstadisticasDetalladas${departamentoParam}`)
            ]);

            const dataDetalladas = await resDetalladas.json();

            setEstadisticasDetalladas(dataDetalladas.detallado || []);

        } catch (error) {
            console.error('Error cargando estadísticas:', error);
            setEstadisticasDetalladas([]);
        } finally {
            setCargando(false);
        }
    };


    const datosAgrupadosPorCarrera = estadisticasDetalladas.reduce((acc, item) => {
        const key = item.carrera_id?.toString();
        if(key != undefined){
            if (!acc[key]) {
                acc[key] = {
                    asignados: 0,
                    respondidos: 0,
                    no_respondidos: 0,
                    carrera_nombre: item.carrera_nombre,
                    carrera_id: item.carrera_id
                };
            }
            acc[key].asignados += item.asignados;
            acc[key].respondidos += item.respondidos;
            acc[key].no_respondidos += item.no_respondidos;
        }
        return acc;
    }, {} as EstadisticasDepartamento);

    const datosAgrupadosPorAnio = estadisticasDetalladas.reduce((acc, item) => {
        const key = item.anio?.toString();
        if (key != undefined) {
            if (!acc[key]) {
                acc[key] = {
                    asignados: 0,
                    respondidos: 0,
                    no_respondidos: 0,
                    anio: item.anio
                };
            }
            acc[key].asignados += item.asignados;
            acc[key].respondidos += item.respondidos;
            acc[key].no_respondidos += item.no_respondidos;
        }
        return acc;
    }, {} as EstadisticasDepartamento);


    const renderTarjetaEstadistica = (titulo: string, stats: EstadisticaBase, key: string) => (
        <CCol lg={4} md={6} xs={12} key={key} className="d-flex justify-content-center mb-2">
            <CCard className="shadow-none" style={{width: '100%', maxWidth: '400px'}}>
                <CCardHeader className="text-center py-2">
                    <h6 className="mb-0 fw-bold">{titulo}</h6>
                </CCardHeader>
                <div className="d-flex justify-content-center align-items-center" style={{minHeight: '200px'}}>
                    <GraficoRespondidos 
                        titulo="" 
                        respondidos={stats.respondidos} 
                        noRespondidos={stats.no_respondidos} 
                    />
                </div>
                <hr style={{margin: '0'}} />
                <CCardBody style={{padding: '10px'}}>
                    <CRow>
                        <CCol className="text-center">
                            <p className="mb-0">
                                <span className="fw-bold text-success d-block" style={{fontSize: '20px'}}>
                                    {stats.respondidos}
                                </span>
                                <small>Respondidos</small>
                            </p>
                        </CCol>
                        <CCol className="text-center">
                            <p className="mb-0">
                                <span className="fw-bold text-danger d-block" style={{fontSize: '20px'}}>
                                    {stats.no_respondidos}
                                </span>
                                <small>Sin responder</small>
                            </p>
                        </CCol>
                        <CCol className="text-center">
                            <p className="mb-0">
                                <span className="fw-bold d-block" style={{fontSize: '20px'}}>
                                    {stats.asignados}
                                </span>
                                <small>Total</small>
                            </p>
                        </CCol>
                    </CRow>
                    {stats.asignados > 0 && (
                        <CRow className="mt-2">
                            <CCol>
                                <p className="mb-0 text-center">
                                    <hr style={{margin: '8px 0'}}/>
                                    <span className="fw-bold text-secondary d-block" style={{fontSize: '16px'}}>
                                        {((stats.respondidos / stats.asignados) * 100).toFixed(1)}%
                                    </span>
                                    <small className="text-muted">Tasa de respuesta</small>
                                </p>
                            </CCol>
                        </CRow>
                    )}
                </CCardBody>
            </CCard>
        </CCol>
    );

    return (
        <CContainer className="py-4">
            <ShadowedCard className="mb-4">
                <CCardHeader>
                    <div className="m-2">
                        <h4 className="mb-2">Estadísticas de Respuestas</h4>
                        <p className="text-medium-emphasis mb-0">
                            Visualiza las tasas de respuesta por carrera, materia y año
                        </p>
                    </div>
                </CCardHeader>
                <CCardBody className="py-3">
                    <CRow className="g-2">
                        {["carrera", "detallada", "anio"].map((v) => (
                            <CCol sm={4} key={v}>
                                <CButton
                                    color="primary"
                                    variant={vistaActiva === v ? undefined : "outline"}
                                    onClick={() => setVistaActiva(v)}
                                    className="w-100 text-truncate"
                                >
                                    {v === "carrera" ? "Carreras" : v === "anio" ? "Años" : "Materias"}
                                </CButton>
                            </CCol>
                        ))}
                    </CRow>
                </CCardBody>
            </ShadowedCard>


            {!departamento_id ? (
                <CAlert color="warning" className="text-center py-4">
                    <h5>Seleccione un departamento para comenzar</h5>
                    <p className="mb-0 fs-6">
                        Elige un departamento del filtro superior para visualizar las estadísticas de encuestas.
                    </p>
                </CAlert>
            ) : vistaActiva === "carrera" ? (
                <ShadowedCard>
                    <CCardHeader>
                        <div className="m-2">
                            <h4 className="mb-0">Estadísticas por Carrera</h4>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        <CRow className="gx-3 justify-content-center">
                            {Object.entries(datosAgrupadosPorCarrera).map(([carreraId, stats]) =>
                                renderTarjetaEstadistica(
                                    stats.carrera_nombre || `Carrera ${carreraId}`, 
                                    stats, 
                                    `carrera-${carreraId}`
                                )
                            )}
                            {Object.keys(datosAgrupadosPorCarrera).length === 0 && !cargando && (
                                <CCol xs={12}>
                                    <CAlert color="info" className="text-center py-4">
                                        No hay estadísticas disponibles para los filtros aplicados.
                                    </CAlert>
                                </CCol>
                            )}
                        </CRow>
                    </CCardBody>
                </ShadowedCard>
            ) : vistaActiva === "anio" ? (
                <ShadowedCard>
                    <CCardHeader>
                        <div className="m-2">
                            <h4 className="mb-0">Estadísticas por Año</h4>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        <CRow className="gx-3 justify-content-center">
                            {Object.entries(datosAgrupadosPorAnio).map(([anio, stats]) =>
                                renderTarjetaEstadistica(`Año ${anio}`, stats, `anio-${anio}`)
                            )}
                            {Object.keys(datosAgrupadosPorAnio).length === 0 && !cargando && (
                                <CCol xs={12}>
                                    <CAlert color="info" className="text-center py-4">
                                        No hay estadísticas disponibles para los filtros aplicados.
                                    </CAlert>
                                </CCol>
                            )}
                        </CRow>
                    </CCardBody>
                </ShadowedCard>
            ) : vistaActiva === "detallada" ? (
                <ShadowedCard>
                    <CCardHeader>
                        <div className="m-2">
                            <h4 className="mb-0">Estadística Detallada por Materia</h4>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        <CRow className="gx-3 justify-content-center">
                            {estadisticasDetalladas.map((item) =>
                                renderTarjetaEstadistica(
                                    `${item.materia_nombre} - ${item.anio}`, 
                                    item, 
                                    `detalle-${item.instrumento_id}`
                                )
                            )}
                            {estadisticasDetalladas.length === 0 && !cargando && (
                                <CCol xs={12}>
                                    <CAlert color="info" className="text-center py-4">
                                        No hay estadísticas disponibles para los filtros aplicados.
                                    </CAlert>
                                </CCol>
                            )}
                        </CRow>
                    </CCardBody>
                </ShadowedCard>
            ) : null}
        </CContainer>
    );
}