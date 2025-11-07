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

// Usuario para DepartamentoAlumnos (Lucy)
const USUARIO_DEPARTAMENTO_ALUMNOS = {
    id: 3,
    nombre: "Lucy",
    apellido: "Marticoneta", 
    rol: 'departamento_alumnos'
};

// Mock data temporal
const mockInformesSinteticosPendientes: InstrumentoDepartamento[] = [ // Revisar InformeSinteticoList
    {
        id: 201,
        tipo: 'INFORME_SINTETICO',
        fecha_inicio: '2024-01-01',
        fecha_cierre: '2025-10-20',
        materia: { id: 'FIS1', nombre: 'Física I' },
        plantilla_formulario: { id: 3, titulo: 'Informe de Sintetico - Física I - 2024' },
        plantilla_formulario_id: 3,
        materia_id: 'FIS1'
    },
    {
        id: 202,
        tipo: 'INFORME_SINTETICO',
        fecha_inicio: '2024-01-01', 
        fecha_cierre: '2025-10-20',
        materia: { id: 'MAT1', nombre: 'Matemática I' },
        plantilla_formulario: { id: 4, titulo: 'Informe de Sintetico - Matemática I - 2024' },
        plantilla_formulario_id: 4,
        materia_id: 'MAT1'
    }
];

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

            // TODO: Borrar el mock y descomentar el fetch
            /*
            const response = await fetch(
                `http://127.0.0.1:8000/instrumentos/INFORME_SINTETICO?usuario_id=${USUARIO_DEPARTAMENTO_ALUMNOS.id}&mostrar_respondidos=false`
            );
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.detail || `Error ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            setInformes(data);
            */

            await new Promise(resolve => setTimeout(resolve, 800));
            setInformes(mockInformesSinteticosPendientes);
            
        } catch (err: any) {
            setError(err.message);
            console.error("Error cargando informes sintéticos:", err);
            setMensaje("Error al cargar los informes sinteticos");
        } finally {
            setLoading(false);
        }
    };

    const handleSeleccionarInforme = (informe: InstrumentoDepartamento) => {
        console.log('Informe sintético seleccionado:', informe);
        
        // Navegar a responder-instrumento
        navigate(`/responder-instrumento/${informe.id}`, {
            state: {
                materiaNombre: informe.materia.nombre,
                materiaId: informe.materia.id,
                rol: 'departamento'
            }
        });
    };

    const estaActivo = (instrumento: InstrumentoDepartamento) => {
        const hoy = new Date('2025-10-20')
        return new Date(instrumento.fecha_inicio) <= new Date(hoy) && 
               new Date(instrumento.fecha_cierre) >= new Date(hoy);
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
                                    <h5 className="text-muted mb-3">No hay informes sinteticos pendientes</h5>
                                    <p className="text-muted">
                                        No se encontraron informes sinteticos pendientes para completar.
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