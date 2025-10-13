import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, ListGroup, Badge, Spinner, Alert, Container } from 'react-bootstrap';

interface Materia {
    id: string;
    nombre: string;
    tieneEncuestaActiva?: boolean;
    instrumentoId?: number;
    plantillaFormularioId?: number;
    fechaCierre?: string;
}

function SeleccionarMateria() {
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const cargarMateriasConEncuestas = async () => {
            try {
                // Obtener instrumentos de tipo ENCUESTA_ESTUDIANTE
                const response = await fetch('http://127.0.0.1:8000/instrumentos/ENCUESTA_ESTUDIANTE');
                
                if (!response.ok) {
                    throw new Error('Error al cargar encuestas');
                }
                
                const instrumentos = await response.json();
                
                // Mapear instrumentos a materias con encuesta activa
                // Revisar
                const materiasConEncuesta = instrumentos.map((instrumento: any) => ({
                    id: instrumento.materia.id,
                    nombre: instrumento.materia.nombre,
                    tieneEncuestaActiva: true,
                    instrumentoId: instrumento.id,
                    plantillaFormularioId: instrumento.plantilla_formulario.id,
                    fechaCierre: instrumento.fecha_cierre //??
                }));
                
                setMaterias(materiasConEncuesta);
                setCargando(false);
                
            } catch (error) {
                console.error('Error:', error);
                setMensaje('Error de conexión al cargar las encuestas activas');
                
                // Datos de ejemplo si el endpoint falla
                setMaterias([
                    { 
                        id: "IF001", 
                        nombre: "Elementos de Informática",
                        tieneEncuestaActiva: true,
                        instrumentoId: 1,
                        plantillaFormularioId: 1
                    },
                    { 
                        id: "MA045", 
                        nombre: "Álgebra",
                        tieneEncuestaActiva: true,
                        instrumentoId: 2,
                        plantillaFormularioId: 1
                    }
                ]);
                setCargando(false);
            }
        };

        cargarMateriasConEncuestas();
    }, []);

    const handleResponderEncuesta = (materia: Materia) => {
        if (!materia.instrumentoId) {
            setMensaje('No hay encuesta activa para esta materia');
            return;
        }
        
        // Navegar al instrumento para responder encuesta
        navigate(`/responder-instrumento/${materia.instrumentoId}`, { 
            state: { 
                materiaNombre: materia.nombre,
                materiaId: materia.id
            } 
        });
    };

    if (cargando) {
        return (
            <>
                <Container className="mt-4">
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
                </Container>
            </>
        );
    }

    return (
        <>
            <Container className="mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <Card className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
                            <Card.Body className="p-4 p-md-5">
                                <div className="mb-5 text-center">
                                    <h1 className="fw-bold mb-2">Materias Cursadas</h1>
                                    <p className="text-muted mb-0">
                                        Selecciona una materia para responder la encuesta correspondiente
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
                                                onClick={() => materia.tieneEncuestaActiva && handleResponderEncuesta(materia)}
                                                className="d-flex justify-content-between align-items-center p-4"
                                                style={{ 
                                                    cursor: materia.tieneEncuestaActiva ? 'pointer' : 'not-allowed',
                                                    borderBottom: '1px solid #e9ecef'
                                                }}
                                            >
                                                <div className="flex-grow-1">
                                                    <div className="fw-bold fs-5 mb-1">{materia.nombre}</div>
                                                    <div className="d-flex align-items-center gap-3">
                                                        <small className="text-muted">
                                                            Código: {materia.id} 
                                                        </small>
                                                        {materia.tieneEncuestaActiva && (
                                                            <>
                                                                <Badge bg="success" className="ms-2">
                                                                    Encuesta Activa
                                                                </Badge>
                                                                <small className="text-muted">
                                                                    Vence: {new Date(materia.fechaCierre!).toLocaleDateString()}
                                                                </small>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {materia.tieneEncuestaActiva ? (
                                                    <Button 
                                                        variant="primary"
                                                        size="sm" 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleResponderEncuesta(materia, );
                                                        }}
                                                        className="px-4 py-2"
                                                    >
                                                        <i className="fas fa-edit me-2"></i>
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

export default SeleccionarMateria;