import { useState, useEffect, type ChangeEvent } from 'react';
import { Card, ListGroup, Container } from 'react-bootstrap';
import type { TypeRespuestasFormulario, Usuario } from '../types';
import { Link } from 'react-router-dom';

export function SeleccionarRespuestasFormularios( {usuario_id} : { usuario_id : number}) {
    
    const url_base = `http://127.0.0.1:8000/usuarios/${usuario_id}`
    const [respuestasFormularios, setRespuestasFormularios] = useState<TypeRespuestasFormulario[]>([])
    const [respuestaFormularioFiltrado, setRespuestaFormularioFiltrado ] = useState<TypeRespuestasFormulario[]>([])

    const buscar = (e: ChangeEvent<HTMLInputElement>) =>{
        let busqueda = e.target.value
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
        .then((data : Usuario) =>{setRespuestasFormularios(data.respuestas_formulario)}) 
        .catch((err) => console.log(err))

    }, [])

    useEffect(()=>{
        setRespuestaFormularioFiltrado(respuestasFormularios)
    }, [respuestasFormularios])
        
    return (
        <>
            <Container className="mt-4">
                <div className="row justify-content-center ">
                    <div className="col-md-10">
                        <Card className="border-0 shadow-sm w-100 " style={{ borderRadius: "1rem" }}>
                            <Card.Body className="p-4 p-md-5">
                                <div className="mb-5 text-center">
                                    <h1 className="fw-bold mb-2"> Formularios completados </h1>
                                    <p className="text-muted mb-0">
                                        Seleccione un formulario para visualizar sus respuestas
                                    </p>
                                    <input type="search"  placeholder="Buscar formulario..." onChange={buscar} className='w-100 bg-transparent rounded border p-2 mt-3' style={{color: "black"}} />
                                </div>

                            {respuestasFormularios.length > 0 ? (
                                    <ListGroup variant="flush">
                                        {respuestaFormularioFiltrado.map((respuestaFormulario) => (
                                            <ListGroup.Item key={respuestaFormulario.id} className="d-flex justify-content-between align-items-center p-4 border rounded mb-3">
                                                <div className="flex-grow-1">
                                                    <div className="fw-bold fs-5 mb-1">{respuestaFormulario.materia.nombre}</div>
                                                    <div className="d-flex align-items-center gap-3">
                                                        <small className="text-muted">
                                                            Código: {respuestaFormulario.materia.id} 
                                                        </small>
                                                        <small className="text-muted">
                                                            Respondida: {new Date(respuestaFormulario.fecha_envio!).toLocaleDateString()}
                                                        </small>
                                                    </div>
                                                </div>

                                                <Link to={`/RespuestaFormulario/${respuestaFormulario.id}`}>
                                                    Ver respuestas
                                                </Link>

                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                ) : (
                                    <div className="text-center py-5">
                                        <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                                        <h5 className="text-muted mb-3">No hay formularios respondidos</h5>
                                        <p className="text-muted">
                                            No se encontraron respuestas a formularios.
                                        </p>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </Container>
        </>
    );
}

export default SeleccionarRespuestasFormularios;