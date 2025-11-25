import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Button, Alert, Spinner, Badge, Stack } from 'react-bootstrap';
import type { DetalleInformeSinteticoCompleto, GrupoPreguntas, GrupoRespuestasSintesis, RespuestaSintesis } from '../types';
import { organizarPreguntasEnGrupos } from '../Pregunta/OrganizarPreguntas';

import { PDFDownloadLink } from '@react-pdf/renderer';
import InformeSinteticoPDFDocument from './InformeSinteticoPDFDocument';
import ShadowedCard from '../coreui-components/ShadowedCard';
import { CCard, CCardBody, CCardHeader } from '@coreui/react';

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
    const tipoInstrumento = locationState.tipoInstrumento || 'ENCUESTA_ESTUDIANTE';

    useEffect(() => {
        if (respuestasFormularioId) {
            cargarTodosLosDatos(parseInt(respuestasFormularioId));
        }
    }, [respuestasFormularioId]);

    const cargarTodosLosDatos = async (formId: number): Promise<void> => {
        setCargando(true);
        setError('');

        try {
            await cargarDatosEncuesta(formId);
        } catch (e: unknown) {
            const mensaje = e instanceof Error ? e.message : 'Error al cargar los datos';
            setError(mensaje);
        } finally {
            setCargando(false);
        }
    };

    const cargarDatosEncuesta = async (formId: number): Promise<void> => {
        try {
            // Cargar respuestas
            const resp = await fetch(
                `http://127.0.0.1:8000/respuestas/?formulario_id=${formId}`
            );

            if (!resp.ok) throw new Error('No se pudieron cargar las respuestas');

            const respuestasData: RespuestaGuardada[] = await resp.json();
            setRespuestas(respuestasData);

            // Cargar plantilla del formulario
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
            throw e;
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
                <div className="d-flex align-items-start text-muted">
                    <i className="fas fa-check-circle text-success me-2 mt-1"></i>
                    <span className="flex-grow-1" style={{ lineHeight: '1.5', color:'black'}}>
                        {contenido}
                    </span>
                </div>
            </div>
            
        );
    };

    // Render preguntas de grupo
    const renderPreguntasDelGrupo = (grupo: GrupoPreguntas) => {
        return grupo.preguntas.map((pregunta) => {
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
                                {pregunta.texto}
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
                                        Repetible
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
        });
    };

    const getDatosParaPDF = (): DetalleInformeSinteticoCompleto => {
        const gruposOrganizados: GrupoPreguntas[] = plantillaFormulario
            ? organizarPreguntasEnGrupos(plantillaFormulario)
            : [];

        const respuestasSintesisAgrupadas: GrupoRespuestasSintesis[] = gruposOrganizados.map(grupo => {
            const respuestasProcesadas: RespuestaSintesis[] = grupo.preguntas.map(pregunta => {
                const respuestasPregunta = obtenerRespuestasDePregunta(pregunta.id);
                
                if (respuestasPregunta.length > 1) {
                    const textosRespuestas = respuestasPregunta.map(respuesta => {
                        const opcionTexto = respuesta.opcion?.texto || 
                            (pregunta.opciones?.find((op: any) => op.id === respuesta.opcion_id)?.texto ?? '');
                        return respuesta.texto || opcionTexto || 'No respondida';
                    });
                    
                    // joinear respuestas múltiples en una
                    return {
                        pregunta_texto: pregunta.texto,
                        respuesta_texto: textosRespuestas.join('; ')
                    };
                } 
                // Si hay una sola respuesta
                else if (respuestasPregunta.length === 1) {
                    const respuesta = respuestasPregunta[0];
                    const opcionTexto = respuesta.opcion?.texto || 
                        (pregunta.opciones?.find((op: any) => op.id === respuesta.opcion_id)?.texto ?? '');
                    const contenido = respuesta.texto || opcionTexto || 'No respondida';
                    
                    return {
                        pregunta_texto: pregunta.texto,
                        respuesta_texto: contenido
                    };
                } 
                // Si no hay respuestas
                else {
                    return {
                        pregunta_texto: pregunta.texto,
                        respuesta_texto: 'No respondida'
                    };
                }
            });

            return {
                grupo: grupo.id.toString(),
                titulo_grupo: grupo.nombre,
                respuestas: respuestasProcesadas
            };
        });

        return {
            id: parseInt(respuestasFormularioId || '0'),
            titulo_formulario:  (tipoInstrumento == 'INFORME_SINTETICO')? 'Informe Sintético' : 'Informe de Cátedra',
            departamento: materiaNombre,
            fecha_completado: fechaEnvio,
            respuestas_sintesis_agrupadas: respuestasSintesisAgrupadas
        };
    };

    // Informe Sintético
    const renderInforme = () => {
        const datosPDF = getDatosParaPDF();
        
        let prefijoArchivo = ""
        if (tipoInstrumento == 'INFORME_SINTETICO'){
            prefijoArchivo = "Informe-Sintetico"
        }
        else{
            prefijoArchivo = 'Informe-Catedra'
        }

        return (
            <div className="row justify-content-center">
                <Card className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
                    <Card.Body className="p-4 p-md-5">
                        {/* Vista */}
                        {renderVistaEncuesta()}

                        {/* Botón PDF*/}
                        <div className="d-grid gap-2 mb-4">
                        <PDFDownloadLink
                            document={<InformeSinteticoPDFDocument informe={datosPDF} />}
                            fileName={`${prefijoArchivo}-${materiaNombre}-${new Date(fechaEnvio).toISOString().split('T')[0]}.pdf`}
                            className="btn btn-primary"
                        >
                            {({ loading: pdfLoading }) => 
                                pdfLoading 
                                    ? <><Spinner as="span" animation="border" size="sm" /> Generando PDF...</>
                                    : `Descargar Informe ${tipoInstrumento == 'INFORME_SINTETICO'? "Sintético" : "de Catedra"} en PDF`
                            }
                        </PDFDownloadLink>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        );
    };

    // Render para encuestas e informes de cátedra
    const renderVistaEncuesta = () => {
        const gruposOrganizados: GrupoPreguntas[] = plantillaFormulario
            ? organizarPreguntasEnGrupos(plantillaFormulario)
            : [];

        if (!plantillaFormulario && respuestas.length > 0) {
            return (
                <div className="text-center py-5">
                    <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                    <h5 className="text-warning mb-3">Plantilla no disponible</h5>
                    <p className="text-muted">
                        Las respuestas se cargaron correctamente pero no se pudo obtener la plantilla.
                    </p>
                    <Button variant="primary" onClick={() => navigate(-1)}>
                        Volver
                    </Button>

                </div>
            );
        }


        const estiloBotonActivo = { backgroundColor: "#0d6efd", border: "none", color: "#fff" };
        const estiloBotonInactivo = { backgroundColor: "#E8ECEF", border: "none", color: "#5A5B65" };

        return (
            // <Container fluid className="mt-4 px-4">
            <>

                <div className="mb-1">
                    <Button
                        variant="outline-secondary"
                        onClick={() => navigate(-1)}
                        className="mb-3"
                        >
                        <i className="fa-solid fa-arrow-left"></i> Volver
                    </Button>
                </div>
            <ShadowedCard>
                <div className="row justify-content-center">
                    <div className="col-12">
                        <CCard className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
                            <CCardBody className="p-4 p-md-5">
                                {/* Botón volver */}


                                {/* Encabezado */}
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div>
                                            <h1>{materiaNombre}</h1>
                                        </div>
                                    </div>
                                    
                                    <div className="d-flex justify-content-between align-items-center">
                                        
                                        
                                        <h5 className='text-muted'>Respondido: {new Date(fechaEnvio).toLocaleDateString()}</h5>
                                        {/* <div className="d-flex gap-3">
                                            <Badge bg="primary" className="fs-6">
                                                <i className="fas fa-calendar me-1" />
                                                {new Date(fechaEnvio).toLocaleDateString()}
                                            </Badge>
                                        </div> */}

                                        {gruposOrganizados.length > 0 && (
                                            <div className="text-end">
                                                <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                                                    <span style={{ color: "grey", fontSize: "13px" }}>TOTAL PREGUNTAS</span>
                                                    <br />
                                                    {gruposOrganizados.reduce((total, grupo) => total + grupo.preguntas.length, 0)} preguntas
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Contenido de respuestas */}
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
                                        {/* Mostrar solo el grupo activo si hay múltiples grupos */}
                                        {gruposOrganizados.length > 1 ? (
                                            <>
                                                {/* Botones de navegación entre grupos */}
                                                <div className="row justify-content-center">
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
                                                </div>
                                                {gruposOrganizados.map((grupo, grupoIdx) => (
                                                    grupoIdx === grupoActivo && (
                                                        <div key={grupo.id}>
                                                            {/* Encabezado del grupo */}
                                                            
                                                            <CCardHeader
                                                                className="mb-4 p-3 rounded"
                                                                style={{
                                                                    borderLeft: "5px solid #0d6efd",
                                                                }}
                                                            >
                                                                <h4 className="fw-bold mb-1 fs-5">{grupo.nombre}</h4>
                                                                <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                                                                    {grupo.preguntas.length} preguntas
                                                                </p>
                                                                </CCardHeader>

                                                            {/* Preguntas del grupo activo*/}
                                                            {renderPreguntasDelGrupo(grupo)}
                                                        </div>
                                                    )
                                                ))}
                                            </>
                                        ) : (
                                            // Mostrar 1 solo grupo
                                            gruposOrganizados.map((grupo) => (
                                                <div key={grupo.id}>
                                                    {renderPreguntasDelGrupo(grupo)}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}

                            </CCardBody>
                        </CCard>
                    </div>
                </div>
            </ShadowedCard>
            </>
            
        );
    };

    // carga y error
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
                                    <Button variant="secondary" onClick={() => navigate(-1)}>
                                        Volver
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </Container>
        );
    }

    // Render según tipo de instrumento - renderVistaEncuesta vale para informes de cátedra
    // return tipoInstrumento === 'INFORME_SINTETICO' ? renderInforme() : renderVistaEncuesta();

    return tipoInstrumento === 'ENCUESTA_ESTUDIANTE'? renderVistaEncuesta() : renderInforme()
}