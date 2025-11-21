import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Button, Alert, Spinner, Tabs, Tab} from 'react-bootstrap';
import type { RespuestaTemporal, InstanciaRespuestas, GrupoPreguntas, InstrumentoDetail} from '../types';
import { useAuth } from '../../context/AuthContext'; 
import { Llamadora } from '../Respuesta/VerPorcentajes';
import { cargarRespuestasIniciales } from '../Respuesta/CargarRespuestasIniciales';
import { organizarPreguntasEnGrupos } from '../Pregunta/OrganizarPreguntas';
import { validarTodasRespuestasCompletas } from '../Respuesta/ValidarRespuestas';
import { enviarFormularioCompleto } from '../Respuesta/EnviarRespuestas';
import NavegacionPaginas from './NavegacionPaginas';
import PreguntaSimple from '../Pregunta/PreguntaSimple';
import PreguntaMultiple from '../Pregunta/PreguntaMultiples';
import AgregarInstancia from './AgregarInstancia';
import ResumenRespuestas from '../Respuesta/ResumenRespuestas';
import { DatosInstrumento } from './DatosInstrumento';
import { DatosInstrumentoSintetico } from './DatosInstrumentoSintetico';

export default function ResponderInstrumento() {
    const { instrumentoId: instrumentoIdParam } = useParams<{ instrumentoId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth(); 

    const [instrumentoSeleccionado, setInstrumentoSeleccionado] = useState<InstrumentoDetail>();
    const [plantillaFormulario, setPlantillaFormulario] = useState<any>(null);

    const [respuestas, setRespuestas] = useState<RespuestaTemporal[]>([]);
    const [respuestasMultiples, setRespuestasMultiples] = useState<{
        [grupoCuadroId: number]: InstanciaRespuestas[];
    }>({});

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);

    const [paginaActual, setPaginaActual] = useState(0);
    const [mostrarResumen, setMostrarResumen] = useState(false);

    const [preguntaInfoGeneralId, setPreguntaInfoGeneralId] = useState<number | null>(null);

    const locationState = location.state || {};
    const rolActual = locationState.rol || user?.rol?.nombre || localStorage.getItem('rol_actual');
    const esDocente = rolActual === 'docente' || user?.rol?.nombre === 'docente';
    const esAlumno = rolActual === 'alumno' || user?.rol?.nombre === 'alumno';
    const materiaNombre = locationState.materiaNombre || '';
    const rutaVolver = esDocente ? '/instrumentos-docente' : esAlumno ? '/materias' : '/';

    useEffect(() => {
        if (!user) {
            console.warn('No hay usuario autenticado');
        }
    }, [user, navigate]);

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

            const plantillaResponse = await fetch(
                `http://127.0.0.1:8000/formularios/${instrumentoData.plantilla_formulario_id}`
            );
            if (!plantillaResponse.ok) throw new Error('No se pudo cargar el formulario');
            const plantillaData = await plantillaResponse.json();
            setPlantillaFormulario(plantillaData);

            const { respuestasSimples, respuestasMultiples: respuestasMultiplesData } =
                await cargarRespuestasIniciales(plantillaData, instrumentoId);

            setRespuestas(respuestasSimples);
            setRespuestasMultiples(respuestasMultiplesData);
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

    const agregarInstanciaRespuestas = (grupoCuadroId: number, nuevaInstancia: InstanciaRespuestas) => {
        setRespuestasMultiples((prev) => ({
            ...prev,
            [grupoCuadroId]: [...(prev[grupoCuadroId] || []), nuevaInstancia],
        }));
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

    const handleDatosInfoGeneralListos = (datos: any[], preguntaId: number | null) => {
        if (preguntaId) {
            setPreguntaInfoGeneralId(preguntaId);
            
            const respuestaInfoGeneral: RespuestaTemporal = {
                pregunta_id: preguntaId,
                texto: JSON.stringify(datos),
                opcion_id: null
            };
            
            setRespuestas(prev => {
                const existe = prev.find(r => r.pregunta_id === preguntaId);
                if (existe) {
                    return prev.map(r => r.pregunta_id === preguntaId ? respuestaInfoGeneral : r);
                }
                return [...prev, respuestaInfoGeneral];
            });
        }
    };

    const todasRespondidas = (): boolean => {
        return validarTodasRespuestasCompletas(respuestas, respuestasMultiples, plantillaFormulario);
    };

    const enviarRespuestas = async (): Promise<boolean> => {
        if (!instrumentoSeleccionado) {
            alert('Error: No hay instrumento seleccionado');
            return false;
        }
        
        if (!user) {
            alert('Error: Debe iniciar sesión para enviar el formulario');
            navigate('/login');
            return false;
        }
        
        setEnviando(true);
        
        try {
            const exito = await enviarFormularioCompleto(
                instrumentoSeleccionado,
                user,
                respuestas,
                respuestasMultiples
            );
            console.log('Resultado del envío:', exito);
            return exito;
        } catch (error) {
            console.error('Error en enviarRespuestas:', error);
            alert('Error al enviar: ' + (error instanceof Error ? error.message : 'Error desconocido'));
            return false;
        } finally {
            setEnviando(false);
        }
    };

    const gruposOrganizados: GrupoPreguntas[] = organizarPreguntasEnGrupos(
        plantillaFormulario,
        instrumentoSeleccionado
    );
    const totalPaginas = gruposOrganizados.length;

    const avanzarPagina = () => {
        if (paginaActual < totalPaginas - 1) {
            setPaginaActual(paginaActual + 1);
        } else {
            setMostrarResumen(true);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const retrocederPagina = () => {
        if (mostrarResumen) {
            setMostrarResumen(false);
        } else if (paginaActual > 0) {
            setPaginaActual(paginaActual - 1);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const irAPagina = (index: number) => {
        setMostrarResumen(false);
        setPaginaActual(index);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

    const grupoActual =
        !mostrarResumen && paginaActual < gruposOrganizados.length ? gruposOrganizados[paginaActual] : null;

    const esInformeSintetico = instrumentoSeleccionado?.tipo === "INFORME_SINTETICO";
    const esPaginaInfoGeneral = esInformeSintetico && paginaActual === 0;

    return (
        <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh', paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
            <Container style={{ maxWidth: '1200px' }}>
                <Button variant="outline-secondary" className="mb-3" onClick={() => navigate(rutaVolver)}>
                    <i className="fa-solid fa-arrow-left"></i> Volver{' '}
                    {esDocente ? 'a Informes de Cátedra' : esAlumno ? 'a Materias' : 'atrás'}
                </Button>

                <Card className="w-100 mb-4" style={{ borderRadius: '1rem' }}>
                    <Card.Body className="p-4">

                        {instrumentoSeleccionado && (
                            <DatosInstrumento instrumento={instrumentoSeleccionado} />
                        )}

                        <div className="text-center mb-4">
                            <h1 className="fw-bold mb-2" style={{ color: '#1f2937', fontSize: '1.875rem' }}>
                                {plantillaFormulario?.titulo || `Informe de Cátedra - ${materiaNombre}`}
                            </h1>
                            <p className="text-muted mb-3">
                                {esDocente
                                    ? 'Complete el informe de cátedra'
                                    : 'Complete la encuesta con sus respuestas'}
                            </p>
                        </div>

                        <NavegacionPaginas
                            paginaActual={paginaActual}
                            totalPaginas={totalPaginas}
                            gruposOrganizados={gruposOrganizados}
                            respuestas={respuestas}
                            respuestasMultiples={respuestasMultiples}
                            mostrarResumen={mostrarResumen}
                            mostrarProgreso={true}
                            mostrarIndicadores={true}
                            mostrarBotones={false}
                            mostrarAlerta={false}
                            onAvanzar={avanzarPagina}
                            onRetroceder={retrocederPagina}
                            onIrAPagina={irAPagina}
                        />

                        {esDocente && !mostrarResumen && instrumentoSeleccionado && (
                            <Tabs defaultActiveKey="responder" className="mb-4">
                                <Tab eventKey="responder" title="Responder Informe"></Tab>
                                <Tab eventKey="estadisticas" title="Ver Estadísticas">
                                    <div className="mt-4">
                                        <Llamadora id_instrumento={instrumentoSeleccionado.id} />
                                    </div>
                                </Tab>
                            </Tabs>
                        )}

                        {!mostrarResumen && grupoActual && (
                            <>
                                {esPaginaInfoGeneral && (
                                    <div>
                                        <div
                                            className="mb-4 p-3 rounded"
                                            style={{
                                                backgroundColor: '#f0f7ff',
                                                borderLeft: '4px solid #816767ff',
                                            }}
                                        >
                                            <h4 className="fw-bold mb-1" style={{ color: '#1f2937' }}>
                                                {grupoActual.nombre}
                                            </h4>
                                            <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                                                Vista de todas las actividades curriculares asociadas a este informe
                                            </p>
                                        </div>

                                        {instrumentoSeleccionado && (
                                            <DatosInstrumentoSintetico 
                                                instrumento={instrumentoSeleccionado}
                                                onDatosListos={handleDatosInfoGeneralListos}
                                            />
                                        )}
                                    </div>
                                )}

                                {!esPaginaInfoGeneral && (
                                    <>
                                        <div
                                            className="mb-4 p-3 rounded"
                                            style={{
                                                backgroundColor: grupoActual.tipo === 'multiple' ? '#e7f5ff' : '#f8f9fa',
                                                borderLeft: `4px solid ${grupoActual.tipo === 'multiple' ? '#0d6efd' : '#6c757d'}`,
                                            }}
                                        >
                                            <h4 className="fw-bold mb-1" style={{ color: '#1f2937' }}>
                                                {grupoActual.nombre}
                                            </h4>
                                            <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                                                {grupoActual.tipo === 'multiple'
                                                    ? 'Complete las siguientes preguntas. Puede agregar más respuestas según necesite.'
                                                    : `Responda las siguientes ${grupoActual.preguntas.length} preguntas`}
                                            </p>
                                        </div>

                                        {grupoActual.tipo === 'simple' ? (
                                            grupoActual.preguntas.map((pregunta: any, idx: number) => (
                                                <PreguntaSimple
                                                    key={pregunta.id}
                                                    pregunta={pregunta}
                                                    index={idx}
                                                    respuesta={obtenerRespuesta(pregunta.id)}
                                                    onActualizar={actualizarRespuesta}
                                                    instrumento_id={Number(instrumentoIdParam)}
                                                />
                                            ))
                                        ) : (
                                            <div>
                                                {(respuestasMultiples[grupoActual.id] || []).map((instancia, instanciaIdx) => (
                                                    <div key={instanciaIdx} className="mb-4">
                                                        {grupoActual.preguntas.map((pregunta: any, idx: number) => (
                                                            <PreguntaMultiple
                                                                key={pregunta.id}
                                                                pregunta={pregunta}
                                                                index={idx}
                                                                instancia={instancia}
                                                                instanciaIndex={instanciaIdx}
                                                                grupoCuadroId={grupoActual.id}
                                                                totalInstancias={respuestasMultiples[grupoActual.id]?.length || 0}
                                                                onActualizar={actualizarRespuestaMultiple}
                                                                onEliminar={eliminarInstancia}
                                                                instrumento={instrumentoSeleccionado}
                                                                instrumento_id={Number(instrumentoIdParam)}
                                                            />
                                                        ))}
                                                    </div>
                                                ))}

                                                <AgregarInstancia
                                                    grupoCuadroId={grupoActual.id}
                                                    preguntasDelGrupo={grupoActual.preguntas}
                                                    instancias={respuestasMultiples[grupoActual.id] || []}
                                                    onAgregar={agregarInstanciaRespuestas}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}

                                <NavegacionPaginas
                                    paginaActual={paginaActual}
                                    totalPaginas={totalPaginas}
                                    gruposOrganizados={gruposOrganizados}
                                    respuestas={respuestas}
                                    respuestasMultiples={respuestasMultiples}
                                    mostrarResumen={mostrarResumen}
                                    mostrarProgreso={false}
                                    mostrarIndicadores={false}
                                    mostrarBotones={true}
                                    mostrarAlerta={true}
                                    onAvanzar={avanzarPagina}
                                    onRetroceder={retrocederPagina}
                                    onIrAPagina={irAPagina}
                                />
                            </>
                        )}

                        {mostrarResumen && (
                            <ResumenRespuestas
                                gruposOrganizados={gruposOrganizados}
                                respuestas={respuestas}
                                respuestasMultiples={respuestasMultiples}
                                todasRespondidas={todasRespondidas()}
                                enviando={enviando}
                                esDocente={esDocente}
                                onRetroceder={retrocederPagina}
                                onIrAPagina={irAPagina}
                                onEnviar={enviarRespuestas}
                                onExito={() => navigate(rutaVolver)}
                            />
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}