import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, ListGroup, Badge, Spinner, Alert } from 'react-bootstrap';

interface InstrumentoDocente {
    id: number;
    tipo: 'INFORME_CATEDRA';
    nombre: string;
    materia: {
        id: string;
        nombre: string;
    };
    fecha_inicio: string;
    fecha_cierre: string;
    plantilla_formulario: {
        id: number;
        titulo: string;
    };
}

function InstrumentosDocente() {
    const [instrumentos, setInstrumentos] = useState<InstrumentoDocente[]>([]);
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const cargarInstrumentosDocente = async () => {
            try {
                // Cargar solo informes de cátedra para docentes
                const response = await fetch('http://127.0.0.1:8000/instrumentos/INFORME_CATEDRA');
                
                if (!response.ok) {
                    throw new Error('Error al cargar informes de cátedra');
                }

                const instrumentosData = await response.json();
                setInstrumentos(instrumentosData);
                setCargando(false);
                
            } catch (error) {
                console.error('Error:', error);
                setMensaje('Error de conexión al cargar los informes de cátedra');
                setCargando(false);
            }
        };

        cargarInstrumentosDocente();
    }, []);

    const handleSeleccionarInstrumento = (instrumento: InstrumentoDocente) => {
        // Navegar para crear informe de cátedra
        navigate(`/responder-instrumento/${instrumento.id}`, {
            state: {
                materiaNombre: instrumento.materia.nombre,
                rol: 'docente'
            }
        });
    };

    if (cargando) {
        return (
            <Container className="mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <Card className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
                            <Card.Body className="p-4 p-md-5 text-center">
                                <Spinner animation="border" role="status" className="mb-3">
                                    <span className="visually-hidden">Cargando informes...</span>
                                </Spinner>
                                <p className="text-muted">Cargando informes de cátedra disponibles...</p>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <Card className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
                        <Card.Body className="p-4 p-md-5">
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <h1 className="fw-bold mb-2">Informes de Cátedra para Docentes</h1>
                                        <p className="text-muted mb-0">
                                            Selecciona un informe de cátedra para completar
                                        </p>
                                    </div>
                                    <Button 
                                        variant="outline-secondary" 
                                        size="sm"
                                        onClick={() => navigate('/seleccionar-rol')}
                                    >
                                        <i className="fas fa-arrow-left me-2"></i>
                                        Cambiar Rol
                                    </Button>
                                </div>
                            </div>
                            
                            {mensaje && (
                                <Alert variant="warning" className="mb-4">
                                    {mensaje}
                                </Alert>
                            )}
                            
                            {instrumentos.length > 0 ? (
                                <ListGroup variant="flush">
                                    {instrumentos.map((instrumento) => (
                                        <ListGroup.Item 
                                            key={instrumento.id} 
                                            action 
                                            onClick={() => handleSeleccionarInstrumento(instrumento)}
                                            className="d-flex justify-content-between align-items-center p-4"
                                            style={{ borderBottom: '1px solid #e9ecef' }}
                                        >
                                            <div className="flex-grow-1">
                                                <div className="fw-bold fs-5 mb-1">
                                                    {instrumento.plantilla_formulario.titulo}
                                                </div>
                                                <div className="d-flex align-items-center gap-3">
                                                    <small className="text-muted">
                                                        Materia: {instrumento.materia.nombre} (Código: {instrumento.materia.id})
                                                    </small>
                                                    <Badge bg="primary" className="ms-2">
                                                        Informe de Cátedra
                                                    </Badge>
                                                    <small className="text-muted">
                                                        Período: {new Date(instrumento.fecha_inicio).toLocaleDateString()} - {new Date(instrumento.fecha_cierre).toLocaleDateString()}
                                                    </small>
                                                </div>
                                            </div>
                                            
                                            <Button 
                                                variant="success"
                                                size="sm" 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSeleccionarInstrumento(instrumento);
                                                }}
                                                className="px-4 py-2"
                                            >
                                                <i className="fas fa-edit me-2"></i>
                                                Completar Informe
                                            </Button>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <div className="text-center py-5">
                                    <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                                    <h5 className="text-muted mb-3">No hay informes de cátedra disponibles</h5>
                                    <p className="text-muted">
                                        No se encontraron informes de cátedra pendientes.
                                    </p>
                                    <Button 
                                        variant="outline-primary"
                                        onClick={() => navigate('/seleccionar-rol')}
                                    >
                                        Volver a Selección de Rol
                                    </Button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </Container>
    );
}

export default InstrumentosDocente;