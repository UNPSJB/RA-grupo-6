// VerRespuestasEstudiante.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Spinner, Alert, Badge, ListGroup } from 'react-bootstrap';

interface EncuestaRespondida {
    id: number;
    fecha_envio: string;
    instrumento_id: number;
    materia: { id: string; nombre: string };
    plantilla_formulario_id?: number;
}

export default function VerRespuestasEstudiante() {
    const navigate = useNavigate();
    const [encuestas, setEncuestas] = useState<EncuestaRespondida[]>([]);
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        const fetchEncuestas = async () => {
            try {
                setCargando(true);
                setMensaje('');

                const userId = 5; // IMPORTANTE: adaptar al sistema de usuarios
                //userid=5 ; username: lucas
                const res = await fetch(`http://127.0.0.1:8000/RespuestasFormulario/buscar/?usuario_id=${userId}`);
                if (!res.ok) throw new Error('No se pudieron cargar las encuestas');

                const data = await res.json();
                setEncuestas(data);
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : 'Error desconocido';
                setMensaje(msg);
            } finally {
                setCargando(false);
            }
        };

        fetchEncuestas();
    }, []);

    if (cargando) {
        return (
            <Container className="mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <Card className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
                            <Card.Body className="p-4 p-md-5 text-center">
                                <Spinner animation="border" role="status" className="mb-3">
                                    <span className="visually-hidden">Cargando encuestas...</span>
                                </Spinner>
                                <p className="text-muted">Cargando encuestas respondidas...</p>
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
                                        <h1 className="fw-bold mb-2">Encuestas Respondidas</h1>
                                        <p className="text-muted mb-0">
                                            Selecciona una encuesta para ver tus respuestas
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {mensaje && (
                                <Alert variant={mensaje.includes('Error') ? 'warning' : 'info'} className="mb-4">
                                    {mensaje}
                                </Alert>
                            )}

                            {encuestas.length > 0 ? (
                                <ListGroup variant="flush">
                                    {encuestas.map((encuesta) => (
                                        <ListGroup.Item
                                            key={encuesta.id}
                                            className="d-flex justify-content-between align-items-center p-4"
                                            style={{ borderBottom: '1px solid #e9ecef' }}
                                        >
                                            <div className="flex-grow-1">
                                                <div className="fw-bold fs-5 mb-1">{encuesta.materia.nombre}</div>
                                                <div className="d-flex align-items-center gap-3">
                                                    <small className="text-muted">
                                                        Fecha de envío: {new Date(encuesta.fecha_envio).toLocaleDateString()}
                                                    </small>
                                                    {encuesta.plantilla_formulario_id && (
                                                        <Badge bg="success" className="ms-2">
                                                            Formulario listo
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() =>
                                                    navigate(`/ver-respuestas/${encuesta.id}`, {
                                                        state: {
                                                            materiaNombre: encuesta.materia.nombre,
                                                            fechaEnvio: encuesta.fecha_envio,
                                                            instrumentoId: encuesta.instrumento_id,
                                                            plantillaFormularioId: encuesta.plantilla_formulario_id
                                                        }
                                                    })
                                                }
                                                className="px-4 py-2"
                                            >
                                                <i className="fas fa-eye me-2"></i>
                                                Ver Respuestas
                                            </Button>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <div className="text-center py-5">
                                    <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                                    <h5 className="text-muted mb-3">No hay encuestas respondidas</h5>
                                    <p className="text-muted">
                                        Aún no has respondido ninguna encuesta.
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