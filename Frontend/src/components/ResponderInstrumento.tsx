import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Button, Alert, Badge, Spinner, Row, Col, Form } from 'react-bootstrap';
import ModalExito from "./ModalEnvio";
import { EnumTipoPregunta } from "./Pregunta/PreguntaTypes";

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

    const enviarRespuestas = (): Promise<boolean> => {
    setEnviando(true);


    return fetch('http://127.0.0.1:8000/RespuestasFormulario/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            materia_id: instrumento.materia.id,
            usuario_id: USUARIO_ACTUAL.id,
            instrumento_id: parseInt(instrumentoId!),
            fecha_envio: new Date().toISOString().split('T')[0]
            // NO incluir 'respuestas' aquí
        })
    })
    .then(res => {
        if (!res.ok) throw new Error("Error al crear el formulario");
        return res.json();
    })
    .then(async formularioCreado => {
        // PASO 2: Crear cada respuesta individualmente
        const promesasRespuestas = respuestas
            .filter(respuesta => respuesta.texto?.trim() || respuesta.opcion_id)
            .map(respuesta => 
                fetch("http://127.0.0.1:8000/respuestas/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        pregunta_id: respuesta.pregunta_id,
                        texto: respuesta.texto?.trim() || null,
                        opcion_id: respuesta.opcion_id || null,
                        formulario_id: formularioCreado.id,
                    }),
                })
            );
        
        await Promise.all(promesasRespuestas);
        return true; 
    })
    .catch(err => {
        console.error(err);
        alert("Error al enviar las respuestas: " + err.message);
        return false; 
    })
    .finally(() => setEnviando(false));
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
            <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh", paddingTop: "2.5rem", paddingBottom: "2.5rem" }}>
            <Container style={{ maxWidth: '900px' }}>
                <Card className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
                <div className="text-center mb-3"> {/* mb-5 -> mb-3 */}
                    <h1 className="fw-bold mb-2" style={{ color: "#1f2937", fontSize: "1.875rem" }}>
                        {plantillaFormulario?.titulo || `Encuesta de ${materiaNombre}`}
                    </h1>
                    <p className="text-muted mb-0">Complete todas las preguntas para finalizar la encuesta.</p> {/* mb-0 para quitar margen inferior */}
                </div>

                <Card.Body className="p-3 p-md-4"> {/* p-4 p-md-5 -> p-3 p-md-4 */}
                    {plantillaFormulario?.preguntas?.map((pregunta: any, idx: number) => (
                        <Card key={pregunta.id} className="border-0 shadow-sm w-100 mb-3" style={{ borderRadius: "1rem" }}>
                            <Card.Body className="p-3"> {/* p-4 p-md-5 -> p-3 */}
                                <div className="mb-2 d-flex align-items-center gap-3"> {/* mb-3 -> mb-2 */}
                                    <Badge
                                        bg="secondary"
                                        className="rounded-circle"
                                        style={{ width: '35px', height: '35px', fontSize: '1rem', display:'flex', alignItems:'center', justifyContent:'center' }}
                                    >
                                        {idx + 1}
                                    </Badge>
                                    <div>
                                        <h5 className="fw-semibold mb-1">{pregunta.texto}</h5>
                                        <Badge bg={pregunta.tipo.toLowerCase() === EnumTipoPregunta.abierta ? 'success' : 'info'}>
                                            {pregunta.tipo === EnumTipoPregunta.abierta ? EnumTipoPregunta.abierta : EnumTipoPregunta.cerrada}
                                        </Badge>
                                    </div>
                                </div>

                                {pregunta.tipo.toLowerCase() === EnumTipoPregunta.abierta.toLowerCase()  ? (
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        value={obtenerRespuesta(pregunta.id)?.texto || ''}
                                        onChange={(e) => actualizarRespuesta(pregunta.id, e.target.value)}
                                        placeholder="Escriba su respuesta..."
                                        className="input-pregunta"
                                        style={{ marginBottom: '0.5rem' }} // un poquito de espacio abajo
                                    />
                                ) : (
                                    <Form.Group>
                                        {pregunta.opciones?.map((opcion: any) => (
                                            <Form.Check
                                                key={opcion.id}
                                                type="radio"
                                                name={`pregunta-${pregunta.id}`}
                                                label={opcion.texto}
                                                checked={obtenerRespuesta(pregunta.id)?.opcion_id === opcion.id}
                                                onChange={() => actualizarRespuesta(pregunta.id, undefined, opcion.id)}
                                                className="mb-2"
                                            />
                                        ))}
                                    </Form.Group>
                                )}

                                {!obtenerRespuesta(pregunta.id)?.texto?.trim() && pregunta.tipo.toLowerCase() === EnumTipoPregunta.abierta && (
                                    <Form.Text className="text-danger">* Esta pregunta es obligatoria</Form.Text>
                                )}
                                {!obtenerRespuesta(pregunta.id)?.opcion_id && pregunta.tipo.toLowerCase() !== EnumTipoPregunta.abierta && (
                                    <Form.Text className="text-danger">* Esta pregunta es obligatoria</Form.Text>
                                )}
                            </Card.Body>
                        </Card>
                    ))}

                    {todasRespondidas ? (
                        <Alert variant="success" className="text-center mt-3">¡Listo para enviar tus respuestas!</Alert>
                    ) : (
                        <Alert variant="warning" className="text-center mt-3">Por favor, responde todas las preguntas antes de enviar.</Alert>
                    )}

                    <Row className="mt-4">
                        <Col md={6} className="mb-2">
                            <Button variant="outline-secondary" className="w-100" onClick={() => navigate('/seleccionar-materia')}>
                                Volver a Materias
                            </Button>
                        </Col>
                        <Col md={6} className='mb-2'>
                            <ModalExito onEnviar={enviarRespuestas} onExito={() => navigate('/seleccionar-materia')}/>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            </Container>

        </div>

        </>
    );
}

export default ResponderInstrumento;