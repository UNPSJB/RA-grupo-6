import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Button, Alert, Badge, Spinner, Form, Tabs, Tab, Row, Col, ProgressBar } from 'react-bootstrap';
import ModalExito from "../ModalEnvio";
import type {InstanciaRespuestas, RespuestaTemporal } from "../types";
import { Llamadora } from '../Respuesta/VerPorcentajes';
import {EnumTipoPregunta} from "../types"

export interface GrupoPreguntas {
    id: number;
    nombre: string;
    preguntas: any[];
    tipo: 'simple' | 'multiple';
}

const PREGUNTAS_POR_PAGINA = 5;

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
    
    const [paginaActual, setPaginaActual] = useState(0);
    const [mostrarResumen, setMostrarResumen] = useState(false);

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

            const preguntasSimples = plantillaData.preguntas.filter((p: any) => !p.multiple_respuestas);
            
            const respuestasConPrefill = await Promise.all(
                preguntasSimples.map(async (pregunta: any) => {
                    let textoPrefill = '';
                    let opcionPrefill = undefined;
                    
                    if (pregunta.pregunta_fuente_id) {
                        try {
                            console.log(`argando prefill para pregunta ${pregunta.id}`);
                            const prefillResponse = await fetch(
                                `http://127.0.0.1:8000/respuestas/fuente?pregunta_id=${pregunta.id}&instrumento_id=${instrumentoId}`
                            );
                            
                            if (prefillResponse.ok) {
                                const prefillData = await prefillResponse.json();
                                console.log(`Prefill data para pregunta ${pregunta.id}:`, prefillData);
                                
                                if (prefillData.respuestas && prefillData.respuestas.length > 0) {
                                    const primeraRespuesta = prefillData.respuestas[0];
                                    textoPrefill = primeraRespuesta.texto || '';
                                    opcionPrefill = primeraRespuesta.opcion_id;
                                    console.log(`Prefill cargado: texto="${textoPrefill}", opcion=${opcionPrefill}`);
                                } else {
                                    console.log(`No hay respuestas en prefillData`);
                                }
                            }
                        } catch (error) {
                            console.error(` Error al cargar prefill para pregunta ${pregunta.id}:`, error);
                        }
                    }
                    
                    return {
                        pregunta_id: pregunta.id,
                        texto: textoPrefill,
                        opcion_id: opcionPrefill,
                    };
                })
            );
            
            setRespuestas(respuestasConPrefill);

            const preguntasMultiples = plantillaData.preguntas.filter((p: any) => p.multiple_respuestas);
            const gruposCuadro = new Set<number>(
                preguntasMultiples
                    .map((p: any) => p.grupo_cuadro_id)
                    .filter((id: any): id is number => id !== null && id !== undefined)
            );

            const respuestasMultiplesIniciales: any = {};

            for (const grupoCuadroId of gruposCuadro) {
                const preguntasDelGrupo = preguntasMultiples
                    .filter((p: any) => p.grupo_cuadro_id === grupoCuadroId)
                    .sort((a: any, b: any) => (a.orden_en_grupo || 0) - (b.orden_en_grupo || 0));
                
                let instanciasCargadas: InstanciaRespuestas[] = [];
                
                const preguntaConFuente = preguntasDelGrupo.find((p: any) => p.pregunta_fuente_id);
                
                if (preguntaConFuente) {
                    try {
                        console.log(`🔍 Cargando prefill múltiple para grupo ${grupoCuadroId}`);
                        const prefillResponse = await fetch(
                            `http://127.0.0.1:8000/respuestas/fuente?pregunta_id=${preguntaConFuente.id}&instrumento_id=${instrumentoId}`
                        );
                        
                        if (prefillResponse.ok) {
                            const prefillData = await prefillResponse.json();
                            console.log(`Prefill múltiple para grupo ${grupoCuadroId}:`, prefillData);
                            
                            if (prefillData.respuestas && prefillData.respuestas.length > 0 && prefillData.multiple) {
                                const respuestasPorInstancia = new Map<number, any[]>();
                                
                                for (const respuesta of prefillData.respuestas) {
                                    const instancia = respuesta.instancia || 1;
                                    if (!respuestasPorInstancia.has(instancia)) {
                                        respuestasPorInstancia.set(instancia, []);
                                    }
                                    respuestasPorInstancia.get(instancia)!.push(respuesta);
                                }
                                
                                console.log(`Respuestas agrupadas por instancia:`, respuestasPorInstancia);
                                

                                let instanciaNum = 1;
                                respuestasPorInstancia.forEach((respuestasInstancia) => {
                                    const instancia: InstanciaRespuestas = {};
                                    
                                    preguntasDelGrupo.forEach((pregunta: any, idx: number) => {
                                        const respuestaExistente = respuestasInstancia[idx];
                                        
                                        instancia[pregunta.id] = {
                                            pregunta_id: pregunta.id,
                                            texto: respuestaExistente?.texto || '',
                                            opcion_id: respuestaExistente?.opcion_id,
                                            instancia_respuesta: instanciaNum,
                                        };
                                    });
                                    
                                    instanciasCargadas.push(instancia);
                                    instanciaNum++;
                                });
                                
                                console.log(`Instancias cargadas: ${instanciasCargadas.length}`);
                            }
                        }
                    } catch (error) {
                        console.error(` Error al cargar múltiple para grupo ${grupoCuadroId}:`, error);
                    }
                }
                
                if (instanciasCargadas.length === 0) {
                    const primeraInstancia: InstanciaRespuestas = {};
                    
                    preguntasDelGrupo.forEach((pregunta: any) => {
                        primeraInstancia[pregunta.id] = {
                            pregunta_id: pregunta.id,
                            texto: '',
                            opcion_id: undefined,
                            instancia_respuesta: 1,
                        };
                    });
                    
                    instanciasCargadas = [primeraInstancia];
                }
                
                respuestasMultiplesIniciales[grupoCuadroId] = instanciasCargadas;
            }
            
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
        for (const key in instancia) {
            const r = instancia[key];
            if (!(r.texto?.trim() || r.opcion_id)) return false;
        }
        return true;
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

        const multiplesCompletas = (() => {
            for (const grupoCuadroId of gruposCuadro) {
                const instancias = respuestasMultiples[grupoCuadroId] || [];
                if (instancias.length === 0) return false;

                for (const instancia of instancias) {
                    for (const key in instancia) {
                        const r = instancia[key];
                        if (!(r.texto?.trim() || r.opcion_id)) return false;
                    }
                }
            }
            return true;
        })();

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

            for (const grupoCuadroId in respuestasMultiples) {
                const instancias = respuestasMultiples[grupoCuadroId] || [];

                for (let instanciaIndex = 0; instanciaIndex < instancias.length; instanciaIndex++) {
                    const instancia = instancias[instanciaIndex];

                    for (const preguntaId in instancia) {
                        const respuesta = instancia[preguntaId];
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

                            if (!respuestaResponse.ok) {
                                throw new Error(`Error al enviar respuesta múltiple ${preguntaId}`);
                            }
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

    const organizarPreguntasEnGrupos = (): GrupoPreguntas[] => {
        if (!plantillaFormulario) return [];
        
        const grupos: GrupoPreguntas[] = [];
        const preguntasSimples = plantillaFormulario.preguntas.filter((p: any) => !p.multiple_respuestas);
        const preguntasMultiples = plantillaFormulario.preguntas.filter((p: any) => p.multiple_respuestas);
        
        const preguntasSimplesPorGrupo = new Map<number | null, any[]>();
        preguntasSimples.forEach((pregunta: any) => {
            const grupoId = pregunta.grupo_cuadro_id;
            if (!preguntasSimplesPorGrupo.has(grupoId)) {
                preguntasSimplesPorGrupo.set(grupoId, []);
            }
            preguntasSimplesPorGrupo.get(grupoId)!.push(pregunta);
        });
        
        let contadorGrupo = 1;
        preguntasSimplesPorGrupo.forEach((preguntas, grupoId) => {
            if (grupoId !== null && preguntas.length > 0) {
                grupos.push({
                    id: grupoId,
                    nombre: `Sección ${contadorGrupo}`,
                    preguntas: preguntas,
                    tipo: 'simple'
                });
                contadorGrupo++;
            } else if (grupoId === null) {
                for (let i = 0; i < preguntas.length; i += PREGUNTAS_POR_PAGINA) {
                    grupos.push({
                        id: -contadorGrupo,
                        nombre: `Página ${contadorGrupo}`,
                        preguntas: preguntas.slice(i, i + PREGUNTAS_POR_PAGINA),
                        tipo: 'simple'
                    });
                    contadorGrupo++;
                }
            }
        });
        
        const gruposCuadro = new Set<number>(
            preguntasMultiples
                .map((p: any) => p.grupo_cuadro_id)
                .filter((id: any): id is number => id !== null && id !== undefined)
        );
        
        gruposCuadro.forEach((grupoCuadroId) => {
            const preguntasDelGrupo = preguntasMultiples
                .filter((p: any) => p.grupo_cuadro_id === grupoCuadroId)
                .sort((a: any, b: any) => (a.orden_en_grupo || 0) - (b.orden_en_grupo || 0));
            
            grupos.push({
                id: grupoCuadroId,
                nombre: `Sección ${contadorGrupo} (Repetible)`,
                preguntas: preguntasDelGrupo,
                tipo: 'multiple'
            });
            contadorGrupo++;
        });
        
        return grupos;
    };

    const gruposOrganizados = organizarPreguntasEnGrupos();
    const totalPaginas = gruposOrganizados.length;

    const paginaActualCompleta = (): boolean => {
        if (paginaActual >= gruposOrganizados.length) return false;

        const grupoActual = gruposOrganizados[paginaActual];

        if (grupoActual.tipo === 'simple') {
            return grupoActual.preguntas.every((pregunta: any) => {
                const respuesta = obtenerRespuesta(pregunta.id);
                return respuesta?.texto?.trim() || respuesta?.opcion_id;
            });
        } else {
            const instancias = respuestasMultiples[grupoActual.id] || [];
            return instancias.length > 0 && instancias.every((instancia) => {
                for (const key in instancia) {
                    const r = instancia[key];
                    if (!(r.texto?.trim() || r.opcion_id)) return false;
                }
                return true;
            });
        }
    };

    const calcularProgreso = (): number => {
        let totalPreguntas = 0;
        let preguntasRespondidas = 0;

        respuestas.forEach((r) => {
            totalPreguntas++;
            if (r.texto?.trim() || r.opcion_id) preguntasRespondidas++;
        });

        for (const grupoId in respuestasMultiples) {
            const instancias = respuestasMultiples[grupoId];

            for (const instancia of instancias) {
                for (const key in instancia) {
                    const r = instancia[key];
                    totalPreguntas++;
                    if (r.texto?.trim() || r.opcion_id) {
                        preguntasRespondidas++;
                    }
                }
            }
        }

        return totalPreguntas > 0 ? (preguntasRespondidas / totalPreguntas) * 100 : 0;
    };

    const avanzarPagina = () => {
        if (paginaActual < totalPaginas - 1) {
            setPaginaActual(paginaActual + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setMostrarResumen(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
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

    const grupoActual = !mostrarResumen && paginaActual < gruposOrganizados.length ? gruposOrganizados[paginaActual] : null;

    return (
        <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh', paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
            <Container style={{ maxWidth: '1200px' }}>
                <Button variant="outline-secondary" className="mb-3" onClick={() => navigate(rutaVolver)}>
                    <i className="fa-solid fa-arrow-left"></i> Volver {esDocente ? 'a Informes de Cátedra' : esAlumno ? 'a Materias' : 'atrás'}
                </Button>

                <Card className="border-0 shadow-sm w-100 mb-4" style={{ borderRadius: '1rem' }}>
                    <Card.Body className="p-4">
                        <div className="text-center mb-4">
                            <h1 className="fw-bold mb-2" style={{ color: '#1f2937', fontSize: '1.875rem' }}>
                                {plantillaFormulario?.titulo || `Informe de Cátedra - ${materiaNombre}`}
                            </h1>
                            <p className="text-muted mb-3">
                                {esDocente ? 'Complete el informe de cátedra' : 'Complete la encuesta con sus respuestas'}
                            </p>
                        </div>

                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <small className="text-muted fw-semibold">Progreso general</small>
                                <small className="text-muted fw-semibold">{Math.round(calcularProgreso())}%</small>
                            </div>
                            <ProgressBar 
                                now={calcularProgreso()} 
                                variant="success"
                                style={{ height: '10px', borderRadius: '10px' }}
                            />
                        </div>

                        {!mostrarResumen && (
                            <div className="d-flex justify-content-center align-items-center gap-2 mb-4 flex-wrap">
                                {gruposOrganizados.map((grupo, index) => {
                                    const completada = index < paginaActual || (index === paginaActual && paginaActualCompleta());
                                    const actual = index === paginaActual;
                                    
                                    return (
                                        <div
                                            key={grupo.id}
                                            onClick={() => irAPagina(index)}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: completada ? '#198754' : actual ? '#0d6efd' : '#e9ecef',
                                                color: completada || actual ? 'white' : '#6c757d',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s',
                                                border: actual ? '3px solid #0a58ca' : 'none',
                                            }}
                                            title={grupo.nombre}
                                        >
                                            {completada ? '✓' : index + 1}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {esDocente && paginaActual === 0 && !mostrarResumen && instrumentoSeleccionado && (
                            <Tabs defaultActiveKey="formulario" className="mb-4">
                                <Tab eventKey="formulario" title="Completar Informe">
                                    <div className="mb-4">
                                        <Llamadora id_instrumento={instrumentoSeleccionado.id}/>
                                    </div>
                                </Tab>
                            </Tabs>
                        )}
                    </Card.Body>
                </Card>

                {!mostrarResumen && grupoActual && (
                    <Card className="border-0 shadow-sm w-100 mb-4" style={{ borderRadius: '1rem' }}>
                        <Card.Body className="p-4">
                            <div 
                                className="mb-4 p-3 rounded"
                                style={{
                                    backgroundColor: grupoActual.tipo === 'multiple' ? '#e7f5ff' : '#f8f9fa',
                                    borderLeft: `4px solid ${grupoActual.tipo === 'multiple' ? '#0d6efd' : '#6c757d'}`
                                }}
                            >
                                <h4 className="fw-bold mb-1" style={{ color: '#1f2937' }}>
                                    {grupoActual.nombre}
                                </h4>
                                <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                                    {grupoActual.tipo === 'multiple' 
                                        ? 'Complete las siguientes preguntas. Puede agregar más respuestas según necesite.'
                                        : `Responda las siguientes ${grupoActual.preguntas.length} preguntas`
                                    }
                                </p>
                            </div>

                            {grupoActual.tipo === 'simple' ? (
                                grupoActual.preguntas.map((pregunta: any, idx: number) => (
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
                                                <div className="flex-grow-1">
                                                    <h5 className="fw-semibold mb-1">{pregunta.texto}</h5>
                                                    <div className="d-flex gap-2 align-items-center">
                                                        <Badge bg={pregunta.tipo === EnumTipoPregunta.abierta ? 'success' : 'info'}>
                                                            {pregunta.tipo}
                                                        </Badge>
                                                        {pregunta.pregunta_fuente_id && (
                                                            <Badge bg="warning" text="dark">
                                                                <i className="fas fa-link me-1"></i>
                                                                Autocompletada
                                                            </Badge>
                                                        )}
                                                    </div>
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
                                ))
                            ) : (
                                <div>
                                    {(respuestasMultiples[grupoActual.id] || []).map((instancia, instanciaIdx) => (
                                        <div key={instanciaIdx} className="mb-4">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <Badge bg="primary" style={{ fontSize: '1rem' }}>
                                                    Respuesta {instanciaIdx + 1}
                                                </Badge>
                                                {(respuestasMultiples[grupoActual.id] || []).length > 1 && (
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => eliminarInstancia(grupoActual.id, instanciaIdx)}
                                                    >
                                                        <i className="fas fa-trash me-1"></i>
                                                        Eliminar
                                                    </Button>
                                                )}
                                            </div>

                                            {grupoActual.preguntas.map((pregunta: any, idx: number) => (
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
                                                                        grupoActual.id,
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
                                                                                grupoActual.id,
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
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => agregarInstanciaRespuestas(grupoActual.id, grupoActual.preguntas)}
                                            disabled={
                                                respuestasMultiples[grupoActual.id]?.length === 0 ||
                                                !instanciaEstaCompleta(
                                                    respuestasMultiples[grupoActual.id][
                                                        respuestasMultiples[grupoActual.id].length - 1
                                                    ]
                                                )
                                            }
                                            className="d-flex align-items-center gap-2 ms-auto"
                                        >
                                            <i className="fas fa-plus"></i>
                                            Agregar más
                                        </Button>

                                        {respuestasMultiples[grupoActual.id]?.length > 0 &&
                                            !instanciaEstaCompleta(
                                                respuestasMultiples[grupoActual.id][
                                                    respuestasMultiples[grupoActual.id].length - 1
                                                ]
                                            ) && (
                                                <small className="text-muted d-block mt-2">
                                                    Complete todas las respuestas antes de agregar más
                                                </small>
                                            )}
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 pt-3 border-top">
                                <Row className="align-items-center">
                                    <Col xs={6}>
                                        {paginaActual > 0 && (
                                            <Button
                                                variant="outline-secondary"
                                                onClick={retrocederPagina}
                                            >
                                                <i className="fa-solid fa-arrow-left"></i> Anterior
                                            </Button>
                                        )}
                                    </Col>
                                    <Col xs={6} className="text-end">
                                        <Button
                                            variant="primary"
                                            onClick={avanzarPagina}
                                            disabled={!paginaActualCompleta()}
                                        >
                                            {paginaActual < totalPaginas - 1 ? 'Siguiente →' : 'Ver Resumen →'}
                                        </Button>
                                    </Col>
                                </Row>
                                
                                {!paginaActualCompleta() && (
                                    <Alert variant="warning" className="mt-3 mb-0">
                                        <i className="fas fa-info-circle me-2"></i>
                                        Complete todas las preguntas de esta sección para continuar
                                    </Alert>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                )}

                {mostrarResumen && (
                    <Card className="border-0 shadow-sm w-100 mb-4" style={{ borderRadius: '1rem' }}>
                        <Card.Body className="p-4">
                            <div className="text-center mb-4">
                                <div 
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        backgroundColor: todasRespondidas() ? '#d1e7dd' : '#fff3cd',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 1rem',
                                        fontSize: '2.5rem'
                                    }}
                                >
                                    {todasRespondidas() ? <i className="fa-solid fa-check"></i> : <i className="fa-solid fa-triangle-exclamation" style={{color: "#FFD43B"}}></i>}
                                </div>
                                <h2 className="fw-bold mb-2" style={{ color: '#1f2937' }}>
                                    Resumen de respuestas
                                </h2>
                                <p className="text-muted mb-0">
                                    Revise sus respuestas antes de enviar
                                </p>
                            </div>

                            {todasRespondidas() ? (
                                <Alert variant="success" className="text-center">
                                    <i className="fas fa-check-circle me-2"></i>
                                    ¡Excelente! Has completado todas las preguntas. Puedes revisar tus respuestas o enviar el formulario.
                                </Alert>
                            ) : (
                                <Alert variant="warning" className="text-center">
                                    <i className="fas fa-exclamation-triangle me-2"></i>
                                    Algunas preguntas están incompletas. Puedes volver atrás para completarlas.
                                </Alert>
                            )}

                            <div className="mt-4">
                                <h5 className="fw-bold mb-3">Progreso por sección</h5>
                                {gruposOrganizados.map((grupo, index) => {
                                    let completadas = 0;
                                    let total = 0;

                                    if (grupo.tipo === 'simple') {
                                        total = grupo.preguntas.length;
                                        completadas = grupo.preguntas.filter((p: any) => {
                                            const resp = obtenerRespuesta(p.id);
                                            return resp?.texto?.trim() || resp?.opcion_id;
                                        }).length;
                                    } else {
                                        const instancias = respuestasMultiples[grupo.id] || [];

                                        for (const instancia of instancias) {
                                            for (const key in instancia) {
                                                const r = instancia[key];
                                                total++;
                                                if (r.texto?.trim() || r.opcion_id) {
                                                    completadas++;
                                                }
                                            }
                                        }
                                    }

                                    const porcentaje = total > 0 ? (completadas / total) * 100 : 0;
                                    const completo = completadas === total;

                                    return (
                                        <Card key={grupo.id} className="mb-3 border" style={{ cursor: 'pointer' }} onClick={() => irAPagina(index)}>
                                            <Card.Body className="p-3">
                                                <Row className="align-items-center">
                                                    <Col xs={8}>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <Badge bg={completo ? 'success' : 'warning'}>
                                                                {completo ? <i className="fa-solid fa-check"></i> : <i className="fa-solid fa-triangle-exclamation" style={{color: "#FFD43B"}}></i>}
                                                            </Badge>
                                                            <div>
                                                                <h6 className="mb-0 fw-semibold">{grupo.nombre}</h6>
                                                                <small className="text-muted">
                                                                    {completadas} de {total} preguntas respondidas
                                                                </small>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={4} className="text-end">
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                irAPagina(index);
                                                            }}
                                                        >
                                                            {completo ? 'Revisar' : 'Completar'}
                                                        </Button>
                                                    </Col>
                                                </Row>
                                                <ProgressBar 
                                                    now={porcentaje} 
                                                    variant={completo ? 'success' : 'warning'}
                                                    className="mt-2"
                                                    style={{ height: '6px' }}
                                                />
                                            </Card.Body>
                                        </Card>
                                    );
                                })}
                            </div>

                            <Row className="mt-4">
                                <Col md={6} className="mb-2">
                                    <Button
                                        variant="outline-secondary"
                                        className="w-100"
                                        onClick={retrocederPagina}
                                    >
                                        <i className="fa-solid fa-arrow-left"></i> Volver a editar
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
                )}
            </Container>
        </div>
    );
}