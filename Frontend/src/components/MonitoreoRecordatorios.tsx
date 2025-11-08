import { Container, Card, Button, Alert, Badge, Spinner, Table } from "react-bootstrap";
import { useState, useEffect } from "react";

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
        <Container className="py-4">
            <Card>
                <Card.Header>
                    <h4 className="mb-0">Testing: Recordatorios Automáticos</h4>
                </Card.Header>
                <Card.Body>
                    {estado ? (
                        <div>
                            <div className="mb-3">
                                <strong>Estado del Sistema:</strong>{' '}
                                <Badge bg={estado.automatico ? "success" : "danger"}>
                                    {estado.automatico ? "ACTIVO" : "INACTIVO"}
                                </Badge>
                            </div>
                            <div className="mb-3">
                                <strong>Programación Automática:</strong> {estado.programado}
                            </div>
                            <div className="mb-3">
                                <strong>Función:</strong> {estado.funcionalidad}
                            </div>
                            
                            <Alert variant="info" className="mb-4">
                                <strong>Para Testing:</strong><br />
                                Ejecutar Ahora para enviar recordatorios inmediatamente.
                            </Alert>

                            <div className="d-grid gap-2">
                                <Button 
                                    variant="primary" 
                                    size="lg"
                                    onClick={ejecutarAhora}
                                    disabled={ejecutando}
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
                        <div>Cargando estado del sistema...</div>
                    )}

                    {/* Resultados del envío manual */}
                    {resultado && (
                        <div className="mt-4">
                            <Alert variant={resultado.fallidos === 0 ? "success" : "warning"}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5>Resultado del Envío</h5>
                                        <strong>Total estudiantes:</strong> {resultado.total_estudiantes}<br />
                                        <strong>Enviados:</strong> {resultado.enviados}<br />
                                        {resultado.fallidos > 0 && <><strong>Fallidos:</strong> {resultado.fallidos}</>}
                                    </div>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => setMostrarDetalles(!mostrarDetalles)}
                                    >
                                        {mostrarDetalles ? "Ocultar" : "Ver"} detalles
                                    </Button>
                                </div>
                            </Alert>

                            {mostrarDetalles && resultado.detalles.length > 0 && (
                                <Table striped bordered size="sm" className="mt-3">
                                    <thead>
                                        <tr>
                                            <th>Estudiante</th>
                                            <th>Email</th>
                                            <th>Materia</th>
                                            <th>Vence en</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resultado.detalles.map((detalle, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <strong>{detalle.estudiante}</strong>
                                                </td>
                                                <td>{detalle.email}</td>
                                                <td>{detalle.materia}</td>
                                                <td>
                                                    <Badge bg={
                                                        detalle.dias_restantes <= 3 ? "danger" :
                                                        detalle.dias_restantes <= 7 ? "warning" : "info"
                                                    }>
                                                        {detalle.dias_restantes} días
                                                    </Badge>
                                                    <br />
                                                    <small>{detalle.fecha_cierre}</small>
                                                </td>
                                                <td>
                                                    <Badge bg={detalle.estado === "enviado" ? "success" : "danger"}>
                                                        {detalle.estado}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}

                            {resultado.detalles.length === 0 && (
                                <Alert variant="info" className="text-center">
                                    No se encontraron estudiantes pendientes para instrumentos que vencen en 7 días.
                                </Alert>
                            )}
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}