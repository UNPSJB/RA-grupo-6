import { Alert, Row, Col, Badge, ProgressBar } from 'react-bootstrap';
import ModalExito from '../ModalEnvio';
import type { GrupoPreguntas, RespuestaTemporal, InstanciaRespuestas } from '../types';

type Props = {
    gruposOrganizados: GrupoPreguntas[];
    respuestas: RespuestaTemporal[];
    respuestasMultiples: { [grupoCuadroId: number]: InstanciaRespuestas[] };
    todasRespondidas: boolean;
    enviando: boolean;
    esDocente: boolean;
    onRetroceder: () => void;
    onIrAPagina: (index: number) => void;
    onEnviar: () => Promise<boolean>;
    onExito: () => void;
};

function ResumenRespuestas({
    gruposOrganizados,
    respuestas,
    respuestasMultiples,
    todasRespondidas,
    enviando,
    esDocente,
    onRetroceder,
    onIrAPagina,
    onEnviar,
    onExito,
}: Props) {
    const obtenerRespuesta = (preguntaId: number) => respuestas.find((r) => r.pregunta_id === preguntaId);

    const calcularProgresoGrupo = (grupo: GrupoPreguntas) => {
        let completadas = 0;
        let completadasObligatorias = 0;
        let total = 0;
        let totalObligatorias = 0;

        if (grupo.tipo === 'simple') {
            total = grupo.preguntas.length;
            totalObligatorias = grupo.preguntas.filter((p: any) => p.obligatoria).length;

            completadas = grupo.preguntas.filter((p: any) => {
                const resp = obtenerRespuesta(p.id);
                return resp?.texto?.trim() || resp?.opcion_id;
            }).length;

            completadasObligatorias = grupo.preguntas
                .filter((p: any) => p.obligatoria)
                .filter((p: any) => {
                    const resp = obtenerRespuesta(p.id);
                    return resp?.texto?.trim() || resp?.opcion_id;
                }).length;
        } else {
            const instancias = respuestasMultiples[grupo.id] || [];

            for (const instancia of instancias) {
                for (const key in instancia) {
                    const r = instancia[key];
                    const pregunta = grupo.preguntas.find((p: any) => p.id === Number(key));
                    
                    if (pregunta?.obligatoria) {
                        totalObligatorias++;
                        if (r.texto?.trim() || r.opcion_id) {
                            completadasObligatorias++;
                        }
                    }
                    
                    total++;
                    if (r.texto?.trim() || r.opcion_id) {
                        completadas++;
                    }
                }
            }
        }

        const porcentajeObligatorias = totalObligatorias > 0 ? (completadasObligatorias / totalObligatorias) * 100 : 100;
        const obligatoriasCompletas = completadasObligatorias === totalObligatorias;
        const todoCompleto = completadas === total;
        const opcionalesPendientes = total - completadas;

        return { 
            completadas, 
            total, 
            completadasObligatorias,
            totalObligatorias,
            porcentajeObligatorias, 
            obligatoriasCompletas,
            todoCompleto,
            opcionalesPendientes
        };
    };

    return (
        <div>
            <div className="text-center mb-4">
                <div
                    style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: todasRespondidas ? '#d1e7dd' : '#fff3cd',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        fontSize: '2.5rem',
                    }}
                >
                    {todasRespondidas ? (
                        <i className="fa-solid fa-check" style={{ color: '#0f5132' }}></i>
                    ) : (
                        <i className="fa-solid fa-triangle-exclamation" style={{ color: '#FFD43B' }}></i>
                    )}
                </div>
                <h2 className="fw-bold mb-2" style={{ color: '#1f2937' }}>
                    Resumen de respuestas
                </h2>
                <p className="text-muted mb-0">Revise sus respuestas antes de enviar</p>
            </div>

            {todasRespondidas ? (
                <Alert variant="success" className="text-center border-0 mb-4">
                    <i className="fas fa-check-circle me-2"></i>
                    ¡Excelente! Has completado todas las preguntas obligatorias. Puedes revisar tus respuestas o enviar el
                    formulario.
                </Alert>
            ) : (
                <Alert variant="warning" className="text-center border-0 mb-4">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    Algunas preguntas obligatorias están incompletas. Debes completarlas antes de enviar.
                </Alert>
            )}

            <div className="mb-4">
                <h5 className="fw-bold mb-3" style={{ color: '#1f2937' }}>
                    Progreso por sección
                </h5>

                {gruposOrganizados.map((grupo, index) => {
                    const { 
                        completadas, 
                        total, 
                        completadasObligatorias,
                        totalObligatorias,
                        porcentajeObligatorias, 
                        obligatoriasCompletas,
                        todoCompleto,
                        opcionalesPendientes
                    } = calcularProgresoGrupo(grupo);

                    const backgroundColor = !obligatoriasCompletas 
                        ? '#dc3545'  
                        : todoCompleto 
                            ? '#198754'  
                            : '#75b798'; 

                    return (
                        <div
                            key={grupo.id}
                            className="mb-3 p-3 rounded"
                            style={{
                                backgroundColor: '#f8f9fa',
                                border: '1px solid #dee2e6',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                            onClick={() => onIrAPagina(index)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#e9ecef';
                                e.currentTarget.style.borderColor = '#adb5bd';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#f8f9fa';
                                e.currentTarget.style.borderColor = '#dee2e6';
                            }}
                        >
                            <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                                <div className="d-flex align-items-center gap-2 flex-grow-1">
                                    <div
                                        style={{
                                            backgroundColor,
                                            color: 'white',
                                            fontSize: '0.9rem',
                                            padding: '0.4rem 0.6rem',
                                            borderRadius: '0.375rem',
                                            fontWeight: 'bold',
                                            flexShrink: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem'
                                        }}
                                    >
                                        {obligatoriasCompletas ? (
                                            todoCompleto ? (
                                                <>
                                                    <i className="fa-solid fa-check"></i>
                                                    <br></br>
                                                    <i className="fa-solid fa-check"></i>
                                                </>
                                            ) : (
                                                <i className="fa-solid fa-check"></i>
                                            )
                                        ) : (
                                            <i className="fa-solid fa-exclamation"></i>
                                        )}
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="mb-0 fw-semibold" style={{ color: '#1f2937' }}>
                                            {grupo.nombre}
                                        </h6>
                                        <small className="text-muted d-block">
                                            {todoCompleto ? (
                                                <>✓ Sección 100% completa</>
                                            ) : obligatoriasCompletas ? (
                                                <>✓ Obligatorias completas • {opcionalesPendientes} opcional{opcionalesPendientes > 1 ? 'es' : ''} pendiente{opcionalesPendientes > 1 ? 's' : ''}</>
                                            ) : (
                                                <>{completadasObligatorias} de {totalObligatorias} preguntas obligatorias respondidas</>
                                            )}
                                        </small>
                                    </div>
                                </div>
                                <span 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onIrAPagina(index);
                                    }}
                                    style={{
                                        padding: '0.375rem 0.75rem',
                                        fontSize: '0.875rem',
                                        borderRadius: '0.25rem',
                                        border: '1px solid #0d6efd',
                                        color: '#0d6efd',
                                        cursor: 'pointer',
                                        backgroundColor: 'transparent',
                                        whiteSpace: 'nowrap',
                                        flexShrink: 0,
                                    }}
                                >
                                    {obligatoriasCompletas ? 'Revisar' : 'Completar'}
                                </span>
                            </div>

                            <ProgressBar
                                now={porcentajeObligatorias}
                                style={{ 
                                    height: '8px', 
                                    borderRadius: '4px',
                                    backgroundColor: '#e9ecef'
                                }}
                            >
                                <div
                                    style={{
                                        width: `${porcentajeObligatorias}%`,
                                        backgroundColor,
                                        height: '100%',
                                        borderRadius: '4px',
                                        transition: 'width 0.3s ease'
                                    }}
                                />
                            </ProgressBar>
                        </div>
                    );
                })}
            </div>

            <Row className="mt-4 pt-3 border-top">
                <Col md={6} className="mb-2">
                    <button
                        className="btn btn-outline-secondary w-100"
                        onClick={onRetroceder}
                        style={{ cursor: 'pointer' }}
                    >
                        <i className="fa-solid fa-arrow-left me-2"></i>
                        Volver a editar
                    </button>
                </Col>
                <Col md={6} className="mb-2">
                    <ModalExito
                        onEnviar={onEnviar}
                        onExito={onExito}
                        desactivado={!todasRespondidas || enviando}
                        variante="success"
                        textoBoton={
                            enviando
                                ? 'Enviando...'
                                : esDocente
                                ? 'Enviar Informe de Cátedra'
                                : 'Enviar Encuesta'
                        }
                        className="w-100"
                    />
                </Col>
            </Row>
        </div>
    );
}

export default ResumenRespuestas;