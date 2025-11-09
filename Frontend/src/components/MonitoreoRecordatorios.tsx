import { Container, Card, Button, Alert, Badge, Spinner, Table } from "react-bootstrap";
import { useState, useEffect } from "react";
import { capitalizarCadena } from "./Funciones";

interface EstadoProgramador {
    automatico: boolean;
    programado: string;
    funcionalidad: string;
}

interface ResultadoEnvio {
    enviados: number;
    fallidos: number;
    total_estudiantes: number;
    detalles: Array<{
        estudiante: string;
        email: string;
        materia: string;
        fecha_cierre: string;
        dias_restantes: number;
        estado: string;
    }>;
}

export function MonitoreoRecordatorios() {
    const [estado, setEstado] = useState<EstadoProgramador | null>(null);
    const [ejecutando, setEjecutando] = useState(false);
    const [resultado, setResultado] = useState<ResultadoEnvio | null>(null);
    const [mostrarDetalles, setMostrarDetalles] = useState(false);

    useEffect(() => {
        cargarEstado();
    }, []);

    const cargarEstado = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/email/estado-programador");
            const data = await response.json();
            setEstado(data);
        } catch (error) {
            console.error('Error cargando estado:', error);
        }
    };

    const ejecutarAhora = async () => {
        setEjecutando(true);
        setResultado(null);
        try {
            const response = await fetch("http://127.0.0.1:8000/email/recordatorios/ejecutar-ahora", {
                method: 'POST'
            });
            const data: ResultadoEnvio = await response.json();
            setResultado(data);
        } catch (error) {
            console.error('Error ejecutando recordatorios:', error);
            alert('Error ejecutando recordatorios');
        } finally {
            setEjecutando(false);
        }
    };

    return (
        <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh", paddingTop: "2.5rem", paddingBottom: "2.5rem" }}>
            <Container style={{ maxWidth: "900px" }}>
                <Card className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
                    <Card.Body className="p-4 p-md-5">
                        <div className="mb-4 text-center">
                            <h1 className="fw-bold mb-2" style={{ color: "#1f2937", fontSize: "1.875rem" }}>
                                Recordatorios Automáticos
                            </h1>
                            <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>
                                Configuración y ejecución del sistema de recordatorios
                            </p>
                        </div>

                        {estado ? (
                            <div>
                                <div className="row g-3 mb-4">
                                    <div className="col-md-4">
                                        <div className="text-center">
                                            <p className="mb-2">
                                                <span style={{ color: "grey", fontSize: "13px" }}>ESTADO DEL SISTEMA</span>
                                            </p>
                                            <Badge bg={estado.automatico ? "success" : "danger"} className="fs-6 px-3 py-1">
                                                {estado.automatico ? "ACTIVO" : "INACTIVO"}
                                            </Badge>
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-4">
                                        <div className="text-center">
                                            <p className="mb-2">
                                                <span style={{ color: "grey", fontSize: "13px" }}>PROGRAMACIÓN AUTOMÁTICA</span>
                                            </p>
                                            <p className="fw-bold mb-0" style={{ whiteSpace: "nowrap" }}>{estado.programado}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-4">
                                        <div className="text-center">
                                            <p className="mb-2">
                                                <span style={{ color: "grey", fontSize: "13px" }}>FUNCIÓN</span>
                                            </p>
                                            <p className="fw-bold mb-0">{estado.funcionalidad}</p>
                                        </div>
                                    </div>
                                </div>

                                <hr />
                                
                                <div className="my-4 p-3" style={{ 
                                    backgroundColor: "#e7f3ff", 
                                    borderLeft: "4px solid #0d6efd",
                                    borderRadius: "0.25rem"
                                }}>
                                    <div className="d-flex align-items-start gap-2">
                                        <i className="fas fa-info-circle" style={{ color: "#0d6efd", fontSize: '1.1rem', marginTop: '2px' }}></i>
                                        <div>
                                            <strong style={{ fontSize: '0.9rem', color: "#1f2937" }}>Nota:</strong>
                                            <span style={{ fontSize: '0.85rem', color: "#4b5563", marginLeft: '0.5rem' }}>
                                                Presione el boton "Ejecutar Recordatorios Ahora" para enviar notificaciones inmediatamente sin esperar la programación automática.
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-grid">
                                    <Button 
                                        variant="primary" 
                                        size="md"
                                        onClick={ejecutarAhora}
                                        disabled={ejecutando}
                                        className="py-2 fw-semibold"
                                        style={{ borderRadius: "0.5rem" }}
                                    >
                                        {ejecutando ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Ejecutando...
                                            </>
                                        ) : (
                                            "Ejecutar Recordatorios Ahora"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-5">
                                <Spinner animation="border" className="me-2" />
                                <span>Cargando estado del sistema...</span>
                            </div>
                        )}


                        {resultado && (
                            <div className="mt-5">
                                <hr className="mb-4" />
                                
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="fw-bold mb-0" style={{ color: "#1f2937" }}>Resultado del Envío</h5>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => setMostrarDetalles(!mostrarDetalles)}
                                            style={{ borderRadius: "0.5rem" }}
                                        >
                                           Ver detalles
                                        </Button>
                                    </div>
                                    
                                    <div className="row g-3 mb-3">
                                        <div className="col-md-4">
                                            <div className="text-center p-3" style={{ 
                                                backgroundColor: "#f8f9fa", 
                                                borderRadius: "0.5rem",
                                                border: "1px solid #e9ecef"
                                            }}>
                                                <p className="mb-2">
                                                    <span style={{ color: "grey", fontSize: "13px" }}>TOTAL ESTUDIANTES</span>
                                                </p>
                                                <p className="fs-4 fw-bold mb-0">{resultado.total_estudiantes}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="col-md-4">
                                            <div className="text-center p-3" style={{ 
                                                backgroundColor: "#d1e7dd", 
                                                borderRadius: "0.5rem",
                                                border: "1px solid #badbcc"
                                            }}>
                                                <p className="mb-2">
                                                    <span style={{ color: "grey", fontSize: "13px" }}>ENVIADOS</span>
                                                </p>
                                                <p className="fs-4 fw-bold mb-0 text-success">{resultado.enviados}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="col-md-4">
                                            <div className="text-center p-3" style={{ 
                                                backgroundColor: "#f8d7da", 
                                                borderRadius: "0.5rem",
                                                border: "1px solid #f5c2c7"
                                            }}>
                                                <p className="mb-2">
                                                    <span style={{ color: "grey", fontSize: "13px" }}>FALLIDOS</span>
                                                </p>
                                                <p className="fs-4 fw-bold mb-0 text-danger">
                                                    {resultado.fallidos}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {mostrarDetalles && resultado.detalles.length > 0 && (
                                    <div className="mt-4">
                                        <Table striped bordered hover className="mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="text-center" style={{ width: '20%' }}>Estudiante</th>
                                                    <th className="text-center" style={{ width: '25%' }}>Email</th>
                                                    <th className="text-center" style={{ width: '25%' }}>Materia</th>
                                                    <th className="text-center" style={{ width: '15%' }}>Vence en</th>
                                                    <th className="text-center" style={{ width: '15%' }}>Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {resultado.detalles.map((detalle, index) => (
                                                    <tr key={index}>
                                                        <td className="align-middle">
                                                            <strong>{capitalizarCadena(detalle.estudiante)}</strong>
                                                        </td>
                                                        <td className="align-middle">
                                                            <small>{detalle.email}</small>
                                                        </td>
                                                        <td className="align-middle">{capitalizarCadena(detalle.materia)}</td>
                                                        <td className="text-center align-middle">
                                                            <div className="d-flex flex-column align-items-center gap-1">
                                                                <Badge bg={
                                                                    detalle.dias_restantes <= 3 ? "danger" :
                                                                    detalle.dias_restantes <= 7 ? "warning" : "info"
                                                                } className="px-3 py-2">
                                                                    {detalle.dias_restantes} días
                                                                </Badge>
                                                                <small className="text-muted">{detalle.fecha_cierre}</small>
                                                            </div>
                                                        </td>
                                                        <td className="text-center align-middle">
                                                            <Badge bg={detalle.estado === "enviado" ? "success" : "danger"} className="px-3 py-2">
                                                                {detalle.estado}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                )}

                                {resultado.detalles.length === 0 && (
                                    <Alert variant="info" className="text-center mt-4">
                                        No se encontraron estudiantes pendientes para instrumentos que vencen en 7 días.
                                    </Alert>
                                )}
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}