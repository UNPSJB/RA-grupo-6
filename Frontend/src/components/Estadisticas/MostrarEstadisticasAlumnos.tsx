import { useEffect, useState } from "react";
import { CCol, CRow, CCardBody, CCardHeader, CSpinner, CAlert } from "@coreui/react";
import { CardCantRespondidos } from "./CardCantRespondidos";
import ShadowedCard from "../coreui-components/ShadowedCard";
import CIcon from "@coreui/icons-react";
import { cilChartLine } from "@coreui/icons";
import type { Usuario } from "../types";


function MostrarCardEstadisticas(estadisticas: any[]){
    
    let filas = []

    for(let i = 0; i < estadisticas.length; i += 2){

        const primerElemento = estadisticas[i];
        const segundoElemento = i + 1 < estadisticas.length? estadisticas[i + 1] : null
        
        filas.push(
            <CRow className="g-3 mb-3" key={i}> 
                <CCol md={6} className="d-flex align-items-stretch">
                    <CardCantRespondidos 
                        titulo={primerElemento.Materia} 
                        totalesAsignadas={primerElemento.Asignados} 
                        totalesRespondidos={primerElemento.Respondidos}
                    />
                </CCol>
                {segundoElemento &&
                <CCol md={6} className="d-flex align-items-stretch">
                    <CardCantRespondidos 
                        titulo={segundoElemento.Materia} 
                        totalesAsignadas={segundoElemento.Asignados} 
                        totalesRespondidos={segundoElemento.Respondidos}
                    />
                </CCol>
                }
            </CRow>
        )
    }
    return filas
}

export function MostrarEstadisticasAlumnos(){

    const [estadisticas, setEstadisticas] = useState<[]>([]);
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [cargando, setCargando] = useState(true);
    const [mensajeError, setMensajeError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("http://localhost:8000/users/me", {
                    credentials: 'include' 
                });
                
                if (!response.ok) {
                    throw new Error("No se pudo obtener la información del usuario autenticado.");
                }
                
                const data: Usuario = await response.json();
                setUsuario(data);
            } catch (error: any) {
                console.error("Error al obtener usuario:", error);
                setMensajeError("Error al cargar la información del docente: " + error.message);
                setCargando(false);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (!usuario) return; 

        const url_base = `http://127.0.0.1:8000/instrumentos/ObtenerTasaRespuestasDocente/${usuario.id}`;

        const fetchEstadisticas = async () => {
            setCargando(true);
            setMensajeError('');
            try {
                const response = await fetch(url_base, {
                    credentials: 'include' 
                });
                
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: No se pudieron cargar las estadísticas.`);
                }
                
                const data: EstadisticaMateria[] = await response.json();
                setEstadisticas(data);
            } catch (error: any) {
                console.error("Error al obtener estadísticas:", error);
                setMensajeError("Error al cargar las estadísticas: " + error.message);
            } finally {
                setCargando(false);
            }
        };
        
        fetchEstadisticas();
    }, [usuario]); 

    if (cargando) {
        return (
            <ShadowedCard className="text-center">
                <CCardBody className="p-5">
                    <CSpinner color="primary" className="mb-3" />
                    <p className="text-medium-emphasis">Cargando estadísticas...</p>
                </CCardBody>
            </ShadowedCard>
        );
    }
    
    if (mensajeError && !usuario) {
        return (
            <CAlert color="danger" className="text-center">
                {mensajeError}
            </CAlert>
        );
    }

    return(
        <ShadowedCard>
            <CCardHeader>
                <div className="m-2">
                    <h4>Tasa de Respuestas por cada materia</h4>
                    <p className="text-medium-emphasis">
                        Visualiza las tasas de respuesta por cada materia dictada
                    </p>
                </div>
            </CCardHeader>
            <CCardBody>
                {mensajeError && (
                    <CAlert color="warning" className="mb-4">
                        {mensajeError}
                    </CAlert>
                )}

                <CRow className="g-4 justify-content-center">
                    {estadisticas.length === 0 ? (
                        <div className="text-center m-4 text-medium-emphasis m-5">
                            <CIcon icon={cilChartLine} size="xl" className="mb-2" />
                            <p className="fw-bold mb-0">
                                No hay estadísticas disponibles para mostrar.
                            </p>
                        </div>
                    ) : (
                        MostrarCardEstadisticas(estadisticas)
                    )} 
                </CRow>
            </CCardBody>
        </ShadowedCard>
    )
}