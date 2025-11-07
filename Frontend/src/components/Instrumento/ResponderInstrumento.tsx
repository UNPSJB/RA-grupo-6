import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Button, Alert, Badge, Spinner, Form, Tabs, Tab, Row, Col } from 'react-bootstrap';
import ModalExito from "../ModalEnvio";
import { EnumTipoPregunta } from "../types";
import {Llamadora } from '../Respuesta/VerPorcentajes';

export interface InstanciaRespuestas {
    [preguntaId: number]: RespuestaTemporal;
}

export interface RespuestaTemporal {
    pregunta_id: number;
    texto?: string;
    opcion_id?: number;
    instancia_respuesta?: number;
}

export default function ResponderInstrumento() {
    const { instrumentoId: instrumentoIdParam } = useParams<{ instrumentoId: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const [instrumentoSeleccionado, setInstrumentoSeleccionado] = useState<any>(null);
    const [plantillaFormulario, setPlantillaFormulario] = useState<any>(null);

    const [respuestas, setRespuestas] = useState<RespuestaTemporal[]>([]);
    const [respuestasMultiples, setRespuestasMultiples] = useState<{
        [grupoCuadroId: number]: InstanciaRespuestas[];
    }>({});

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [usuarioActual, setUsuarioActual] = useState<any>(null);

    useEffect(() => {
        const usuario = localStorage.getItem('usuario_actual');
        if (usuario) setUsuarioActual(JSON.parse(usuario));
    }, []);

    const locationState = location.state || {};
    const rolActual = locationState.rol || localStorage.getItem('rol_actual');
    const esDocente = rolActual === 'docente';
    const esAlumno = rolActual === 'alumno';
    const materiaNombre = locationState.materiaNombre || '';
    const rutaVolver = esDocente ? '/instrumentos-docente' : esAlumno ? '/materias' : '/';

    useEffect(() => {
        if (instrumentoIdParam) cargarInstrumento(parseInt(instrumentoIdParam));
    }, [instrumentoIdParam]);

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

            const respuestasIniciales = plantillaData.preguntas
                .filter((p: any) => !p.multiple_respuestas)
                .map((pregunta: any) => ({
                    pregunta_id: pregunta.id,
                    texto: '',
                    opcion_id: undefined,
                }));
            setRespuestas(respuestasIniciales);

            const preguntasMultiples = plantillaData.preguntas.filter((p: any) => p.multiple_respuestas);
            const gruposCuadro = new Set<number>(
                preguntasMultiples
                    .map((p: any) => p.grupo_cuadro_id)
                    .filter((id: any): id is number => id !== null && id !== undefined)
            );

            const respuestasMultiplesIniciales: any = {};
            gruposCuadro.forEach((grupoCuadroId: number) => {
                const preguntasDelGrupo = preguntasMultiples.filter((p: any) => p.grupo_cuadro_id === grupoCuadroId);
                const primeraInstancia: InstanciaRespuestas = {};
                
                preguntasDelGrupo.forEach((pregunta: any) => {
                    primeraInstancia[pregunta.id] = {
                        pregunta_id: pregunta.id,
                        texto: '',
                        opcion_id: undefined,
                        instancia_respuesta: 1,
                    };
                });
                
                respuestasMultiplesIniciales[grupoCuadroId] = [primeraInstancia];
            });
            setRespuestasMultiples(respuestasMultiplesIniciales);
        } catch (err: unknown) {
            const mensaje = err instanceof Error ? err.message : 'Error desconocido';
            setError(mensaje);
        } finally {
            setCargando(false);
        }
    };

    const actualizarRespuesta = (preguntaId: number, texto?: string, opcionId?: number) => {
        setRespuestas((prev) =>
            prev.map((r) =>
                r.pregunta_id === preguntaId
                    ? { ...r, texto: texto ?? r.texto, opcion_id: opcionId ?? r.opcion_id }
                    : r
            )
        );
    };

    const obtenerRespuesta = (preguntaId: number) => respuestas.find((r) => r.pregunta_id === preguntaId);

    const instanciaEstaCompleta = (instancia: InstanciaRespuestas): boolean => {
        return Object.values(instancia).every((r: RespuestaTemporal) => r.texto?.trim() || r.opcion_id);
    };

    const agregarInstanciaRespuestas = (grupoCuadroId: number, preguntasDelGrupo: any[]) => {
        setRespuestasMultiples((prev) => {
            const instanciasActuales = prev[grupoCuadroId] || [];
            const nuevaInstancia: InstanciaRespuestas = {};

            preguntasDelGrupo.forEach((pregunta) => {
                nuevaInstancia[pregunta.id] = {
                    pregunta_id: pregunta.id,
                    texto: '',
                    opcion_id: undefined,
                    instancia_respuesta: instanciasActuales.length + 1,
                };
            });

            return {
                ...prev,
                [grupoCuadroId]: [...instanciasActuales, nuevaInstancia],
            };
        });
    };

    const actualizarRespuestaMultiple = (
        grupoCuadroId: number,
        instanciaIndex: number,
        preguntaId: number,
        texto?: string,
        opcionId?: number
    ) => {
        setRespuestasMultiples((prev) => {
            const nuevoEstado = { ...prev };
            const instancia = nuevoEstado[grupoCuadroId][instanciaIndex];
            instancia[preguntaId] = {
                ...instancia[preguntaId],
                texto: texto ?? instancia[preguntaId].texto,
                opcion_id: opcionId ?? instancia[preguntaId].opcion_id,
            };
            return nuevoEstado;
        });
    };

    const eliminarInstancia = (grupoCuadroId: number, instanciaIndex: number) => {
        setRespuestasMultiples((prev) => ({
            ...prev,
            [grupoCuadroId]: prev[grupoCuadroId].filter((_, idx) => idx !== instanciaIndex),
        }));
    };

    const todasRespondidas = (): boolean => {
        const simplesCompletas = respuestas.every((r) => r.texto?.trim() || r.opcion_id);

        const preguntasMultiples = plantillaFormulario?.preguntas.filter((p: any) => p.multiple_respuestas) || [];
        const gruposCuadro = new Set<number>(
            preguntasMultiples
                .map((p: any) => p.grupo_cuadro_id)
                .filter((id: any): id is number => id !== null && id !== undefined)
        );

        const multiplesCompletas = Array.from(gruposCuadro).every((grupoCuadroId: number) => {
            const instancias = respuestasMultiples[grupoCuadroId] || [];
            return (
                instancias.length > 0 &&
                instancias.every((instancia) =>
                    Object.values(instancia).every((r: RespuestaTemporal) => r.texto?.trim() || r.opcion_id)
                )
            );
        });

        return simplesCompletas && multiplesCompletas;
    };

    const enviarRespuestas = async (): Promise<boolean> => {
        if (!instrumentoSeleccionado || !usuarioActual) return false;
        setEnviando(true);
        try {
            const cuerpoFormulario = {
                materia_id: instrumentoSeleccionado.materia?.id,
                usuario_id: usuarioActual.id,
                instrumento_id: instrumentoSeleccionado.id,
                fecha_envio: new Date().toISOString().split('T')[0],
            };

            const formularioResponse = await fetch('http://127.0.0.1:8000/RespuestasFormulario/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cuerpoFormulario),
            });

            if (!formularioResponse.ok) throw new Error('Error al crear el formulario');
            const formularioCreado = await formularioResponse.json();

            const respuestasFiltradas = respuestas.filter((r) => r.texto?.trim() || r.opcion_id);
            await Promise.all(
                respuestasFiltradas.map(async (r) => {
                    const cuerpoRespuesta = {
                        pregunta_id: r.pregunta_id,
                        texto: r.texto?.trim() || null,
                        opcion_id: r.opcion_id || null,
                        formulario_id: formularioCreado.id,
                        instancia_respuesta: null,
                    };
                    const respuestaResponse = await fetch('http://127.0.0.1:8000/respuestas/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(cuerpoRespuesta),
                    });
                    if (!respuestaResponse.ok) throw new Error(`Error al enviar respuesta ${r.pregunta_id}`);
                })
            );

            for (const [grupoCuadroId, instancias] of Object.entries(respuestasMultiples)) {
                for (let instanciaIndex = 0; instanciaIndex < instancias.length; instanciaIndex++) {
                    const instancia = instancias[instanciaIndex];
                    for (const [preguntaId, respuesta] of Object.entries(instancia)) {
                        if (respuesta.texto?.trim() || respuesta.opcion_id) {
                            const cuerpoRespuesta = {
                                pregunta_id: parseInt(preguntaId),
                                texto: respuesta.texto?.trim() || null,
                                opcion_id: respuesta.opcion_id || null,
                                formulario_id: formularioCreado.id,
                                instancia_respuesta: instanciaIndex + 1,
                            };
                            const respuestaResponse = await fetch('http://127.0.0.1:8000/respuestas/', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(cuerpoRespuesta),
                            });
                            if (!respuestaResponse.ok)
                                throw new Error(`Error al enviar respuesta múltiple ${preguntaId}`);
                        }
                    }
                }
            }
            return true;
        } catch (err: unknown) {
            const mensaje = err instanceof Error ? err.message : 'Error desconocido';
            alert('Error al enviar las respuestas: ' + mensaje);
            return false;
        } finally {
            setEnviando(false);
        }
    };

    const preguntasPorGrupoCuadro = () => {
        if (!plantillaFormulario) return {};
        const grupos: any = {};
        plantillaFormulario.preguntas.forEach((pregunta: any) => {
            if (pregunta.multiple_respuestas && pregunta.grupo_cuadro_id) {
                if (!grupos[pregunta.grupo_cuadro_id]) grupos[pregunta.grupo_cuadro_id] = [];
                grupos[pregunta.grupo_cuadro_id].push(pregunta);
            }
        });
        Object.keys(grupos).forEach((key) => {
            grupos[key].sort((a: any, b: any) => (a.orden_en_grupo || 0) - (b.orden_en_grupo || 0));
        });
        return grupos;
    };

    if (cargando)
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" role="status" className="mb-3" />
                <p>Cargando formulario...</p>
            </Container>
        );

    if (error)
        return (
            <Container className="mt-4">
                <Alert variant="danger">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                    <div className="mt-3">
                        <Button variant="outline-danger" onClick={() => navigate(rutaVolver)}>
                            Volver atrás
                        </Button>
                    </div>
                </Alert>
            </Container>
        );

    const gruposCuadro = preguntasPorGrupoCuadro();

    return (
        <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh', paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
            <Container style={{ maxWidth: '1200px' }}>
                <Button variant="outline-secondary" className="mb-3" onClick={() => navigate(rutaVolver)}>
                    ← Volver {esDocente ? 'a Informes de Cátedra' : esAlumno ? 'a Materias' : 'atrás'}
                </Button>

                <Card className="border-0 shadow-sm w-100" style={{ borderRadius: '1rem' }}>
                    <div className="text-center mb-3 mt-3">
                        <h1 className="fw-bold mb-2" style={{ color: '#1f2937', fontSize: '1.875rem' }}>
                            {plantillaFormulario?.titulo || `Informe de Cátedra - ${materiaNombre}`}
                        </h1>
                        <p className="text-muted mb-0">
                            {esDocente ? 'Complete el informe de cátedra' : 'Complete la encuesta con sus respuestas'}
                        </p>
                    </div>

                    <Card.Body className="p-3 p-md-4">
                        {esDocente && (
                            <Tabs defaultActiveKey="formulario" className="mb-4">
                                <Tab eventKey="formulario" title="Completar Informe">
                                    <div className="mb-4">
                                        <Llamadora id_instrumento={instrumentoSeleccionado?.id}/>
                                    </div>
                                </Tab>
                            </Tabs>
                        )}

                        {plantillaFormulario?.preguntas
                            ?.filter((p: any) => !p.multiple_respuestas)
                            .map((pregunta: any, idx: number) => (
                                <Card
                                    key={pregunta.id}
                                    className="border-0 shadow-sm w-100 mb-3"
                                    style={{ borderRadius: '1rem' }}
                                >
                                    <Card.Body className="p-3">
                                        <div className="mb-2 d-flex align-items-center gap-3">
                                            <Badge
                                                bg="secondary"
                                                className="rounded-circle"
                                                style={{
                                                    width: '35px',
                                                    height: '35px',
                                                    fontSize: '1rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                {idx + 1}
                                            </Badge>
                                            <div>
                                                <h5 className="fw-semibold mb-1">{pregunta.texto}</h5>
                                                <Badge bg={pregunta.tipo === EnumTipoPregunta.abierta ? 'success' : 'info'}>
                                                    {pregunta.tipo}
                                                </Badge>
                                            </div>
                                        </div>

                                        {pregunta.tipo === EnumTipoPregunta.abierta ? (
                                            <Form.Control
                                                as="textarea"
                                                rows={4}
                                                value={obtenerRespuesta(pregunta.id)?.texto || ''}
                                                onChange={(e) => actualizarRespuesta(pregunta.id, e.target.value)}
                                                placeholder="Escriba su respuesta..."
                                                className="input-pregunta"
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
                                                        onChange={() =>
                                                            actualizarRespuesta(pregunta.id, undefined, opcion.id)
                                                        }
                                                        className="mb-2"
                                                    />
                                                ))}
                                            </Form.Group>
                                        )}
                                    </Card.Body>
                                </Card>
                            ))}

                        {Object.entries(gruposCuadro).map(([grupoCuadroId, preguntasGrupo]: [string, any]) => {
                            const grupoId = parseInt(grupoCuadroId);
                            const instancias = respuestasMultiples[grupoId] || [];
                            const ultimaInstanciaCompleta = instancias.length === 0 || instanciaEstaCompleta(instancias[instancias.length - 1]);

                            return (
                                <div key={grupoId} className="mb-4">
                                    <div className="mb-3">
                                        <h5 className="fw-bold mb-1" style={{ color: '#1f2937' }}>
                                            Grupo de preguntas repetibles
                                        </h5>
                                        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                                            Complete las siguientes preguntas. Puede agregar más según necesite.
                                        </p>
                                    </div>

                                    {instancias.map((instancia, instanciaIdx) => (
                                        <div key={instanciaIdx} className="mb-3">
                                            {instancias.length > 1 && (
                                                <div className="d-flex justify-content-end mb-2">
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => eliminarInstancia(grupoId, instanciaIdx)}
                                                    >
                                                        <i className="fas fa-trash me-1"></i>
                                                        Eliminar
                                                    </Button>
                                                </div>
                                            )}

                                            {preguntasGrupo.map((pregunta: any, idx: number) => (
                                                <Card
                                                    key={pregunta.id}
                                                    className="border-0 shadow-sm w-100 mb-3"
                                                    style={{ borderRadius: '1rem' }}
                                                >
                                                    <Card.Body className="p-3">
                                                        <div className="mb-2 d-flex align-items-center gap-3">
                                                            <Badge
                                                                bg="secondary"
                                                                className="rounded-circle"
                                                                style={{
                                                                    width: '35px',
                                                                    height: '35px',
                                                                    fontSize: '1rem',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                }}
                                                            >
                                                                {idx + 1}
                                                            </Badge>
                                                            <div>
                                                                <h5 className="fw-semibold mb-1">{pregunta.texto}</h5>
                                                                <Badge
                                                                    bg={
                                                                        pregunta.tipo === EnumTipoPregunta.abierta
                                                                            ? 'success'
                                                                            : 'info'
                                                                    }
                                                                >
                                                                    {pregunta.tipo}
                                                                </Badge>
                                                            </div>
                                                        </div>

                                                        {pregunta.tipo === EnumTipoPregunta.abierta ? (
                                                            <Form.Control
                                                                as="textarea"
                                                                rows={4}
                                                                value={instancia[pregunta.id]?.texto || ''}
                                                                onChange={(e) =>
                                                                    actualizarRespuestaMultiple(
                                                                        grupoId,
                                                                        instanciaIdx,
                                                                        pregunta.id,
                                                                        e.target.value
                                                                    )
                                                                }
                                                                placeholder="Escriba su respuesta..."
                                                                className="input-pregunta"
                                                            />
                                                        ) : (
                                                            <Form.Group>
                                                                {pregunta.opciones?.map((opcion: any) => (
                                                                    <Form.Check
                                                                        key={opcion.id}
                                                                        type="radio"
                                                                        name={`pregunta-${pregunta.id}-instancia-${instanciaIdx}`}
                                                                        label={opcion.texto}
                                                                        checked={
                                                                            instancia[pregunta.id]?.opcion_id ===
                                                                            opcion.id
                                                                        }
                                                                        onChange={() =>
                                                                            actualizarRespuestaMultiple(
                                                                                grupoId,
                                                                                instanciaIdx,
                                                                                pregunta.id,
                                                                                undefined,
                                                                                opcion.id
                                                                            )
                                                                        }
                                                                        className="mb-2"
                                                                    />
                                                                ))}
                                                            </Form.Group>
                                                        )}
                                                    </Card.Body>
                                                </Card>
                                            ))}
                                        </div>
                                    ))}

                                    <div className="text-end">
                                        {!ultimaInstanciaCompleta && (
                                            <small className="text-muted d-block mt-2">
                                                Complete todas las respuestas antes de agregar más
                                            </small>
                                        )}
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => agregarInstanciaRespuestas(grupoId, preguntasGrupo)}
                                            disabled={!ultimaInstanciaCompleta}
                                            className="d-flex align-items-center gap-2 ms-auto"
                                        >
                                            <i className="fas fa-plus"></i>
                                            Agregar más
                                        </Button>
                                        
                                    </div>
                                </div>
                            );
                        })}

                        {todasRespondidas() ? (
                            <Alert variant="success" className="text-center mt-3">
                                {esDocente
                                    ? "¡Listo para enviar el informe!"
                                    : "¡Listo para enviar la encuesta!"}
                            </Alert>
                        ) : (
                            <Alert
                                variant="warning"
                                className="text-center mt-3"
                            >
                                Por favor, complete todas las preguntas antes de enviar.
                            </Alert>
                        )}

                        <Row className="mt-4">
                            <Col md={6} className="mb-2">
                                <Button
                                    variant="outline-secondary"
                                    className="w-100"
                                    onClick={() => navigate(rutaVolver)}
                                >
                                    Volver {esDocente ? 'a Informes' : 'a Materias'}
                                </Button>
                            </Col>
                            <Col md={6} className="mb-2">
                                <ModalExito
                                    onEnviar={enviarRespuestas}
                                    onExito={() => navigate(rutaVolver)}
                                    desactivado={!todasRespondidas() || enviando}
                                    variante="success"
                                    textoBoton={
                                        esDocente
                                            ? "Enviar Informe de Cátedra"
                                            : "Enviar Encuesta"
                                    }
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
