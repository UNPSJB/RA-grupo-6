import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, ListGroup, Badge, Spinner, Alert } from 'react-bootstrap';
import Menu from '../Menu';

interface Materia {
    id: string;
    nombre: string;
    tieneEncuestaActiva?: boolean;
    instrumentoId?: number;
    formularioId?: number;
}

function SeleccionarMateria() {
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Cargar materias del usuario/alumno
        fetch('http://127.0.0.1:8000/materias/')
            .then(response => {
                if (!response.ok) throw new Error('Error cargando materias');
                return response.json();
            })
            .then(async (data: Materia[]) => {

                // Asumo que todas las materias tienen encuesta activa

                const materiasConEstado = data.map(materia => ({
                    ...materia,
                    tieneEncuestaActiva: true,
                    instrumentoId: Math.floor(Math.random() * 100) + 1, // id simulado
                    formularioId: Math.floor(Math.random() * 100) + 1   // id simulado
                }));
                
                setMaterias(materiasConEstado);
                setCargando(false);
            })
            .catch(error => {
                console.error('Error:', error);
                setMensaje('Error de conexión al cargar materias');

                // Datos de ejemplo
                setMaterias([
                    { 
                        id: "IF001", 
                        nombre: "Elementos de Informática",
                        tieneEncuestaActiva: true,
                        instrumentoId: 1,
                        formularioId: 1
                    },
                    { 
                        id: "MA045", 
                        nombre: "Álgebra",
                        tieneEncuestaActiva: true,
                        instrumentoId: 2,
                        formularioId: 1
                    },
                    { 
                        id: "IF002", 
                        nombre: "Expresión de Problemas y Algoritmos",
                        tieneEncuestaActiva: true,
                        instrumentoId: 3,
                        formularioId: 1
                    },
                ]);
                setCargando(false);
            });
    }, []);

    const handleResponderEncuesta = (materiaId: string, materiaNombre: string, instrumentoId?: number, formularioId?: number) => {
        if (!instrumentoId || !formularioId) {
            setMensaje('No hay encuesta activa para esta materia');
            return;
        }
        
        // Navegar a la encuesta
        navigate(`/responder-encuesta/${instrumentoId}/${formularioId}`, { 
            state: { 
                materiaId, 
                materiaNombre,
                redirectTo: '/alumno'
            } 
        });
    };

    if (cargando) {
        return (
            <>
                <Menu />
                <div className="container mt-4">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <Card className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
                                <Card.Body className="p-4 p-md-5 text-center">
                                    <Spinner animation="border" role="status" className="mb-3">
                                        <span className="visually-hidden">Cargando materias...</span>
                                    </Spinner>
                                    <p className="text-muted">Cargando materias...</p>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Menu />
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <Card className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
                            <Card.Body className="p-4 p-md-5">
                                <div className="mb-5 text-center text-md-start">
                                    <h1 className="fw-bold mb-2">Materias Cursadas</h1>
                                    <p className="text-muted mb-0">
                                        Selecciona una materia para responder la encuesta.
                                    </p>
                                </div>
                                
                                {mensaje && (
                                    <Alert variant={mensaje.includes('Error') ? 'warning' : 'info'} className="mb-4">
                                        {mensaje}
                                    </Alert>
                                )}
                                
                                {materias.length > 0 ? (
                                    <ListGroup variant="flush">
                                        {materias.map((materia) => (
                                            <ListGroup.Item 
                                                key={materia.id} 
                                                action 
                                                onClick={() => materia.tieneEncuestaActiva && handleResponderEncuesta(
                                                    materia.id, 
                                                    materia.nombre, 
                                                    materia.instrumentoId, 
                                                    materia.formularioId
                                                )}
                                                className="d-flex justify-content-between align-items-center p-3"
                                                style={{ cursor: materia.tieneEncuestaActiva ? 'pointer' : 'not-allowed' }}
                                            >
                                                <div className="flex-grow-1">
                                                    <div className="fw-bold">{materia.nombre}</div>
                                                    <small className="text-muted">
                                                        Código: {materia.id} 
                                                        {materia.tieneEncuestaActiva && (
                                                            <Badge bg="success" className="ms-2">
                                                                Encuesta Activa
                                                            </Badge>
                                                        )}
                                                    </small>
                                                </div>
                                                
                                                {materia.tieneEncuestaActiva ? (
                                                    <Button 
                                                        variant="outline-primary"
                                                        size="sm" 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleResponderEncuesta(
                                                                materia.id, 
                                                                materia.nombre, 
                                                                materia.instrumentoId, 
                                                                materia.formularioId
                                                            );
                                                        }}
                                                    >
                                                        Responder Encuesta
                                                    </Button>
                                                ) : (
                                                    <Button 
                                                        variant="outline-secondary" 
                                                        size="sm"
                                                        disabled
                                                    >
                                                        Sin Encuesta
                                                    </Button>
                                                )}
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                ) : (
                                    <p className="text-center text-muted fst-italic py-5">
                                        No hay encuestas disponibles en este momento.
                                    </p>
                                )}
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SeleccionarMateria;