import { Alert, Row, Col, Button, Badge, ProgressBar } from 'react-bootstrap';
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

        return { completadas, total, porcentaje, completo };
    };

    return (
        <div>
            {/* Header del resumen */}
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
                    ¡Excelente! Has completado todas las preguntas. Puedes revisar tus respuestas o enviar el
                    formulario.
                </Alert>
            ) : (
                <Alert variant="warning" className="text-center border-0 mb-4">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Algunas preguntas están incompletas. Puedes volver atrás para completarlas.
                </Alert>
            )}


            <div className="mb-4">
                <h5 className="fw-bold mb-3" style={{ color: '#1f2937' }}>
                    Progreso por sección
                </h5>

                {gruposOrganizados.map((grupo, index) => {
                    const { completadas, total, porcentaje, completo } = calcularProgresoGrupo(grupo);

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
                            <Row className="align-items-center mb-2">
                                <Col xs={8}>
                                    <div className="d-flex align-items-center gap-2">
                                        <Badge
                                            bg={completo ? 'success' : 'warning'}
                                            style={{
                                                fontSize: '0.9rem',
                                                padding: '0.4rem 0.6rem',
                                            }}
                                        >
                                            {completo ? (
                                                <i className="fa-solid fa-check"></i>
                                            ) : (
                                                <i className="fa-solid fa-triangle-exclamation"></i>
                                            )}
                                        </Badge>
                                        <div>
                                            <h6 className="mb-0 fw-semibold" style={{ color: '#1f2937' }}>
                                                {grupo.nombre}
                                            </h6>
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
                                            onIrAPagina(index);
                                        }}
                                    >
                                        {completo ? 'Revisar' : 'Completar'}
                                    </Button>
                                </Col>
                            </Row>

                            <ProgressBar
                                now={porcentaje}
                                variant={completo ? 'success' : 'warning'}
                                style={{ height: '8px', borderRadius: '4px' }}
                            />
                        </div>
                    );
                })}
            </div>
            <Row className="mt-4 pt-3 border-top">
                <Col md={6} className="mb-2">
                    <Button
                        variant="outline-secondary"
                        className="w-100"
                        onClick={onRetroceder}
                    >
                        <i className="fa-solid fa-arrow-left me-2"></i>
                        Volver a editar
                    </Button>
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