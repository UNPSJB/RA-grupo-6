// InstrumentosDocente.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, ListGroup, Badge, Spinner, Alert } from 'react-bootstrap';
import {capitalizarCadena} from "../Funciones";

interface InstrumentoDocente {
    id: number;
    tipo: 'INFORME_CATEDRA';
    fecha_inicio: string;
    fecha_cierre: string;
    materia: {
        id: string;
        nombre: string;
    };
    plantilla_formulario: {
        id: number;
        titulo: string;
    };
    plantilla_formulario_id: number;
    materia_id: string;
}

function InstrumentosDocente() {
    const [instrumentos, setInstrumentos] = useState<InstrumentoDocente[]>([]);
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const cargarInstrumentosDocente = async () => {
            try {
                console.log('Cargando informes de cátedra...');
                
                const url = `http://127.0.0.1:8000/instrumentos/INFORME_CATEDRA?usuario_id=${2}&mostrar_respondidos=false`;
                console.log('URL:', url);
                
                const response = await fetch(url);
                console.log('Response status:', response.status, response.statusText);
                
                if (response.ok) {
                    const instrumentosData: InstrumentoDocente[] = await response.json();
                    console.log('Datos recibidos:', instrumentosData);
                    
                    const hoy = new Date('2025-10-20')
                    const instrumentosActivos = instrumentosData.filter(instr => 
                        new Date(instr.fecha_inicio) <= new Date(hoy) && 
                        new Date(instr.fecha_cierre) >= new Date(hoy)
                    );
                    
                    console.log('Instrumentos activos:', instrumentosActivos);
                    setInstrumentos(instrumentosActivos);
                } else {
                    const errorText = await response.text();
                    console.error('Error del servidor:', errorText);
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                
                setCargando(false);
                
            } catch (error) {
                console.error('Error completo:', error);
                setMensaje(`Error al cargar los informes de cátedra: ${error.message}`);
                setCargando(false);
                
                const datosEjemplo: InstrumentoDocente[] = [
                    {
                        id: 201,
                        tipo: 'INFORME_CATEDRA',
                        fecha_inicio: '2024-01-01',
                        fecha_cierre: '2024-12-31',
                        materia: { id: 'FIS1', nombre: 'Física I' },
                        plantilla_formulario: { id: 3, titulo: 'Informe de Cátedra - Física I - 2024' },
                        plantilla_formulario_id: 3,
                        materia_id: 'FIS1'
                    },
                    {
                        id: 202,
                        tipo: 'INFORME_CATEDRA',
                        fecha_inicio: '2024-01-01', 
                        fecha_cierre: '2024-12-31',
                        materia: { id: 'MAT1', nombre: 'Matemática I' },
                        plantilla_formulario: { id: 4, titulo: 'Informe de Cátedra - Matemática I - 2024' },
                        plantilla_formulario_id: 4,
                        materia_id: 'MAT1'
                    }
                ];
                setInstrumentos(datosEjemplo);
                console.log('Usando datos de ejemplo para desarrollo');
            }
        };

        cargarInstrumentosDocente();
    }, []);

    const handleSeleccionarInstrumento = (instrumento: InstrumentoDocente) => {
        console.log('Instrumento seleccionado:', instrumento);
        navigate(`/responder-instrumento/${instrumento.id}`, {
            state: {
                materiaNombre: instrumento.materia.nombre,
                materiaId: instrumento.materia.id,
                rol: 'docente'
            }
        });
    };

    const estaActivo = (instrumento: InstrumentoDocente) => {
        const hoy = new Date('2025-10-20')
        return new Date(instrumento.fecha_inicio) <= new Date(hoy) && 
               new Date(instrumento.fecha_cierre) >= new Date(hoy);
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
                                        <h1 className="fw-bold mb-2">Informes de Cátedra Pendientes</h1>
                                        <p className="text-muted mb-0">
                                            Selecciona un informe de cátedra para completar
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {mensaje && (
                                <Alert variant={mensaje.includes('Error') ? 'warning' : 'info'} className="mb-4">
                                    {mensaje}
                                </Alert>
                            )}
                            
                            {instrumentos.length > 0 ? (
                                <ListGroup variant="flush">
                                    {instrumentos.map((instrumento) => {
                                        const activo = estaActivo(instrumento);
                                        return (
                                            <ListGroup.Item 
                                                key={instrumento.id} 
                                                action 
                                                onClick={() => activo && handleSeleccionarInstrumento(instrumento)}
                                                className="d-flex justify-content-between align-items-center p-4"
                                                style={{ 
                                                    cursor: activo ? 'pointer' : 'not-allowed',
                                                    borderBottom: '1px solid #e9ecef',
                                                }}
                                            >
                                                <div className="flex-grow-1">
                                                    <div className="fw-bold fs-5 mb-1">
                                                        {capitalizarCadena(instrumento.materia.nombre)}
                                                    </div>
                                                    <div className="d-flex align-items-center gap-3">
                                                        <small className="text-muted">
                                                            Código: {instrumento.materia.id}
                                                        </small>
                                                        {activo ? (
                                                            <>
                                                                <Badge bg="success" className="ms-2">
                                                                   Informe Activo
                                                                </Badge>
                                                                <small className="text-muted">
                                                                    Vence: {new Date(instrumento.fecha_cierre).toLocaleDateString()}
                                                                </small>
                                                            </>
                                                        ) : (
                                                            <Badge bg="secondary" className="ms-2">
                                                                Inactivo
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {activo ? (
                                                    <Button 
                                                        variant="primary"
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
                                                ) : (
                                                    <Button 
                                                        variant="outline-secondary" 
                                                        size="sm"
                                                        disabled
                                                    >
                                                        No Disponible
                                                    </Button>
                                                )}
                                            </ListGroup.Item>
                                        );
                                    })}
                                </ListGroup>
                            ) : (
                                <div className="text-center py-5">
                                    <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                                    <h5 className="text-muted mb-3">No hay informes de cátedra pendientes</h5>
                                    <p className="text-muted">
                                        No se encontraron informes de cátedra pendientes para completar.
                                    </p>
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