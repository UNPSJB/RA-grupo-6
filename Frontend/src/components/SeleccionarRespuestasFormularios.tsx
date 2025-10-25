import { useState, useEffect } from 'react';
import { Card, Button, ListGroup, Container } from 'react-bootstrap';
import type { TypeRespuestasFormulario, Usuario } from './types';
import { RespuestasFormulario } from './RespuestasFormulario/RespuestasFormulario';

export function SeleccionarRespuestasFormularios( {usuario_id} : { usuario_id : number}) {

    const url_base = `http://127.0.0.1:8000/usuarios/${usuario_id}`
    const [respuestasFormularios, setRespuestasFormularios] = useState<TypeRespuestasFormulario[]>([])

    useEffect(()=>{
        fetch(url_base)
        .then((response) => response.json())
        .then((data : Usuario) =>{setRespuestasFormularios(data.respuestas_formulario)}) 
        .catch((err) => console.log(err))

    }, [])

    return (
        <>
            <Container className="mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <Card className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
                            <Card.Body className="p-4 p-md-5">
                                <div className="mb-5 text-center">
                                    <h1 className="fw-bold mb-2"> Formularios completados </h1>
                                    <p className="text-muted mb-0">
                                        Seleccione un formulario para visualizar sus respuestas
                                    </p>
                                </div>

                            {respuestasFormularios.length > 0 ? (
                                    <ListGroup variant="flush">
                                        {respuestasFormularios.map((respuestaFormulario) => (
                                            <ListGroup.Item key={respuestaFormulario.id} className="d-flex justify-content-between align-items-center p-4 border rounded">
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
                                                
                                                <Button 
                                                    variant="primary"
                                                    size="sm" 
                                                    onClick={() => window.location.href = "http://localhost:5173/respuestaFormulario" }
                                                    className="px-4 py-2"
                                                >
                                                    Ver respuestas
                                                </Button>

                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                ) : (
                                    <div className="text-center py-5">
                                        <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                                        <h5 className="text-muted mb-3">No hay encuestas disponibles</h5>
                                        <p className="text-muted">
                                            No se encontraron encuestas pendientes para tus materias cursadas.
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