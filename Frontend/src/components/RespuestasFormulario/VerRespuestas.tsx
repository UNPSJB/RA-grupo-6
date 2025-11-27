import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Spinner, Button, Badge } from 'react-bootstrap';
import { organizarPreguntasEnGrupos } from '../Pregunta/OrganizarPreguntas';
import InformeSinteticoPDFDocument from './InformeSinteticoPDFDocument';
import ShadowedCard from '../coreui-components/ShadowedCard';
import {
    CCardBody,
    CCardHeader,
    CTable,
    CNav,
    CNavItem,
    CNavLink,
    CCard,
    CAlert,
    CContainer
} from '@coreui/react';
import { pdf } from '@react-pdf/renderer';

export default function VerRespuestas() {
    const { respuestasFormularioId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();


    const [respuestas, setRespuestas] = useState([]);
    const [nombreDepartamento, setNombreDepartamento] = useState(''); 
    const [plantillaFormulario, setPlantillaFormulario] = useState(null);
    
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [tabActiva, setTabActiva] = useState(0);
    const [pdfLoading, setPdfLoading] = useState(false);
    
    const [datosTabla, setDatosTabla] = useState(null);
    const [datosMaterias, setDatosMaterias] = useState([]);

    const locationState = location.state || {};
    const materiaNombre = locationState.materiaNombre || '';
    const fechaEnvio = locationState.fechaEnvio || '';
    const plantillaFormularioId = locationState.plantillaFormularioId;
    const tipoInstrumento = locationState.tipoInstrumento || 'ENCUESTA_ESTUDIANTE';

    useEffect(() => {
        if (respuestasFormularioId) {
            cargarTodosLosDatos(parseInt(respuestasFormularioId));
        }
    }, [respuestasFormularioId]);

    const cargarTodosLosDatos = async (formId) => {
        setCargando(true);
        setError('');
        try {
            const respResp = await fetch(`http://localhost:8000/respuestas/?formulario_id=${formId}`, {
                credentials: 'include'
            });
            if (!respResp.ok) throw new Error('No se pudieron cargar las respuestas individuales');
            
            const data = await respResp.json();
            let respuestasData = [];

            if (data.respuestas && Array.isArray(data.respuestas)) {
                respuestasData = data.respuestas;
                setRespuestas(respuestasData);
                if (data.nombre_departamento) {
                    setNombreDepartamento(data.nombre_departamento);
                }
            } else if (Array.isArray(data)) {
                respuestasData = data;
                setRespuestas(respuestasData);
            } else {
                respuestasData = [];
                setRespuestas([]);
            }
            const respuestaTablaGeneral = respuestasData.find(r => r.pregunta?.texto === "Información general de actividades curriculares");
            if (respuestaTablaGeneral && respuestaTablaGeneral.texto) {
                try {
                    setDatosTabla(JSON.parse(respuestaTablaGeneral.texto));
                } catch (e) {
                    console.error("Error parsing tabla:", e);
                }
            }

            const codigosMap = new Map();
            const nombresMap = new Map();
            respuestasData.forEach((respuesta) => {
                if (respuesta.pregunta?.texto === "Código de actividad curricular" && respuesta.texto && respuesta.instancia_respuesta !== null) {
                    codigosMap.set(respuesta.instancia_respuesta, respuesta.texto);
                }
                if (respuesta.pregunta?.texto === "Nombre de la actividad curricular" && respuesta.texto && respuesta.instancia_respuesta !== null) {
                    nombresMap.set(respuesta.instancia_respuesta, respuesta.texto);
                }
            });

            const materiasCombinadas = [];
            codigosMap.forEach((codigo, instancia) => {
                const nombre = nombresMap.get(instancia);
                if (nombre) materiasCombinadas.push({ instancia, codigo, nombre });
            });
            setDatosMaterias(materiasCombinadas);

            if (plantillaFormularioId) {
                const plantillaResponse = await fetch(`http://localhost:8000/formularios/${plantillaFormularioId}`, {
                    credentials: 'include'
                });
                if (plantillaResponse.ok) {
                    setPlantillaFormulario(await plantillaResponse.json());
                }
            }
        } catch (e) {
            const mensaje = e instanceof Error ? e.message : 'Error al cargar los datos';
            setError(mensaje);
        } finally {
            setCargando(false);
        }
    };

    const obtenerRespuestasDePregunta = (preguntaId, instancia) => {
        if (instancia !== undefined) {
            return respuestas.filter((r) => r.pregunta_id === preguntaId && r.instancia_respuesta === instancia);
        }
        return respuestas.filter((r) => r.pregunta_id === preguntaId);
    };

    const limpiarTitulo = (titulo) => {
        if (!titulo) return '';
        return titulo.replace(/\(Repetible\)/gi, '').trim();
    };

    const getDatosParaPDF = () => {
        const gruposOrganizados = plantillaFormulario ? organizarPreguntasEnGrupos(plantillaFormulario) : [];
        let respuestasSintesisAgrupadas = [];

        gruposOrganizados.forEach((grupo, index) => {
            const esInformeSinteticoActual = tipoInstrumento === 'INFORME_SINTETICO';
            let titulo_grupo = limpiarTitulo(grupo.nombre);
            
            if (esInformeSinteticoActual && index === 0) titulo_grupo = 'Información General del Departamento';
            else if (esInformeSinteticoActual && !titulo_grupo) titulo_grupo = `Sección ${index}`;

            const preguntasFiltradas = grupo.preguntas.filter(
                p => p.texto !== "Código de actividad curricular" && 
                     p.texto !== "Nombre de la actividad curricular" &&
                     p.texto !== "Información general de actividades curriculares"
            );

            if (esInformeSinteticoActual && grupo.tipo === 'multiple' && datosMaterias.length > 0) {
                datosMaterias.forEach(materia => {
                    const respuestasProcesadas = preguntasFiltradas.map(pregunta => {
                        const respuestasPregunta = obtenerRespuestasDePregunta(pregunta.id, materia.instancia);
                        if (respuestasPregunta.length >= 1) {
                            const textosRespuestas = respuestasPregunta.map(r => r.texto || r.opcion?.texto || (pregunta.opciones?.find((op) => op.id === r.opcion_id)?.texto ?? '') || 'No respondida');
                            return { pregunta_texto: pregunta.texto, respuesta_texto: textosRespuestas.join('; ') };
                        } else {
                            return { pregunta_texto: pregunta.texto, respuesta_texto: 'No respondida' };
                        }
                    });
                    respuestasSintesisAgrupadas.push({
                        grupo: `${grupo.id}_${materia.instancia}`, 
                        titulo_grupo: titulo_grupo,
                        respuestas: respuestasProcesadas,
                        datos_materia_agrupada: materia
                    }); 
                });
            } else {
                const respuestasProcesadas = preguntasFiltradas.map(pregunta => {
                    const respuestasPregunta = obtenerRespuestasDePregunta(pregunta.id);
                    if (respuestasPregunta.length >= 1) {
                        const textosRespuestas = respuestasPregunta.map(r => r.texto || r.opcion?.texto || (pregunta.opciones?.find((op) => op.id === r.opcion_id)?.texto ?? '') || 'No respondida');
                        return { pregunta_texto: pregunta.texto, respuesta_texto: textosRespuestas.join('; ') };
                    } else {
                        return { pregunta_texto: pregunta.texto, respuesta_texto: 'No respondida' };
                    }
                });
                respuestasSintesisAgrupadas.push({ grupo: grupo.id.toString(), titulo_grupo: titulo_grupo, respuestas: respuestasProcesadas });
            }
        });

        return {
            id: parseInt(respuestasFormularioId || '0'),
            titulo_formulario: (tipoInstrumento === 'INFORME_SINTETICO') ? 'Informe Sintético' : 'Informe de Cátedra',
            departamento: (tipoInstrumento === 'INFORME_SINTETICO') ? (nombreDepartamento || 'Ingeniería') : materiaNombre,
            
            fecha_completado: fechaEnvio,
            respuestas_sintesis_agrupadas: respuestasSintesisAgrupadas,
            datos_tabla: datosTabla,
            datos_materias: datosMaterias
        };
    };

    const handleDownloadPDF = async () => {
        setPdfLoading(true);
        try {
            const datosPDF = getDatosParaPDF();
            const blob = await pdf(<InformeSinteticoPDFDocument informe={datosPDF} />).toBlob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            let prefijoArchivo = tipoInstrumento === 'INFORME_SINTETICO' ? "Informe-Sintetico" : 'Informe-Catedra';
            
            const nombreParaArchivo = (tipoInstrumento === 'INFORME_SINTETICO' && nombreDepartamento) ? nombreDepartamento : materiaNombre;
            
            a.download = `${prefijoArchivo}-${nombreParaArchivo}-${new Date(fechaEnvio).toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error generando PDF:", error);
            alert("Error al generar el PDF. Revisa la consola.");
        } finally {
            setPdfLoading(false);
        }
    };

    const renderRespuesta = (respuesta, pregunta, i) => {
        const opcionTexto =
            respuesta.opcion?.texto ||
            (pregunta.opciones?.find((op) => op.id === respuesta.opcion_id)?.texto ?? '');
        const contenido = respuesta.texto || opcionTexto || 'No respondida';

        return (
            <div key={i} className="p-3 rounded mb-2 border w-100 bg-body-tertiary">
                <div className="d-flex align-items-start">
                    <i className="fas fa-check-circle text-success me-2 mt-1"></i>
                    <span className="flex-grow-1 text-body" style={{ lineHeight: '1.5' }}>
                        {contenido}
                    </span>
                </div>
            </div>
        );
    };

    const renderTablaInformacionGeneral = () => {
        if (!datosTabla || !Array.isArray(datosTabla) || datosTabla.length === 0) {
            return <CAlert color="info">No hay datos de información general disponibles.</CAlert>;
        }

        return (
            <div className="mb-4">
                <CTable striped hover responsive bordered className="rounded-3 overflow-hidden shadow-sm mb-0">
                    <thead className="bg-body-secondary text-body"> 
                        <tr className="text-center align-middle">
                            <th className="text-body">Código</th>
                            <th className="text-body">Asignatura</th>
                            <th className="text-body">Inscriptos</th>
                            <th className="text-body">Comisiones Teóricas</th>
                            <th className="text-body">Comisiones Prácticas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datosTabla.map((fila, index) => (
                            <tr key={index}>
                                <td className="text-center">{fila.codAsignatura || '-'}</td>
                                <td className="text-center">{fila.asignatura || '-'}</td>
                                <td className="text-center fw-bold">{fila.inscriptos ?? '-'}</td>
                                <td className="text-center">
                                    {Array.isArray(fila.comisionesTeoricas) 
                                    ? fila.comisionesTeoricas.join(', ') 
                                    : fila.comisionesTeoricas || '-'}
                                </td>
                                <td className="text-center">{fila.comisionesPracticas || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </CTable>
            </div>
        );
    };

    const renderPreguntasDelGrupo = (grupo) => {
        const preguntasFiltradas = grupo.preguntas.filter(
            p => p.texto !== "Código de actividad curricular" && 
                 p.texto !== "Nombre de la actividad curricular" &&
                 p.texto !== "Información general de actividades curriculares"
        );

        if (grupo.tipo === 'multiple' && datosMaterias.length > 0 && tipoInstrumento === 'INFORME_SINTETICO') {
            const instanciasUnicas = [...new Set(datosMaterias.map(m => m.instancia))].sort((a, b) => a - b);
            
            return (
                <>
                    {instanciasUnicas.map((instancia) => {
                        const materiaInfo = datosMaterias.find(m => m.instancia === instancia);
                        
                        return (
                            <div key={instancia} className="mb-5">
                                {materiaInfo && (
                                    <div className="mb-3 p-3 rounded bg-body-secondary border-start border-4 border-primary">
                                        <h5 className="mb-0 fw-bold text-body">
                                            <i className="fas fa-book me-2"></i>
                                            {materiaInfo.nombre}
                                            <span className="ms-2 opacity-75 small text-body">(Código: {materiaInfo.codigo})</span>
                                        </h5>
                                    </div>
                                )}
                                
                                {preguntasFiltradas.map((pregunta) => {
                                    const respuestasPregunta = obtenerRespuestasDePregunta(pregunta.id, instancia);

                                    return (
                                        <div key={`${pregunta.id}-${instancia}`} className="mb-4 bg-body border rounded p-3 shadow-sm">
                                            <div className="mb-3">
                                                <div className="fw-bold mb-2 fs-5 text-body">
                                                    {pregunta.texto}
                                                </div>
                                                <div className="d-flex gap-2 flex-wrap mt-2">
                                                    {pregunta.obligatoria && <Badge bg="danger">Obligatoria</Badge>}
                                                    {pregunta.tipo === "abierta" && <Badge bg="secondary">Abierta</Badge>}
                                                    {pregunta.tipo === "cerrada" && <Badge bg="primary">Cerrada</Badge>}
                                                </div>
                                            </div>
                                            <div className="mt-3">
                                                {respuestasPregunta.length > 0 ? (
                                                    respuestasPregunta.map((r, i) => renderRespuesta(r, pregunta, i))
                                                ) : (
                                                    <div className="p-3 rounded bg-warning bg-opacity-10 w-100">
                                                        <i className="fas fa-exclamation-circle me-2 text-warning"></i>
                                                        <span className="text-muted">No respondida</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </>
            );
        }

        return preguntasFiltradas.map((pregunta) => {
            const respuestasPregunta = obtenerRespuestasDePregunta(pregunta.id);

            return (
                <div key={pregunta.id} className="mb-4 bg-body border rounded p-3 shadow-sm">
                    <div className="mb-3">
                        <div className="fw-bold mb-2 fs-5 text-body">{pregunta.texto}</div>
                        <div className="d-flex gap-2 flex-wrap mt-2">
                            {pregunta.obligatoria && <Badge bg="danger">Obligatoria</Badge>}
                            {pregunta.tipo === "abierta" && <Badge bg="secondary">Abierta</Badge>}
                            {pregunta.tipo === "cerrada" && <Badge bg="primary">Cerrada</Badge>}
                        </div>
                    </div>
                    <div className="mt-3">
                        {respuestasPregunta.length > 0 ? (
                            respuestasPregunta.map((r, i) => renderRespuesta(r, pregunta, i))
                        ) : (
                            <div className="p-3 rounded bg-warning bg-opacity-10 w-100">
                                <i className="fas fa-exclamation-circle me-2 text-warning"></i>
                                <span className="text-muted">No respondida</span>
                            </div>
                        )}
                    </div>
                </div>
            );
        });
    };

    const renderVistaEncuesta = () => {
        const gruposOrganizados = plantillaFormulario ? organizarPreguntasEnGrupos(plantillaFormulario) : [];
        if (!plantillaFormulario && respuestas.length > 0) {
            return (
                <div className="text-center py-5">
                    <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                    <h5 className="text-warning mb-3">Plantilla no disponible</h5>
                    <p className="text-muted">Las respuestas se cargaron correctamente pero no se pudo obtener la plantilla.</p>
                    <Button variant="primary" onClick={() => navigate(-1)}>Volver</Button>
                </div>
            );
        }
        
        const mostrarPestanas = true;
        const esInformeSintetico = tipoInstrumento === 'INFORME_SINTETICO';
        const mostrarTabInformacionGeneral = esInformeSintetico;
        const mostrarBotonPDF = tipoInstrumento === 'INFORME_SINTETICO' || tipoInstrumento === 'INFORME_CATEDRA';

        return (
            <>
                <div className="mb-1">
                    <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mb-3 no-print">
                        <i className="fa-solid fa-arrow-left"></i> Volver
                    </Button>
                </div>
                
                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h1 className="text-body fw-bold">
                                        {esInformeSintetico ? (nombreDepartamento || 'Informe Sintético') : materiaNombre}
                                    </h1>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className='text-muted'>Respondido: {new Date(fechaEnvio).toLocaleDateString()}</h5>
                                {gruposOrganizados.length > 0 && (
                                    <div className="text-end">
                                        <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                                            <span style={{ color: "grey", fontSize: "13px" }}>TOTAL PREGUNTAS</span><br />
                                            {gruposOrganizados.reduce((total, grupo) => total + grupo.preguntas.length, 0)} preguntas
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {!gruposOrganizados.length ? (
                            <div className="text-center py-5">
                                <h5 className="text-muted">No se encontraron preguntas</h5>
                            </div>
                        ) : (
                            <div className="respuestas-content">
                                {mostrarPestanas ? (
                                    <div className='w-100'>
                                        <CNav variant="pills" className="mb-4 gap-2 flex-wrap border-bottom pb-3">
                                            {mostrarTabInformacionGeneral && (
                                                <CNavItem>
                                                    <CNavLink 
                                                        active={tabActiva === 0}
                                                        onClick={() => setTabActiva(0)}
                                                        style={{ cursor: 'pointer', fontWeight: '500' }}
                                                        className={tabActiva === 0 ? '' : 'bg-body-tertiary text-body border'}
                                                    >
                                                        Información General
                                                    </CNavLink>
                                                </CNavItem>
                                            )}
                                            {gruposOrganizados.map((grupo, idx) => (
                                                <CNavItem key={grupo.id}>
                                                    <CNavLink 
                                                        active={tabActiva === (mostrarTabInformacionGeneral ? idx + 1 : idx)}
                                                        onClick={() => setTabActiva(mostrarTabInformacionGeneral ? idx + 1 : idx)}
                                                        style={{ cursor: 'pointer', fontWeight: '500' }}
                                                        className={tabActiva === (mostrarTabInformacionGeneral ? idx + 1 : idx) ? '' : 'bg-body-tertiary text-body border'}
                                                    >
                                                        {limpiarTitulo(grupo.nombre) || `Sección ${idx + 1}`}
                                                    </CNavLink>
                                                </CNavItem>
                                            ))}
                                        </CNav>

                                        {mostrarTabInformacionGeneral && tabActiva === 0 && (
                                            <div className="animate__animated animate__fadeIn">
                                                <CCardHeader className="mb-4 p-3 rounded bg-body-secondary border-start border-4 border-primary">
                                                    <h4 className="fw-bold mb-0 fs-5 text-body">
                                                        Información General del Departamento
                                                    </h4>
                                                </CCardHeader>
                                                {renderTablaInformacionGeneral()}
                                            </div>
                                        )}

                                        {gruposOrganizados.map((grupo, idx) => (
                                            tabActiva === (mostrarTabInformacionGeneral ? idx + 1 : idx) && (
                                                <div key={grupo.id} className="animate__animated animate__fadeIn">
                                                    <CCardHeader className="mb-4 p-3 rounded bg-body-secondary border-start border-4 border-secondary">
                                                        <h4 className="fw-bold mb-0 fs-5 text-body">
                                                            {limpiarTitulo(grupo.nombre) || `Sección ${idx + 1}`}
                                                        </h4>
                                                    </CCardHeader>
                                                    {renderPreguntasDelGrupo(grupo)}
                                                </div>
                                            )
                                        ))}
                                    </div>
                                ) : (
                                    gruposOrganizados.map((grupo) => (
                                        <div key={grupo.id}>
                                            <CCardHeader className="mb-4 p-3 rounded bg-body-secondary border-start border-4 border-secondary">
                                                <h4 className="fw-bold mb-0 fs-5 text-body">{limpiarTitulo(grupo.nombre)}</h4>
                                            </CCardHeader>
                                            {renderPreguntasDelGrupo(grupo)}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {mostrarBotonPDF && (
                    <div className="d-grid gap-2 mt-4 no-print border-top pt-4">
                        <Button
                            variant="primary"
                            onClick={handleDownloadPDF}
                            disabled={pdfLoading}
                            size="lg"
                        >
                            {pdfLoading
                                ? <><Spinner as="span" animation="border" size="sm" /> Generando PDF...</>
                                : <>
                                    <i className="fas fa-file-pdf me-2"></i>
                                    Descargar {tipoInstrumento === 'INFORME_SINTETICO' ? "Informe Sintético" : "Informe de Cátedra"} en PDF
                                  </>
                            }
                        </Button>
                    </div>
                )}
            </>
        );
    };

    if (cargando) return <CContainer className="mt-5 text-center"><Spinner animation="border" variant="primary"/></CContainer>;
    if (error) return <CContainer className="mt-5"><CAlert color="danger">{error}</CAlert></CContainer>;

    return (
        <div className="row justify-content-center">
            <ShadowedCard>
                <CCard className="border-0 shadow-sm w-100 bg-body" style={{ borderRadius: "1rem" }}>
                    <CCardBody className="p-4 p-md-5">
                        {renderVistaEncuesta()}
                    </CCardBody>
                </CCard>
            </ShadowedCard>
        </div>
    );
}