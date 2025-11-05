import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, ListGroup, Button, Spinner, Alert, Badge, Row, Col } from "react-bootstrap";
import type { InformeSinteticoList } from "../types"; // Revisar InformeSinteticoList

// Usuario para DepartamentoAlumnos (Lucy)
const USUARIO_DEPARTAMENTO_ALUMNOS = {
    id: 3,
    nombre: "Lucy",
    apellido: "Marticoneta", 
    rol: 'departamento_alumnos'
};

// Mock data temporal
const mockInformesSinteticosPendientes: InformeSinteticoList[] = [ // Revisar InformeSinteticoList
    {
        id: 123,
        titulo_formulario: "Informe Sintético - Departamento de Informática - 2C 2025",
        autor_nombre: "Lucy Marticoneta",
        fecha_completado: "" // Sin fecha = no completado (para el mock)
    },
    {
        id: 124,
        titulo_formulario: "Informe Sintético - Elementos de Informática - 2C 2025",
        autor_nombre: "Lucy Marticoneta",
        fecha_completado: ""
    },
    {
        id: 125,
        titulo_formulario: "Informe Sintético - Álgebra - 2C 2025",
        autor_nombre: "Lucy Marticoneta",
        fecha_completado: ""
    }
];

export default function SeleccionarInformeSintetico() {
    const [informes, setInformes] = useState<InformeSinteticoList[]>([]);
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
        } finally {
            setLoading(false);
        }
    };

    const handleSeleccionarInforme = (informe: InformeSinteticoList) => {
        console.log('Informe sintético seleccionado:', informe);
        
        // Navegar a responder-instrumento
        navigate(`/responder-instrumento/${informe.id}`, {
            state: {
                rol: USUARIO_DEPARTAMENTO_ALUMNOS.rol,
                tituloFormulario: informe.titulo_formulario,
                autorNombre: informe.autor_nombre
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
                                    <h5 className="mb-0 me-3">{informe.titulo_formulario}</h5>
                                    <Badge bg="primary" className="ms-2">
                                        Informe Sintético
                                    </Badge>
                                </div>
                                
                                <div className="text-muted">
                                    <Row>
                                        <Col md={6}>
                                            <small className="d-block">
                                                <strong>Autor:</strong> {informe.autor_nombre}
                                            </small>
                                        </Col>
                                    </Row>
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
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </Container>
    );
}