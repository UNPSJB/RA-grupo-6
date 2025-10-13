import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Button, Alert, Badge, Spinner, Row, Col } from 'react-bootstrap';
import ResponderPreguntaAbierta from './Respuesta/ResponderPreguntaAbierta';

// Usuario temporal, requeire aunteticacion?
const USUARIO_ACTUAL = {
    id: 1,
    nombre: "Alumno",
    apellido: "Demo"
};

function ResponderInstrumento() {
    const { instrumentoId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [instrumento, setInstrumento] = useState<any>(null);
    const [plantillaFormulario, setPlantillaFormulario] = useState<any>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [respuestasFormularioId, setRespuestasFormularioId] = useState<number | null>(null);
    const [respuestasEnviadas, setRespuestasEnviadas] = useState<number[]>([]);

    const materiaNombre = location.state?.materiaNombre;

    useEffect(() => {
        const cargarDatos = async () => {
            if (!instrumentoId) {
                setError('No se especificó la encuesta');
                setCargando(false);
                return;
            }

            try {
                // Obtener el instrumento
                const instrumentoResponse = await fetch(`http://127.0.0.1:8000/instrumentos/${instrumentoId}/detail`);
                if (!instrumentoResponse.ok) throw new Error('No se pudo cargar la encuesta');
                const instrumentoData = await instrumentoResponse.json();
                console.log(instrumentoData)
                setInstrumento(instrumentoData);

                // Obtener PlantillaFormulario
                const plantillaResponse = await fetch(`http://127.0.0.1:8000/formularios/${instrumentoData.plantilla_formulario_id}?fomulario_id=${instrumentoData.plantilla_formulario_id}`); //${instrumentoData.plantilla_formulario_id}
                if (!plantillaResponse.ok) throw new Error('No se pudo cargar el formulario');
                const plantillaData = await plantillaResponse.json();
                setPlantillaFormulario(plantillaData);

                // Crear RespuestasFormulario
                const nuevoFormulario = {
                    materia_id: instrumentoData.materia_id,
                    usuario_id: USUARIO_ACTUAL.id,
                    instrumento_id: parseInt(instrumentoId),
                    fecha_envio: new Date().toISOString().split('T')[0]
                };

                const formularioResponse = await fetch('http://127.0.0.1:8000/RespuestasFormulario/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(nuevoFormulario)
                });

                if (formularioResponse.ok) {
                    const formularioCreado = await formularioResponse.json();
                    setRespuestasFormularioId(formularioCreado.id);
                } else {
                    throw new Error('Error al crear RespuestasFormulario');
                }

                setCargando(false);
            } catch (err: any) {
                setError('Error: ' + err.message);
                setCargando(false);
            }
        };

        cargarDatos();
    }, [instrumentoId]);

    const manejarRespuestaEnviada = (preguntaId: number) => {
        setRespuestasEnviadas(prev => [...prev, preguntaId]);
    };

    const todasRespondidas = plantillaFormulario?.preguntas?.length === respuestasEnviadas.length;
        
    if (cargando) {
        return (
            <>
                <Container className="mt-4 text-center">
                    <Spinner animation="border" role="status" className="mb-3">
                        <span className="visually-hidden">Cargando encuesta...</span>
                    </Spinner>
                    <p className="mt-2">Cargando encuesta...</p>
                </Container>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Container className="mt-4">
                    <Alert variant="danger">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        {error}
                        <div className="mt-3">
                            <Button variant="outline-danger" onClick={() => navigate('/seleccionar-materia')}>
                                Volver a Materias
                            </Button>
                        </div>
                    </Alert>
                </Container>
            </>
        );
    }

    return (
        <>
            <Container className="mt-4">
                <Card className="border-0 shadow-sm" style={{ borderRadius: "1rem" }}>
                    <Card.Body className="p-4 p-md-5">
                        {/* Header */}
                        <div className="text-center mb-5">
                            <h1 className="fw-bold mb-3">
                                {plantillaFormulario?.titulo || `Encuesta de ${materiaNombre}`}
                            </h1>
                            <Badge bg="primary" className="px-3 py-2 mb-3">
                                {respuestasEnviadas.length} de {plantillaFormulario?.preguntas?.length || 0} respondidas
                            </Badge>
                            <p className="text-muted mb-0">
                                Complete todas las preguntas para finalizar la encuesta
                            </p>
                        </div>

                        {/* Barra de progreso */}
                        {plantillaFormulario?.preguntas && (
                            <div className="mb-4">
                                <div className="d-flex justify-content-between text-muted small mb-2">
                                    <span>Progreso</span>
                                    <span>{Math.round((respuestasEnviadas.length / plantillaFormulario.preguntas.length) * 100)}%</span>
                                </div>
                                <div className="progress" style={{ height: '8px' }}>
                                    <div 
                                        className="progress-bar bg-success" 
                                        style={{ width: `${(respuestasEnviadas.length / plantillaFormulario.preguntas.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {/* Información del formulario */}
                        {!respuestasFormularioId && (
                            <Alert variant="warning" className="mb-4">
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                Inicializando encuesta...
                            </Alert>
                        )}

                        {/* Preguntas */}
                        {plantillaFormulario?.preguntas?.map((pregunta: any, index: number) => (
                            <div key={pregunta.id} className="mb-4">
                                {pregunta.tipo === 'Abierta' || pregunta.tipo === 'abierta' ? (
                                    <ResponderPreguntaAbierta
                                        pregunta={pregunta}
                                        formularioId={respuestasFormularioId}
                                        onRespuestaEnviada={() => manejarRespuestaEnviada(pregunta.id)}
                                    />
                                ) : (
                                    <Card className="border-0 shadow-sm">
                                        <Card.Body className="p-4">
                                            <div className="d-flex align-items-start gap-3 mb-3">
                                                <Badge 
                                                    bg="secondary"
                                                    className="rounded-circle d-flex align-items-center justify-content-center"
                                                    style={{ width: '32px', height: '32px', fontSize: '0.875rem', flexShrink: 0 }}
                                                >
                                                    {index + 1}
                                                </Badge>
                                                <div className="flex-grow-1">
                                                    <h5 className="fw-semibold mb-2">{pregunta.texto}</h5>
                                                    <Badge bg="info" className="px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                                        Pregunta Cerrada
                                                    </Badge>
                                                </div>
                                            </div>
                                            <Alert variant="info" className="mt-3">
                                                <i className="fas fa-info-circle me-2"></i>
                                                Implementar preguntas cerradas :P
                                            </Alert>
                                        </Card.Body>
                                    </Card>
                                )}
                            </div>
                        ))}

                        {/* Estado de completado */}
                        {todasRespondidas && (
                            <Alert variant="success" className="text-center">
                                <i className="fas fa-check-circle me-2"></i>
                                Encuesta completada con éxito
                            </Alert>
                        )}

                        {/* Botones */}
                        <Row className="mt-4">
                            <Col md={6}>
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={() => navigate('/seleccionar-materia')}
                                    className="w-100 py-2"
                                >
                                    <i className="fas fa-arrow-left me-2"></i>
                                    Volver a Materias
                                </Button>
                            </Col>
                            <Col md={6}>
                                <Button 
                                    variant="success"
                                    disabled={!todasRespondidas}
                                    className="w-100 py-2"
                                    onClick={() => {
                                        alert('¡Encuesta completada exitosamente!');
                                        navigate('/seleccionar-materia');
                                    }}
                                >
                                    <i className="fas fa-check me-2"></i>
                                    Finalizar Encuesta
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}

export default ResponderInstrumento;