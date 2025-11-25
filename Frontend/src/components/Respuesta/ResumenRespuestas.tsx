import { ProgressBar } from 'react-bootstrap';
import ModalExito from '../ModalEnvio';
import type { GrupoPreguntas, RespuestaTemporal, InstanciaRespuestas } from '../types';
import { esTipoRespuestaValido } from '../Funciones';
import { CAlert, CCol, CRow } from '@coreui/react';

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

    const limpiarTitulo = (titulo: string) => {
        if (!titulo) return '';
        return titulo.replace(/\(Repetible\)/gi, '').trim();
    };

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
                return (resp && (resp?.opcion_id || ((resp.texto && (p.tipo_respuesta))? esTipoRespuestaValido(resp.texto, p.tipo_respuesta) : resp.texto))) 
            }).length;

            completadasObligatorias = grupo.preguntas
                .filter((p: any) => p.obligatoria)
                .filter((p: any) => {
                    const resp = obtenerRespuesta(p.id);
                    return (resp && (resp?.opcion_id || ((resp.texto && (p.tipo_respuesta))? esTipoRespuestaValido(resp.texto, p.tipo_respuesta) : resp.texto))) 
                }).length;
        } else {
            const instancias = respuestasMultiples[grupo.id] || [];

            for (const instancia of instancias) {
                for (const key in instancia) {
                    const r = instancia[key];
                    const pregunta = grupo.preguntas.find((p: any) => p.id === Number(key));
                    
                    if (pregunta?.obligatoria) {
                        totalObligatorias++;
                        if((r?.opcion_id || ((r.texto && (pregunta.tipo_respuesta))? esTipoRespuestaValido(r.texto, pregunta.tipo_respuesta) : r.texto))){
                            completadasObligatorias++;
                        }
                    }
                    
                    total++;
                    if(pregunta && (r?.opcion_id || ((r.texto && (pregunta.tipo_respuesta))? esTipoRespuestaValido(r.texto, pregunta.tipo_respuesta) : r.texto))){
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
                {/* Círculo de estado adaptativo */}
                <div
                    className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 bg-${todasRespondidas ? 'success' : 'warning'} bg-opacity-25`}
                    style={{
                        width: '80px',
                        height: '80px',
                        fontSize: '2.5rem',
                    }}
                >
                    {todasRespondidas ? (
                        <i className="fa-solid fa-check text-success"></i>
                    ) : (
                        <i className="fa-solid fa-triangle-exclamation text-warning"></i>
                    )}
                </div>
                
                <h2 className="fw-bold mb-2 text-body">
                    Resumen de respuestas
                </h2>
                <p className="text-muted mb-0">Revise sus respuestas antes de enviar</p>
            </div>

            {todasRespondidas ? (
                <CAlert color="success" className="text-center border-0 mb-4 d-flex align-items-center justify-content-center">
                    <i className="fas fa-check-circle me-2"></i>
                    <div>
                        Has completado todas las preguntas obligatorias. Puedes enviar el formulario.
                    </div>
                </CAlert>
            ) : (
                <CAlert color="warning" className="text-center border-0 mb-4 d-flex align-items-center justify-content-center">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    <div>
                        Algunas preguntas obligatorias están incompletas. Debes completarlas antes de enviar.
                    </div>
                </CAlert>
            )}

            <div className="mb-4">
                <h5 className="fw-bold mb-3 text-body">
                    Progreso por sección
                </h5>

                {gruposOrganizados.map((grupo, index) => {
                    const { 
                        completadasObligatorias,
                        totalObligatorias,
                        porcentajeObligatorias, 
                        obligatoriasCompletas,
                        todoCompleto,
                        opcionalesPendientes
                    } = calcularProgresoGrupo(grupo);

                    // Colores de estado (Bootstrap classes logic)
                    let badgeColorClass = 'bg-secondary';
                    let icon = <i className="fa-solid fa-exclamation"></i>;

                    if (obligatoriasCompletas) {
                        badgeColorClass = todoCompleto ? 'bg-success' : 'bg-success bg-opacity-75';
                        icon = <i className="fa-solid fa-check"></i>;
                    } else {
                        badgeColorClass = 'bg-danger';
                    }

                    // Barra de progreso color
                    const progressVariant = !obligatoriasCompletas ? 'danger' : todoCompleto ? 'success' : 'info';

                    return (
                        <div
                            key={grupo.id}
                            className="mb-3 p-3 rounded border bg-body-tertiary position-relative"
                            style={{ cursor: 'pointer' }}
                            onClick={() => onIrAPagina(index)}
                        >
                            <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                                <div className="d-flex align-items-center gap-2 flex-grow-1">
                                    {/* Badge de estado */}
                                    <div
                                        className={`d-flex align-items-center justify-content-center rounded text-white ${badgeColorClass}`}
                                        style={{
                                            minWidth: '32px',
                                            height: '28px',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        {icon}
                                    </div>
                                    
                                    <div className="flex-grow-1">
                                        {/* Título limpio sin (Repetible) y color adaptativo */}
                                        <h6 className="mb-0 fw-semibold text-body">
                                            {limpiarTitulo(grupo.nombre)}
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
                                
                                <button 
                                    className={`btn btn-sm ${obligatoriasCompletas ? 'btn-outline-success' : 'btn-outline-primary'}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onIrAPagina(index);
                                    }}
                                >
                                    {obligatoriasCompletas ? 'Revisar' : 'Completar'}
                                </button>
                            </div>

                            <ProgressBar
                                now={porcentajeObligatorias}
                                variant={progressVariant}
                                style={{ height: '8px', borderRadius: '4px' }}
                                className="bg-secondary bg-opacity-25"
                            />
                        </div>
                    );
                })}
            </div>

            <CRow className="mt-4 pt-3 border-top">
                <CCol md={6} className="mb-2">
                    <button
                        className="btn btn-outline-secondary w-100"
                        onClick={onRetroceder}
                    >
                        <i className="fa-solid fa-arrow-left me-2"></i>
                        Volver a editar
                    </button>
                </CCol>
                <CCol md={6} className="mb-2">
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
                </CCol>
            </CRow>
        </div>
    );
}

export default ResumenRespuestas;