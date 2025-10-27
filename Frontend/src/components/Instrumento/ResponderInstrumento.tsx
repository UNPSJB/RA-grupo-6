import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Button, Alert, Badge, Spinner, Row, Col, Form, Tabs, Tab } from 'react-bootstrap';
import ModalExito from "../ModalEnvio";
import { EnumTipoPregunta, DetalleEncuestaCompleto } from "../types";

// Usuario temporal
const USUARIO_ACTUAL = {
    id: 2,
    nombre: "Docente",
    apellido: "Demo"
};

interface RespuestaTemporal {
    pregunta_id: number;
    texto?: string;
    opcion_id?: number;
}

// Mock data para estadísticas de alumnos (temporal)
const mockEstadisticasAlumnos: DetalleEncuestaCompleto = { 
  id: 301, 
  titulo_formulario: 'Encuesta de fin de cursada - Algorítmica y Programación I', 
  estadisticas: [
    { pregunta_id: 1, pregunta_texto: "¿El material de estudio proporcionado fue claro y útil?", opciones: [{ texto_opcion: "Sí, completamente", cantidad: 85 }, { texto_opcion: "Parcialmente", cantidad: 30 }, { texto_opcion: "No, fue confuso", cantidad: 5 }] },
    { pregunta_id: 2, pregunta_texto: "¿La dificultad de las evaluaciones fue adecuada?", opciones: [{ texto_opcion: "Demasiado fácil", cantidad: 10 }, { texto_opcion: "Adecuada", cantidad: 105 }, { texto_opcion: "Demasiado difícil", cantidad: 5 }] },
    { pregunta_id: 3, pregunta_texto: "¿Cómo calificarías la claridad de las explicaciones del docente?", opciones: [{ texto_opcion: "Excelente", cantidad: 75 }, { texto_opcion: "Buena", cantidad: 35 }, { texto_opcion: "Regular", cantidad: 8 }, { texto_opcion: "Mala", cantidad: 2 }] },
  ],
  respuestas_abiertas_agrupadas: [
    {
      grupo: 'GENERAL',
      titulo_grupo: 'Respuestas Abiertas',
      preguntas: [ 
        { pregunta_texto: '¿Qué tema te resultó más interesante?', respuestas_abiertas: [ 'El manejo de punteros.', 'La recursividad.', 'Entender arrays por dentro.', 'Los algoritmos de ordenamiento.' ] }, 
        { pregunta_texto: 'Sugerencias para el próximo cuatrimestre', respuestas_abiertas: [ 'Más ejercicios prácticos.', 'Un proyecto final más grande.', 'Ninguna, todo perfecto.', 'Mejorar los materiales de estudio.' ] },
        { pregunta_texto: 'Aspectos positivos de la cursada', respuestas_abiertas: [ 'La dedicación del docente.', 'Los ejercicios prácticos.', 'La claridad de las explicaciones.' ] }
      ]
    }
  ] 
};

