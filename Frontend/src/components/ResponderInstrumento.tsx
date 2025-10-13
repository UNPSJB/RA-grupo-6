import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Button, Alert, Badge, Spinner, Row, Col, Form } from 'react-bootstrap';

// Usuario temporal
const USUARIO_ACTUAL = {
    id: 1,
    nombre: "Alumno",
    apellido: "Demo"
};


interface RespuestaTemporal {
    pregunta_id: number;
    texto?: string;
    opcion_id?: number;
}

function ResponderInstrumento() {
    const { instrumentoId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [instrumento, setInstrumento] = useState<any>(null);
    const [plantillaFormulario, setPlantillaFormulario] = useState<any>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);
    
    const [respuestas, setRespuestas] = useState<RespuestaTemporal[]>([]);

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
                setInstrumento(instrumentoData);

                // Obtener PlantillaFormulario
                const plantillaResponse = await fetch(`http://127.0.0.1:8000/formularios/${instrumentoData.plantilla_formulario_id}`);
                if (!plantillaResponse.ok) throw new Error('No se pudo cargar el formulario');
                const plantillaData = await plantillaResponse.json();
                setPlantillaFormulario(plantillaData);

                // Inicializar array de respuestas vacías
                const respuestasIniciales = plantillaData.preguntas.map((pregunta: any) => ({
                    pregunta_id: pregunta.id,
                    texto: '',
                    opcion_id: undefined
                }));
                setRespuestas(respuestasIniciales);

                setCargando(false);
            } catch (err: any) {
                setError('Error: ' + err.message);
                setCargando(false);
            }
        };

        cargarDatos();
    }, [instrumentoId]);

    const actualizarRespuesta = (preguntaId: number, nuevoTexto?: string, nuevaOpcionId?: number) => {
        const respuestasActualizadas = [...respuestas];

        for (let i = 0; i < respuestasActualizadas.length; i++) {
            if (respuestasActualizadas[i].pregunta_id === preguntaId) {
                if (nuevoTexto !== undefined) {
                    respuestasActualizadas[i] = {
                        ...respuestasActualizadas[i],
                        texto: nuevoTexto,
                        opcion_id: undefined,
                    };
                } else if (nuevaOpcionId !== undefined) {
                    respuestasActualizadas[i] = {
                        ...respuestasActualizadas[i],
                        opcion_id: nuevaOpcionId,
                        texto: ''
                    };
                }
                break;
            }
        }
        
        setRespuestas(respuestasActualizadas);
    };

    const enviarRespuestas = async () => {
        setEnviando(true);
        try {
            // crear RespuestasFormulario (sin respuestas)
            const nuevoRespuestasFormulario = {
                materia_id: instrumento.materia.id,
                usuario_id: USUARIO_ACTUAL.id,
                instrumento_id: parseInt(instrumentoId!),
                fecha_envio: new Date().toISOString().split('T')[0],
                respuestas: [] // Array vacío - las respuestas se crearán después
            };

            console.log("Creando RespuestasFormulario:", nuevoRespuestasFormulario);

            const respuestasFormularioResponse = await fetch('http://127.0.0.1:8000/RespuestasFormulario/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoRespuestasFormulario)
            });

            if (!respuestasFormularioResponse.ok) {
                const errorDetail = await respuestasFormularioResponse.json();
                throw new Error('Error al crear RespuestasFormulario: ' + JSON.stringify(errorDetail));
            }

            const respuestasFormularioCreado = await respuestasFormularioResponse.json();
            const formularioId = respuestasFormularioCreado.id;

            console.log("RespuestasFormulario creado con ID:", formularioId);

            // crear cada respuesta individual asociada al formulario
            for (const respuesta of respuestas) {
                if (respuesta.texto?.trim() || respuesta.opcion_id) {
                    const payload = {
                        pregunta_id: respuesta.pregunta_id,
                        texto: respuesta.texto?.trim() || null,
                        opcion_id: respuesta.opcion_id || null,
                        formulario_id: formularioId  // Asociar al formulario recién creado
                    };

                    console.log("Enviando respuesta:", payload);

                    const response = await fetch('http://127.0.0.1:8000/respuestas/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) {
                        const errorDetail = await response.json();
                        throw new Error(`Error en pregunta ${respuesta.pregunta_id}: ${JSON.stringify(errorDetail)}`);
                    }
                }
            }

            alert('¡Encuesta completada exitosamente!');
            navigate('/seleccionar-materia');
            
        } catch (err: any) {
            setError('Error al enviar las respuestas: ' + err.message);
        } finally {
            setEnviando(false);
        }
    };

    // Verificar preguntas respondidas
    const todasRespondidas = respuestas.every(respuesta => 
        respuesta.texto?.trim() || respuesta.opcion_id
    );

    // Obtener respuesta para verificar estado
    const obtenerRespuesta = (preguntaId: number) => {
        return respuestas.find(r => r.pregunta_id === preguntaId);
    };
        
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
            <Container className="mt-4" style={{ maxWidth: '900px' }}>
                <Card className="border-0 shadow-sm" style={{ borderRadius: "1rem" }}>
                    <Card.Body className="p-4 p-md-5">
                        {/* Header */}
                        <div className="text-center mb-5">
                            <h1 className="fw-bold mb-3" style={{ fontSize: '2rem' }}>
                                {plantillaFormulario?.titulo || `Encuesta de ${materiaNombre}`}
                            </h1>
                            <p className="text-muted mb-0" style={{ fontSize: '1.1rem' }}>
                                Complete todas las preguntas para finalizar la encuesta.
                            </p>
                        </div>

                        {/* Mostrando preguntas */}
                        {plantillaFormulario?.preguntas
                            ?.sort((a: any, b: any) => a.id - b.id)
                            ?.map((pregunta: any, index: number) => (
                            <div key={pregunta.id} className="mb-4">
                                <Card className="border-0 shadow-sm" style={{ borderRadius: "0.75rem" }}>
                                    <Card.Body className="p-4">
                                        <div className="d-flex align-items-start gap-3 mb-4">
                                            <Badge 
                                                bg="secondary"
                                                className="rounded-circle d-flex align-items-center justify-content-center"
                                                style={{ 
                                                    width: '40px', 
                                                    height: '40px', 
                                                    fontSize: '1rem', 
                                                    flexShrink: 0 
                                                }}
                                            >
                                                {index + 1}
                                            </Badge>
                                            <div className="flex-grow-1">
                                                <h5 className="fw-semibold mb-2" style={{ fontSize: '1.2rem', lineHeight: '1.4' }}>
                                                    {pregunta.texto}
                                                </h5>
                                                <Badge 
                                                    bg={pregunta.tipo === 'Abierta' || pregunta.tipo === 'abierta' ? 'success' : 'info'} 
                                                    className="px-2 py-1" 
                                                    style={{ fontSize: '0.85rem' }}
                                                >
                                                    {pregunta.tipo === 'Abierta' || pregunta.tipo === 'abierta' ? 'Pregunta Abierta' : 'Pregunta Cerrada'}
                                                </Badge>
                                            </div>
                                        </div>
                                        
                                        {/* Renderizar respuestas locales*/}
                                        {pregunta.tipo === 'Abierta' || pregunta.tipo === 'abierta' ? (
                                            <div className="ps-5">
                                                <Form.Control
                                                    as="textarea"
                                                    rows={5}
                                                    value={obtenerRespuesta(pregunta.id)?.texto || ''}
                                                    onChange={(e) => actualizarRespuesta(pregunta.id, e.target.value, undefined)}
                                                    placeholder="Escriba su respuesta aquí..."
                                                    className="border-2"
                                                    style={{
                                                        borderColor: "#e5e7eb",
                                                        borderRadius: "0.5rem",
                                                        fontSize: "1.1rem",
                                                        padding: "1rem",
                                                        resize: "vertical",
                                                        minHeight: "150px"
                                                    }}
                                                />
                                                {!obtenerRespuesta(pregunta.id)?.texto?.trim() && (
                                                    <Form.Text className="text-danger" style={{ fontSize: '0.9rem' }}>
                                                        * Esta pregunta es obligatoria
                                                    </Form.Text>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="ps-5">
                                                {pregunta.opciones?.map((opcion: any) => (
                                                    <div key={opcion.id} className="mb-3">
                                                        <Form.Check
                                                            type="radio"
                                                            name={`pregunta-${pregunta.id}`}
                                                            id={`opcion-${opcion.id}`}
                                                            label={opcion.texto}
                                                            checked={obtenerRespuesta(pregunta.id)?.opcion_id === opcion.id}
                                                            onChange={() => actualizarRespuesta(pregunta.id, undefined, opcion.id)}
                                                            style={{ fontSize: '1.1rem' }}
                                                        />
                                                    </div>
                                                ))}
                                                {!obtenerRespuesta(pregunta.id)?.opcion_id && (
                                                    <Form.Text className="text-danger" style={{ fontSize: '0.9rem' }}>
                                                        * Esta pregunta es obligatoria
                                                    </Form.Text>
                                                )}
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </div>
                        ))}

                        {/* Estado de completado */}
                        {todasRespondidas && (
                            <Alert variant="success" className="text-center" style={{ fontSize: '1.1rem' }}>
                                <i className="fas fa-check-circle me-2"></i>
                                Listo para enviar tus respuestas.
                            </Alert>
                        )}

                        {/* Mensaje si faltan respuestas */}
                        {!todasRespondidas && (
                            <Alert variant="warning" className="mt-3" style={{ fontSize: '1.1rem' }}>
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                Por favor, responde todas las preguntas antes de enviar la encuesta.
                            </Alert>
                        )}

                        {/* Botones */}
                        <Row className="mt-5">
                            <Col md={6}>
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={() => navigate('/seleccionar-materia')}
                                    className="w-100 py-3"
                                    style={{ fontSize: '1.1rem' }}
                                >
                                    <i className="fas fa-arrow-left me-2"></i>
                                    Volver a Materias
                                </Button>
                            </Col>
                            <Col md={6}>
                                <Button 
                                    variant="success"
                                    disabled={!todasRespondidas || enviando}
                                    onClick={enviarRespuestas}
                                    className="w-100 py-3"
                                    style={{ fontSize: '1.1rem' }}
                                >
                                    {enviando ? (
                                        <>
                                            <div className="spinner-border spinner-border-sm me-2" role="status">
                                                <span className="visually-hidden">Enviando...</span>
                                            </div>
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-paper-plane me-2"></i>
                                            Enviar Formulario
                                        </>
                                    )}
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