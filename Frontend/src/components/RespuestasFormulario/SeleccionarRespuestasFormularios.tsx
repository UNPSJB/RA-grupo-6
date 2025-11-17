import { useState, useEffect, type ChangeEvent } from 'react';
import { Card, ListGroup, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { capitalizarCadena } from "../Funciones";
import { CCard, CCardBody, CCardHeader, CContainer, CFormInput, CFormLabel, CListGroup, CListGroupItem } from '@coreui/react';
import ShadowedCard from '../Estadisticas/ShadowedCard';

export interface Respuestas {
    id: number;
    pregunta_id: number;
    opcion_id: number;
    texto_respuesta: string;
    
}

export interface RespuestasFormularios{
    respuesta_formulario: {
        id: number;
        fecha_envio: string;
        instrumento_id: number;
        usuario_id: number;
        respuestas: Respuestas[];
    };
    materia: {
        id: string;
        nombre: string;
    };
}


export function SeleccionarRespuestasFormularios( {usuario_id} : { usuario_id : number}) {
    
    const url_base = `http://127.0.0.1:8000/api/usuarios/${usuario_id}`
    const [respuestasFormularios, setRespuestasFormularios] = useState<RespuestasFormularios[]>([])
    const [respuestaFormularioFiltrado, setRespuestaFormularioFiltrado ] = useState<RespuestasFormularios[]>([])

    const buscar = (e: ChangeEvent<HTMLInputElement>) =>{
        const busqueda = e.target.value
        let coincidencias

        if (busqueda != ""){
            
            coincidencias = respuestasFormularios.filter((respuestaFormularios) => respuestaFormularios.materia.nombre.toLowerCase().includes(busqueda.toLowerCase()))
            
            if (coincidencias.length == 0){
                coincidencias = respuestasFormularios.filter((respuestaFormularios) => respuestaFormularios.materia.id.toLowerCase().includes(busqueda.toLowerCase()))
            }
        }
        if(!coincidencias){
            coincidencias = respuestasFormularios
        }
        setRespuestaFormularioFiltrado(coincidencias)
    }

    useEffect(()=>{
        fetch(url_base)
        .then((response) => response.json())
        .then((data ) =>{setRespuestasFormularios(data)}) 
        .catch((err) => console.log(err))

    },[url_base] )

    useEffect(()=>{
        setRespuestaFormularioFiltrado(respuestasFormularios)
    }, [respuestasFormularios])
        
    return (
        <>
        <ShadowedCard >
            <CCardHeader>
                <div className="m-2">
                    <h4> Formularios completados </h4>
                    <p className="text-medium-emphasis mb-0">
                        Seleccione un formulario para visualizar sus respuestas
                    </p>
                    
                </div>
            </CCardHeader>
            <CCardBody >
            <CFormLabel className="fw-semibold">
                Buscar formulario
            </CFormLabel>
            {/* VER SI ESTA BIEN EL CRITERIO DE BUSQUEDA DEL PLACEHOLDER */}
            <CFormInput type="search"  placeholder="Ingrese el nombre de la materia o el código..." onChange={buscar}  />
                

            {respuestasFormularios.length > 0 ? (
                    <CListGroup variant="flush">
                        {respuestaFormularioFiltrado.map((respuestaFormulario) => (
                            <CListGroupItem key={respuestaFormulario.respuesta_formulario.id} className="d-flex justify-content-between align-items-center p-4 border rounded mb-3">
                                <div className="flex-grow-1">
                                    <div className="fw-bold fs-5 mb-1">{capitalizarCadena(respuestaFormulario.materia.nombre)}</div>
                                    <div className="d-flex align-items-center gap-3">
                                        <small className="text-muted">
                                            Código: {respuestaFormulario.materia.id} 
                                        </small>
                                        <small className="text-muted">
                                            Respondida: {new Date(respuestaFormulario.respuesta_formulario.fecha_envio!).toLocaleDateString()}
                                        </small>
                                    </div>
                                </div>

                                <Link to={`/RespuestaFormulario/${respuestaFormulario.respuesta_formulario.id}`}>
                                    Ver respuestas
                                </Link>

                            </CListGroupItem>
                        ))}
                    </CListGroup>
                ) : (
                    <div className="text-center py-5">
                        <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                        <h5 className="text-muted mb-3">No hay formularios respondidos</h5>
                        <p className="text-muted">
                            No se encontraron respuestas a formularios.
                        </p>
                    </div>
                )}
            </CCardBody>
        </ShadowedCard>
        </>
    );
}

export default SeleccionarRespuestasFormularios;