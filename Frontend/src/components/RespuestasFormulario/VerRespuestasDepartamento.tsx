import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Spinner, Alert, Badge, ListGroup } from 'react-bootstrap';

interface InstrumentoRespondido {
    id: number;
    fecha_envio: string;
    instrumento_id: number;
    materia: { id: string; nombre: string };
    plantilla_formulario?: { id: number; titulo: string };
    respondido: boolean;
    respuestas_formulario_id?: number;
}

export default function () {
    const navigate = useNavigate();
    const [instrumentos, setInstrumentos] = useState<InstrumentoRespondido[]>([]);
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        const fetchInstrumentos = async () => {
            try {
                setCargando(true);
                setMensaje('');

                const userId = 3; // IMPORTANTE: adaptar al sistema de usuarios
                
                const res = await fetch(
                    `http://127.0.0.1:8000/instrumentos/tipo/INFORME_SINTETICO?usuario_id=${userId}&mostrar_respondidos=true`
                );
                if (!res.ok) throw new Error('No se pudieron cargar los informes sintéticos');

                const data = await res.json();
                setInstrumentos(data);
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : 'Error desconocido';
                setMensaje(msg);
            } finally {
                setCargando(false);
            }
        };

        fetchInstrumentos();
    }, []);

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
                                <p className="text-muted">Cargando informes sintéticos respondidos...</p>
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
                                        <h1 className="fw-bold mb-2">Informes Sintéticos Respondidos</h1>
                                        <p className="text-muted mb-0">
                                            Selecciona un informe para ver las respuestas del departamento
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
                                    {instrumentos.map((instrumento) => (
                                        <ListGroup.Item
                                            key={instrumento.id}
                                            className="d-flex justify-content-between align-items-center p-4"
                                            style={{ borderBottom: '1px solid #e9ecef' }}
                                        >
                                            <div className="flex-grow-1">
                                                <div className="fw-bold fs-5 mb-1">{instrumento.materia.nombre}</div>
                                                <div className="d-flex align-items-center gap-3">
                                                    <small className="text-muted">
                                                        Fecha de envío: {new Date(instrumento.fecha_envio).toLocaleDateString()}
                                                    </small>
                                                    <Badge bg="primary" className="ms-2">
                                                        Informe Sintético
                                                    </Badge>
                                                    {instrumento.plantilla_formulario && (
                                                        <Badge bg="success" className="ms-2">
                                                            Formulario respondido
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() =>
                                                    navigate(`/ver-respuestas/${instrumento.respuestas_formulario_id || instrumento.id}`, {
                                                        state: {
                                                            materiaNombre: instrumento.materia.nombre,
                                                            fechaEnvio: instrumento.fecha_envio,
                                                            instrumentoId: instrumento.instrumento_id || instrumento.id,
                                                            plantillaFormularioId: instrumento.plantilla_formulario?.id,
                                                            tipoInstrumento: 'INFORME_SINTETICO'
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
                                    <h5 className="text-muted mb-3">No hay informes sintéticos respondidos</h5>
                                    <p className="text-muted">
                                        Aún no se han respondido informes sintéticos en el departamento.
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