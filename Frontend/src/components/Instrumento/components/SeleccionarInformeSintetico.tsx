import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, ListGroup, Button, Spinner, Alert, Badge, Row, Col } from "react-bootstrap";
import type { instrumentoList } from "../types";

// Usuario para DepartamentoAlumnos (Lucy)
const USUARIO_DEPARTAMENTO_ALUMNOS = {
    id: 3,
    nombre: "Lucy",
    apellido: "Marticoneta", 
    rol: 'departamento_alumnos'
};

// Mock data temporal
const mockInformesSinteticosPendientes: instrumentoList[] = [
    {
        id: 5,
        tipo: 'INFORME_SINTETICO',
        fecha_inicio: '2025-10-01',
        fecha_cierre: '2025-10-31',
        materia: {
            id: 'IF043',
            nombre: 'INGENIERÍA DE SOFTWARE II'
        },
        plantilla_formulario: {
            id: 1,
            titulo: 'Informe Sintético - Departamento de Informática - 2C 2025'
        }
    },
    {
        id: 6,
        tipo: 'INFORME_SINTETICO',
        fecha_inicio: '2025-10-01',
        fecha_cierre: '2025-10-31',
        materia: {
            id: 'IF001',
            nombre: 'Elementos de Informatica'
        },
        plantilla_formulario: {
            id: 1,
            titulo: 'Informe Sintético - Elementos de Informática - 2C 2025'
        }
    },
    {
        id: 7,
        tipo: 'INFORME_SINTETICO',
        fecha_inicio: '2025-10-01',
        fecha_cierre: '2025-10-31',
        materia: {
            id: 'MA045',
            nombre: 'ÁLGEBRA'
        },
        plantilla_formulario: {
            id: 1,
            titulo: 'Informe Sintético - Álgebra - 2C 2025'
        }
    }
];

export default function SeleccionarInformeSintetico() {
    const [informes, setInformes] = useState<instrumentoList[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        cargarInformesSinteticos();
    }, []);

    const cargarInformesSinteticos = async () => {
        try {
            setLoading(true);
            setError(null);

            // TODO: Borrar el mock y descomentar el fetch cuando se tengan los datos de Informe Sintético
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
        } finally {
            setLoading(false);
        }
    };

    const handleSeleccionarInforme = (informe: instrumentoList) => {
        console.log('Informe sintético seleccionado:', informe);
        
        // Navegar a responder-instrumento
        navigate(`/responder-instrumento/${informe.id}`, {
            state: {
                rol: USUARIO_DEPARTAMENTO_ALUMNOS.rol,
                materiaNombre: informe.materia.nombre,
                materiaId: informe.materia.id
            }
        });
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
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="mb-2">Seleccionar Informe Sintético</h1>
                    <p className="text-muted mb-0">
                        Seleccione un informe sintético para completar.
                    </p>
                </div>
                <Badge bg="primary" className="fs-6">
                    {informes.length} disponible(s)
                </Badge>
            </div>

            {informes.length === 0 ? (
                <Alert variant="info">
                    <i className="fas fa-info-circle me-2"></i>
                    No hay informes sintéticos disponibles para completar en este momento.
                </Alert>
            ) : (
                <ListGroup variant="flush">
                    {informes.map((informe) => (
                        <ListGroup.Item 
                            key={informe.id} 
                            className="d-flex justify-content-between align-items-center p-4 border-bottom"
                            action
                            onClick={() => handleSeleccionarInforme(informe)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="flex-grow-1">
                                <div className="d-flex align-items-center mb-2">
                                    <h5 className="mb-0 me-3">{informe.plantilla_formulario.titulo}</h5>
                                    <Badge bg="primary" className="ms-2">
                                        Informe Sintético
                                    </Badge>
                                </div>
                                
                                {/* TODO: Reemplazar por datos de Informe SIntético cuando se tengan */}
                                <div className="text-muted">
                                    <Row>
                                        <Col md={6}>
                                            <small className="d-block">
                                                <strong>Materia:</strong> {informe.materia.nombre}
                                            </small>
                                        </Col>
                                        <Col md={6}>
                                            <small className="d-block">
                                                <strong>Período:</strong> {new Date(informe.fecha_inicio).toLocaleDateString()} - {new Date(informe.fecha_cierre).toLocaleDateString()}
                                            </small>
                                        </Col>
                                    </Row>
                                    <small className="d-block mt-1"> 
                                        <strong> Código materia:</strong> {informe.materia.id}
                                    </small>
                                </div>
                            </div>
                            
                            <div className="text-end ms-3">
                                <Button 
                                    variant="primary" 
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSeleccionarInforme(informe);
                                    }}
                                >
                                    Completar
                                </Button>
                                <div className="mt-1">
                                    <small className="text-muted">
                                        Vence: {new Date(informe.fecha_cierre).toLocaleDateString()}
                                    </small>
                                </div>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </Container>
    );
}