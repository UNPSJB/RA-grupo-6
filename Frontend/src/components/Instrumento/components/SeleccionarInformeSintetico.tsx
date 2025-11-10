import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, ListGroup, Button, Spinner, Alert, Badge, Card } from "react-bootstrap";
import { capitalizarCadena } from "../../Funciones";

interface InstrumentoDepartamento {
    id: number;
    tipo: 'INFORME_SINTETICO';
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

export default function SeleccionarInformeSintetico() {
    const [informes, setInformes] = useState<InstrumentoDepartamento[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        cargarInformesSinteticos();
    }, []);

    const cargarInformesSinteticos = async () => {
        try {
            setLoading(true);
            setError(null);

           
            const usuarioActual = JSON.parse(localStorage.getItem('usuario_actual') || '{}');
            const usuarioId = usuarioActual.id || 3; 

            console.log('Cargando informes sintéticos para usuario:', usuarioId);
           
            const response = await fetch(
                `http://127.0.0.1:8000/instrumentos/INFORME_SINTETICO?usuario_id=${usuarioId}&mostrar_respondidos=false`
            );
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.detail || `Error ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            console.log('Informes sintéticos recibidos:', data);
            
            setInformes(Array.isArray(data) ? data : []);
            
            if (!Array.isArray(data) || data.length === 0) {
                setMensaje('No se encontraron informes sintéticos pendientes.');
            }
            
        } catch (err: any) {
            setError(err.message);
            console.error("Error cargando informes sintéticos:", err);
            setMensaje("Error al cargar los informes sintéticos");
        } finally {
            setLoading(false);
        }
    };

    const handleSeleccionarInforme = (informe: InstrumentoDepartamento) => {
        console.log('Informe sintético seleccionado:', informe);
        
        
        navigate(`/responder-instrumento/${informe.id}`, {
            state: {
                materiaNombre: informe.materia.nombre,
                materiaId: informe.materia.id,
                rol: 'departamento'
            }
        });
    };

    const estaActivo = (instrumento: InstrumentoDepartamento) => {
        const hoy = new Date();
        return new Date(instrumento.fecha_inicio) <= hoy && 
               new Date(instrumento.fecha_cierre) >= hoy;
    };

    if (loading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" role="status" className="mb-3" />
                <p>Cargando informes sintéticos disponibles...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                    <div className="mt-3">
                        <Button variant="outline-danger" onClick={cargarInformesSinteticos}>
                            Reintentar
                        </Button>
                    </div>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <Card className="border-0 shadow-sm w-100" style={{borderRadius: "1rem"}}>
                        <Card.Body className="p-4 p-md-5">
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <h1 className="fw-bold mb-2">Informes Sintéticos Pendientes</h1>
                                        <p className="text-muted mb-0">
                                            Selecciona un informe sintético para completar.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {mensaje && (
                                <Alert variant={mensaje.includes('Error') ? 'warning' : 'info'} className="mb-4">
                                    {mensaje}
                                </Alert>
                            )}

                           {informes.length > 0 ? (
                                <ListGroup variant="flush">
                                    {informes.map((informe) => {
                                        const activo = estaActivo(informe);
                                        return (
                                            <ListGroup.Item 
                                                key={informe.id} 
                                                action 
                                                onClick={() => activo && handleSeleccionarInforme(informe)}
                                                className="d-flex justify-content-between align-items-center p-4"
                                                style={{ 
                                                    cursor: activo ? 'pointer' : 'not-allowed',
                                                    borderBottom: '1px solid #e9ecef',
                                                }}
                                            >
                                                <div className="flex-grow-1">
                                                    <div className="fw-bold fs-5 mb-1">
                                                        {capitalizarCadena(informe.materia.nombre)}
                                                    </div>
                                                    <div className="d-flex align-items-center gap-3">
                                                        <small className="text-muted">
                                                            Código: {informe.materia.id}
                                                        </small>
                                                        {activo ? (
                                                            <>
                                                                <Badge bg="success" className="ms-2">
                                                                   Informe Activo
                                                                </Badge>
                                                                <small className="text-muted">
                                                                    Vence: {new Date(informe.fecha_cierre).toLocaleDateString()}
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
                                                            handleSeleccionarInforme(informe);
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
                                    <h5 className="text-muted mb-3">No hay informes sintéticos pendientes</h5>
                                    <p className="text-muted">
                                        No se encontraron informes sintéticos pendientes para completar.
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