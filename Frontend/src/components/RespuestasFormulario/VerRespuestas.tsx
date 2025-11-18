import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Button, Alert, Spinner, Badge, Stack } from 'react-bootstrap';
import type { GrupoPreguntas } from '../types';
import { organizarPreguntasEnGrupos } from '../Pregunta/OrganizarPreguntas';

interface RespuestaGuardada {
    id: number;
    texto: string | null;
    opcion_id: number | null;
    opcion?: { id: number; texto: string };
    pregunta_id: number;
    pregunta?: { id: number; texto: string; tipo: string };
    formulario_id: number;
}

export default function VerRespuestas() {
    const { respuestasFormularioId } = useParams<{ respuestasFormularioId: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const [respuestas, setRespuestas] = useState<RespuestaGuardada[]>([]);
    const [plantillaFormulario, setPlantillaFormulario] = useState<any>(null);
    const [cargando, setCargando] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [grupoActivo, setGrupoActivo] = useState<number>(0);

    const locationState = location.state as any || {};
    const materiaNombre = locationState.materiaNombre || '';
    const fechaEnvio = locationState.fechaEnvio || '';
    const plantillaFormularioId = locationState.plantillaFormularioId;

    useEffect(() => {
        if (respuestasFormularioId) {
            cargarDatos(parseInt(respuestasFormularioId));
        }
    }, [respuestasFormularioId]);

    const cargarDatos = async (formId: number): Promise<void> => {
        setCargando(true);
        setError('');

        try {
            const resp = await fetch(
                `http://127.0.0.1:8000/respuestas/?formulario_id=${formId}`
            );

            if (!resp.ok) throw new Error('No se pudieron cargar las respuestas');

            const respuestasData: RespuestaGuardada[] = await resp.json();
            setRespuestas(respuestasData);

            if (plantillaFormularioId) {
                const plantillaResponse = await fetch(
                    `http://127.0.0.1:8000/formularios/${plantillaFormularioId}`
                );

                if (plantillaResponse.ok) {
                    const plantillaData = await plantillaResponse.json();
                    setPlantillaFormulario(plantillaData);
                } else {
                    console.warn("No se pudo cargar PlantillaFormulario");
                }
            }
        } catch (e: unknown) {
            const mensaje = e instanceof Error ? e.message : 'Error';
            setError(mensaje);
        } finally {
            setCargando(false);
        }
    };

    const obtenerRespuestasDePregunta = (preguntaId: number): RespuestaGuardada[] =>
        respuestas.filter((r) => r.pregunta_id === preguntaId);

    const renderRespuesta = (respuesta: RespuestaGuardada, pregunta: any, i: number): JSX.Element => {
        const opcionTexto =
            respuesta.opcion?.texto ||
            (pregunta.opciones?.find((op: any) => op.id === respuesta.opcion_id)?.texto ?? '');

        const contenido = respuesta.texto || opcionTexto || 'No respondida';

        return (
            <div key={i} className="p-3 rounded bg-light mb-2 border w-100">
                <div className="d-flex align-items-start">
                    <i className="fas fa-check-circle text-success me-2 mt-1"></i>
                    <span className="flex-grow-1" style={{ lineHeight: '1.5' }}>
                        {contenido}
                    </span>
                </div>
            </div>
        );
    };

    if (cargando) {
        return (
            <Container className="mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <Card className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
                            <Card.Body className="p-4 p-md-5 text-center">
                                <Spinner animation="border" role="status" className="mb-3">
                                    <span className="visually-hidden">Cargando respuestas...</span>
                                </Spinner>
                                <p className="text-muted">Cargando respuestas...</p>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <Card className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
                            <Card.Body className="p-4 p-md-5">
                                <Alert variant="danger" className="mb-0">
                                    <i className="fas fa-exclamation-triangle me-2"></i>
                                    {error}
                                </Alert>
                                <div className="text-center mt-4">
                                    <Button variant="secondary" onClick={() => navigate('/mis-respuestas')}>
                                        Volver a mis encuestas respondidas
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </Container>
        );
    }

    const gruposOrganizados: GrupoPreguntas[] = plantillaFormulario
        ? organizarPreguntasEnGrupos(plantillaFormulario)
        : [];


    const estiloBotonActivo = { backgroundColor: "#0d6efd", border: "none", color: "#fff" };
    const estiloBotonInactivo = { backgroundColor: "#E8ECEF", border: "none", color: "#5A5B65" };

    return (
        <Container fluid className="mt-4 px-4">
            <div className="row justify-content-center">
                <div className="col-12">
                    <Card className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
                        <Card.Body className="p-4 p-md-5">

                            {/* Encabezado */}
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <h1 className="fw-bold mb-2">Respuestas enviadas</h1>
                                        <p className="text-muted mb-0">
                                            Materia: {materiaNombre}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex gap-3">
                                        <Badge bg="secondary" className="fs-6">
                                            <i className="fas fa-calendar me-1" />
                                            {new Date(fechaEnvio).toLocaleDateString()}
                                        </Badge>
                                        <Badge bg="info" className="fs-6">
                                            <i className="fas fa-eye me-1" />
                                            Modo lectura
                                        </Badge>
                                    </div>

                                    <div className="text-end">
                                        <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                                            <span style={{ color: "grey", fontSize: "13px" }}>TOTAL PREGUNTAS</span>
                                            <br />
                                            {gruposOrganizados.reduce((total, grupo) => total + grupo.preguntas.length, 0)} preguntas
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Botón volver */}
                            <div className="mb-4">
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => navigate('/mis-respuestas')}
                                    className="mb-3"
                                >
                                    <i className="fa-solid fa-arrow-left me-2"></i>
                                    Volver a mis encuestas respondidas
                                </Button>
                            </div>

                            {/* Botones de navegación entre grupos */}
                            {gruposOrganizados.length > 1 && (
                                <Stack className="pt-3 pb-3 mb-4" direction="horizontal" gap={3}>
                                    {gruposOrganizados.map((grupo, index) => (
                                        <Button
                                            key={grupo.id}
                                            style={grupoActivo === index ? estiloBotonActivo : estiloBotonInactivo}
                                            onClick={() => setGrupoActivo(index)}
                                            className="flex-grow-1"
                                        >
                                            {grupo.nombre} ({grupo.preguntas.length})
                                        </Button>
                                    ))}
                                </Stack>
                            )}

                            {/* Contenido de resputas */}
                            {!gruposOrganizados.length ? (
                                <div className="text-center py-5">
                                    <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                                    <h5 className="text-muted mb-3">No se encontraron preguntas para mostrar</h5>
                                    <p className="text-muted">
                                        No hay preguntas disponibles en esta encuesta.
                                    </p>
                                </div>
                            ) : (
                                <div className="respuestas-content">
                                    {/* Mostrar solo el grupo activo */}
                                    {gruposOrganizados.map((grupo, grupoIdx) => (
                                        grupoIdx === grupoActivo && (
                                            <div key={grupo.id}>
                                                {/* Encabezado del grupo */}
                                                {gruposOrganizados.length > 1 && (
                                                    <div
                                                        className="mb-4 p-3 rounded"
                                                        style={{
                                                            backgroundColor: "#e7f3ff",
                                                            borderLeft: "5px solid #0d6efd",
                                                        }}
                                                    >
                                                        <h4 className="fw-bold mb-1 fs-5">{grupo.nombre}</h4>
                                                        <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                                                            {grupo.preguntas.length} preguntas
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Preguntas del grupo activo*/}
                                                {grupo.preguntas.map((pregunta) => {
                                                    const respuestasPregunta = obtenerRespuestasDePregunta(pregunta.id);

                                                    return (
                                                        <Card 
                                                            key={pregunta.id} 
                                                            className="mb-4 border-0 shadow-sm"
                                                            style={{
                                                                width: '100%',
                                                                minWidth: '100%',
                                                                maxWidth: '100%'
                                                            }}
                                                        >
                                                            <Card.Body 
                                                                className="p-4"
                                                                style={{
                                                                    width: '100%',
                                                                    minWidth: '100%'
                                                                }}
                                                            >
                                                                {/* Encabezado de pregunta*/}
                                                                <div 
                                                                    className="mb-3"
                                                                    style={{
                                                                        width: '100%',
                                                                        minWidth: '100%',
                                                                        maxWidth: '100%'
                                                                    }}
                                                                >
                                                                    <div 
                                                                        className="fw-bold mb-2"
                                                                        style={{ 
                                                                            color: "#1f2937", 
                                                                            fontSize: "1.2rem",
                                                                            lineHeight: '1.4',
                                                                            width: '100%',
                                                                            minWidth: '100%',
                                                                            maxWidth: '100%',
                                                                            display: 'block',
                                                                            whiteSpace: 'normal',
                                                                            wordWrap: 'break-word',
                                                                            overflowWrap: 'break-word',
                                                                            wordBreak: 'normal',
                                                                            textAlign: 'left'
                                                                        }}
                                                                    >
                                                                        {pregunta.orden}. {pregunta.texto}
                                                                    </div>
                                                                    
                                                                    {/* Badges debajo del texto de la pregunta */}
                                                                    <div className="d-flex gap-2 flex-wrap mt-2">
                                                                        {pregunta.obligatoria && (
                                                                            <Badge bg="danger" className="fs-7">Obligatoria</Badge>
                                                                        )}
                                                                        {pregunta.tipo === "abierta" && (
                                                                            <Badge bg="secondary" className="fs-7">Abierta</Badge>
                                                                        )}
                                                                        {pregunta.tipo === "cerrada" && (
                                                                            <Badge bg="primary" className="fs-7">Cerrada</Badge>
                                                                        )}
                                                                        {pregunta.multiple_respuestas && (
                                                                            <Badge bg="warning" text="dark" className="fs-7">
                                                                                Varias respuestas
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Respuestas */}
                                                                <div 
                                                                    className="mt-3"
                                                                    style={{
                                                                        width: '100%',
                                                                        minWidth: '100%'
                                                                    }}
                                                                >
                                                                    {respuestasPregunta.length > 0 ? (
                                                                        respuestasPregunta.map((r, i) =>
                                                                            renderRespuesta(r, pregunta, i)
                                                                        )
                                                                    ) : (
                                                                        <div className="p-3 rounded bg-warning bg-opacity-10 w-100">
                                                                            <i className="fas fa-exclamation-circle me-2 text-warning"></i>
                                                                            <span className="text-muted">No respondida</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </Card.Body>
                                                        </Card>
                                                    );
                                                })}
                                            </div>
                                        )
                                    ))}
                                </div>
                            )}

                            {/* Botones al pie */}
                            <div className="text-center mt-4 pt-3 border-top">
                                <Button
                                    variant="outline-primary"
                                    onClick={() => navigate('/mis-respuestas')}
                                    className="me-3"
                                >
                                    <i className="fas fa-list me-2"></i>
                                    Volver a mis encuestas respondidas
                                </Button>

                                <Button
                                    variant="primary"
                                    onClick={() => navigate('/materias')}
                                >
                                    <i className="fas fa-edit me-2"></i>
                                    Responder otra encuesta
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </Container>
    );
}