export default function ResponderInstrumento() {
    const { instrumentoId: instrumentoIdParam } = useParams<{ instrumentoId: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const [instrumentoSeleccionado, setInstrumentoSeleccionado] = useState<any>(null);
    const [plantillaFormulario, setPlantillaFormulario] = useState<any>(null);
    const [respuestas, setRespuestas] = useState<RespuestaTemporal[]>([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [estadisticasAlumnos, setEstadisticasAlumnos] = useState<DetalleEncuestaCompleto | null>(null);
    const [cargandoEstadisticas, setCargandoEstadisticas] = useState(false);

    const { materiaNombre, materiaId, rol } = location.state || {};
    const esDocente = rol === 'docente';

    // Si hay instrumentoId en params, cargarlo directamente
    useEffect(() => {
        if (instrumentoIdParam) {
            cargarInstrumento(parseInt(instrumentoIdParam));
        }
    }, [instrumentoIdParam]);

    // Cargar estadísticas cuando se obtenga la materia
    useEffect(() => {
        if (materiaId && esDocente) {
            cargarEstadisticasAlumnos(materiaId);
        }
    }, [materiaId, esDocente]);

    const cargarEstadisticasAlumnos = async (materiaId: string) => {
        setCargandoEstadisticas(true);
        try {
            // TODO: Reemplazar con endpoint real para obtener respuestas de alumnos
            console.log(`Cargando estadísticas para materia: ${materiaId}`);
            
            // delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Usar mock data temporalmente
            setEstadisticasAlumnos(mockEstadisticasAlumnos);
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        } finally {
            setCargandoEstadisticas(false);
        }
    };

    // Cargar datos del instrumento
    const cargarInstrumento = async (instrumentoId: number) => {
        setCargando(true);
        setError('');
        try {
            const instrumentoResponse = await fetch(`http://127.0.0.1:8000/instrumentos/${instrumentoId}/detail`);
            if (!instrumentoResponse.ok) throw new Error('No se pudo cargar el instrumento');
            const instrumentoData = await instrumentoResponse.json();
            setInstrumentoSeleccionado(instrumentoData);

            const plantillaResponse = await fetch(`http://127.0.0.1:8000/formularios/${instrumentoData.plantilla_formulario_id}`);
            if (!plantillaResponse.ok) throw new Error('No se pudo cargar el formulario');
            const plantillaData = await plantillaResponse.json();
            setPlantillaFormulario(plantillaData);

            const respuestasIniciales = plantillaData.preguntas.map((pregunta: any) => ({
                pregunta_id: pregunta.id,
                texto: '',
                opcion_id: undefined,
            }));
            setRespuestas(respuestasIniciales);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    // Actualizar respuesta
    const actualizarRespuesta = (preguntaId: number, texto?: string, opcionId?: number) => {
        setRespuestas((prev) =>
            prev.map((r) =>
                r.pregunta_id === preguntaId
                    ? { ...r, texto: texto ?? r.texto, opcion_id: opcionId ?? r.opcion_id }
                    : r
            )
        );
    };

    const obtenerRespuesta = (preguntaId: number) => respuestas.find(r => r.pregunta_id === preguntaId);

    const todasRespondidas = respuestas.every(r => r.texto?.trim() || r.opcion_id);

    // Enviar respuestas
    const enviarRespuestas = async (): Promise<boolean> => {
        if (!instrumentoSeleccionado) return false;
        setEnviando(true);

        try {
            const formularioResponse = await fetch('http://127.0.0.1:8000/RespuestasFormulario/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    materia_id: instrumentoSeleccionado.materia?.id,
                    usuario_id: USUARIO_ACTUAL.id,
                    instrumento_id: instrumentoSeleccionado.id,
                    fecha_envio: new Date().toISOString().split('T')[0],
                    respuestas: []
                })
            });

            if (!formularioResponse.ok) throw new Error('Error al crear el formulario');
            const formularioCreado = await formularioResponse.json();

            const promesasRespuestas = respuestas
                .filter(r => r.texto?.trim() || r.opcion_id)
                .map(r =>
                    fetch('http://127.0.0.1:8000/respuestas/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            pregunta_id: r.pregunta_id,
                            texto: r.texto?.trim() || null,
                            opcion_id: r.opcion_id || null,
                            formulario_id: formularioCreado.id,
                        }),
                    })
                );

            await Promise.all(promesasRespuestas);
            return true;
        } catch (err: any) {
            console.error(err);
            alert('Error al enviar las respuestas: ' + err.message);
            return false;
        } finally {
            setEnviando(false);
        }
    };

    // Si hay instrumento seleccionado, mostrar formulario
    if (cargando) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" role="status" className="mb-3" />
                <p>Cargando informe de cátedra...</p>
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
                        <Button variant="outline-danger" onClick={() => navigate(-1)}>
                            Volver atrás
                        </Button>
                    </div>
                </Alert>
            </Container>
        );
    }

    const rutaVolver = '/instrumentos-docente';

    return (
        <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh", paddingTop: "2.5rem", paddingBottom: "2.5rem" }}>
            <Container style={{ maxWidth: '1200px' }}>
                <Button variant="outline-secondary" className="mb-3" onClick={() => navigate(rutaVolver)}>
                    ← Volver a Informes de Cátedra
                </Button>

                <Card className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
                    <div className="text-center mb-3 mt-3">
                        <h1 className="fw-bold mb-2" style={{ color: "#1f2937", fontSize: "1.875rem" }}>
                            {plantillaFormulario?.titulo || instrumentoSeleccionado?.nombre || `Informe de Cátedra - ${materiaNombre}`}
                        </h1>
                        <p className="text-muted mb-0">
                            Complete el informe de cátedra basándose en las respuestas de los estudiantes
                        </p>
                    </div>

                    <Card.Body className="p-3 p-md-4">
                        {esDocente && (
                            <Tabs defaultActiveKey="formulario" className="mb-4">
                                <Tab eventKey="formulario" title="📝 Completar Informe">
                                    {/* Formulario del docente */}
                                    {plantillaFormulario?.preguntas?.map((pregunta: any, idx: number) => (
                                        <Card key={pregunta.id} className="border-0 shadow-sm w-100 mb-3" style={{ borderRadius: "1rem" }}>
                                            <Card.Body className="p-3">
                                                <div className="mb-2 d-flex align-items-center gap-3">
                                                    <Badge bg="secondary" className="rounded-circle" style={{ width: '35px', height: '35px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {idx + 1}
                                                    </Badge>
                                                    <div>
                                                        <h5 className="fw-semibold mb-1">{pregunta.texto}</h5>
                                                        <Badge bg={pregunta.tipo.toLowerCase() === EnumTipoPregunta.abierta ? 'success' : 'info'}>
                                                            {pregunta.tipo === EnumTipoPregunta.abierta ? EnumTipoPregunta.abierta : EnumTipoPregunta.cerrada}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {pregunta.tipo.toLowerCase() === EnumTipoPregunta.abierta.toLowerCase() ? (
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={4}
                                                        value={obtenerRespuesta(pregunta.id)?.texto || ''}
                                                        onChange={(e) => actualizarRespuesta(pregunta.id, e.target.value)}
                                                        placeholder="Escriba su respuesta basándose en las estadísticas de los estudiantes..."
                                                        className="input-pregunta"
                                                        style={{ marginBottom: '0.5rem' }}
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
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </Tab>

                                <Tab eventKey="estadisticas" title="📊 Respuestas de Estudiantes">
                                    {/* Estadísticas de alumnos */}
                                    {cargandoEstadisticas ? (
                                        <div className="text-center py-4">
                                            <Spinner animation="border" role="status" className="mb-3" />
                                            <p>Cargando respuestas de estudiantes...</p>
                                        </div>
                                    ) : estadisticasAlumnos ? (
                                        <div>
                                            <h4 className="mb-3">Respuestas de los Estudiantes - {materiaNombre}</h4>
                                            {/* Integración del componente DetalleEncuestaAgregada */}
                                            <Card className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
                                                <Card.Body className="p-4">
                                                    <div className="mb-4">
                                                        <h5 className="fw-bold mb-2">{estadisticasAlumnos.titulo_formulario}</h5>
                                                        <p className="text-muted mb-0">Resultados agregados de la encuesta de estudiantes</p>
                                                    </div>
                                                    
                                                    <hr className="my-4" />

                                                    {/* Estadísticas de preguntas cerradas */}
                                                    {estadisticasAlumnos.estadisticas.map((estadistica) => (
                                                        <div key={estadistica.pregunta_id} className="mb-4">
                                                            <h6 className="fw-semibold mb-3">{estadistica.pregunta_texto}</h6>
                                                            {estadistica.opciones.map((opcion, idx) => (
                                                                <div key={idx} className="d-flex align-items-center mb-2">
                                                                    <div className="me-3" style={{ minWidth: '200px' }}>
                                                                        <span className="text-muted">{opcion.texto_opcion}</span>
                                                                    </div>
                                                                    <div className="flex-grow-1">
                                                                        <div className="progress" style={{ height: '20px' }}>
                                                                            <div 
                                                                                className="progress-bar" 
                                                                                role="progressbar" 
                                                                                style={{ 
                                                                                    width: `${(opcion.cantidad / Math.max(...estadistica.opciones.map(o => o.cantidad))) * 100}%`,
                                                                                    backgroundColor: `hsl(${idx * 60}, 70%, 50%)`
                                                                                }}
                                                                                aria-valuenow={opcion.cantidad}
                                                                                aria-valuemin={0}
                                                                                aria-valuemax={Math.max(...estadistica.opciones.map(o => o.cantidad))}
                                                                            >
                                                                                {opcion.cantidad} respuestas
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))}
                                                    
                                                    {/* Respuestas abiertas */}
                                                    {estadisticasAlumnos.respuestas_abiertas_agrupadas.map(grupo => (
                                                        <div key={grupo.grupo}>
                                                            <hr className="my-4" />
                                                            <h5 className="fw-semibold mb-3">{grupo.titulo_grupo}:</h5>
                                                            
                                                            {grupo.preguntas.map((pregunta, index) => (
                                                                <div key={index} className="mb-4">
                                                                    <h6 className="fw-bold">{pregunta.pregunta_texto}</h6>
                                                                    <div className="ms-3">
                                                                        {pregunta.respuestas_abiertas.map((respuesta, rIndex) => (
                                                                            <div key={rIndex} className="mb-2 ps-3 border-start border-3 border-light">
                                                                                <p className="fst-italic text-muted mb-1 small">
                                                                                    "{respuesta || "(Sin respuesta)"}"
                                                                                </p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    {pregunta.respuestas_abiertas.length > 0 && (
                                                                        <div className="text-end mt-2">
                                                                            <Badge pill bg="secondary">
                                                                                {pregunta.respuestas_abiertas.length} respuestas
                                                                            </Badge>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </Card.Body>
                                            </Card>
                                        </div>
                                    ) : (
                                        <Alert variant="warning">
                                            <i className="fas fa-exclamation-triangle me-2"></i>
                                            No se pudieron cargar las respuestas de los estudiantes para esta materia.
                                        </Alert>
                                    )}
                                </Tab>
                            </Tabs>
                        )}

                        {!esDocente && (
                            // Vista normal para otros roles (por si acaso)
                            plantillaFormulario?.preguntas?.map((pregunta: any, idx: number) => (
                                <Card key={pregunta.id} className="border-0 shadow-sm w-100 mb-3" style={{ borderRadius: "1rem" }}>
                                    <Card.Body className="p-3">
                                        <div className="mb-2 d-flex align-items-center gap-3">
                                            <Badge bg="secondary" className="rounded-circle" style={{ width: '35px', height: '35px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {idx + 1}
                                            </Badge>
                                            <div>
                                                <h5 className="fw-semibold mb-1">{pregunta.texto}</h5>
                                                <Badge bg={pregunta.tipo.toLowerCase() === EnumTipoPregunta.abierta ? 'success' : 'info'}>
                                                    {pregunta.tipo === EnumTipoPregunta.abierta ? EnumTipoPregunta.abierta : EnumTipoPregunta.cerrada}
                                                </Badge>
                                            </div>
                                        </div>

                                        {pregunta.tipo.toLowerCase() === EnumTipoPregunta.abierta.toLowerCase() ? (
                                            <Form.Control
                                                as="textarea"
                                                rows={4}
                                                value={obtenerRespuesta(pregunta.id)?.texto || ''}
                                                onChange={(e) => actualizarRespuesta(pregunta.id, e.target.value)}
                                                placeholder="Escriba su respuesta..."
                                                className="input-pregunta"
                                                style={{ marginBottom: '0.5rem' }}
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
                                    </Card.Body>
                                </Card>
                            ))
                        )}

                        {todasRespondidas ? (
                            <Alert variant="success" className="text-center mt-3">¡Listo para enviar el informe!</Alert>
                        ) : (
                            <Alert variant="warning" className="text-center mt-3">Por favor, complete todas las preguntas antes de enviar.</Alert>
                        )}

                        <Row className="mt-4">
                            <Col md={6} className="mb-2">
                                <Button variant="outline-secondary" className="w-100" onClick={() => navigate(rutaVolver)}>
                                    Volver a Informes
                                </Button>
                            </Col>
                            <Col md={6} className="mb-2">
                                <ModalExito
                                    onEnviar={enviarRespuestas}
                                    onExito={() => navigate(rutaVolver)}
                                    desactivado={!todasRespondidas || enviando}
                                    variante="success"
                                    textoBoton="Enviar Informe de Cátedra"
                                    className="w-100"
                                />
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}