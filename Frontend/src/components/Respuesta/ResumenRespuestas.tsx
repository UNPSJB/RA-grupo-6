import { Card, Alert, Row, Col, Button, Badge, ProgressBar } from 'react-bootstrap';
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
        <Card className="border-0 shadow-sm w-100 mb-4" style={{ borderRadius: '1rem' }}>
            <Card.Body className="p-4">
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
                            <i className="fa-solid fa-check"></i>
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
                    <Alert variant="success" className="text-center">
                        <i className="fas fa-check-circle me-2"></i>
                        ¡Excelente! Has completado todas las preguntas. Puedes revisar tus respuestas o enviar el
                        formulario.
                    </Alert>
                ) : (
                    <Alert variant="warning" className="text-center">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        Algunas preguntas están incompletas. Puedes volver atrás para completarlas.
                    </Alert>
                )}

                <div className="mt-4 mb-5">
                    <h5 className="fw-bold mb-3">Progreso por sección</h5>
                    <Row className="g-3">
                        {gruposOrganizados.map((grupo, index) => {
                            const { completadas, total, porcentaje, completo } = calcularProgresoGrupo(grupo);

                            return (
                                <Col xs={12} md={6} key={grupo.id}>
                                    <Card
                                        className="h-100 border"
                                        style={{ cursor: 'pointer', transition: 'all 0.2s', minHeight: '120px' }}
                                        onClick={() => onIrAPagina(index)}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <Card.Body className="p-4">
                                            <div className="d-flex align-items-start justify-content-between mb-3">
                                                <div className="d-flex align-items-center gap-2 flex-grow-1">
                                                    <Badge bg={completo ? 'success' : 'warning'} className="py-2 px-2">
                                                        {completo ? (
                                                            <i className="fa-solid fa-check"></i>
                                                        ) : (
                                                            <i className="fa-solid fa-triangle-exclamation"></i>
                                                        )}
                                                    </Badge>
                                                    <div className="flex-grow-1">
                                                        <h6 className="mb-1 fw-semibold" style={{ fontSize: '1.05rem' }}>{grupo.nombre}</h6>
                                                        <small className="text-muted" style={{ fontSize: '0.9rem' }}>
                                                            {completadas} de {total} preguntas respondidas
                                                        </small>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onIrAPagina(index);
                                                    }}
                                                    style={{ minWidth: '90px' }}
                                                >
                                                    {completo ? 'Revisar' : 'Completar'}
                                                </Button>
                                            </div>
                                            <ProgressBar
                                                now={porcentaje}
                                                variant={completo ? 'success' : 'warning'}
                                                style={{ height: '8px' }}
                                            />
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </div>

                <Row className="mt-5 pt-3" style={{ borderTop: '2px solid #e9ecef' }}>
                    <Col md={6} className="mb-2">
                        <Button variant="outline-secondary" className="w-100" onClick={onRetroceder}>
                            <i className="fa-solid fa-arrow-left"></i> Volver a editar
                        </Button>
                    </Col>
                    <Col md={6} className="mb-2">
                        <ModalExito
                            onEnviar={onEnviar}
                            onExito={onExito}
                            desactivado={!todasRespondidas || enviando}
                            variante="success"
                            textoBoton={esDocente ? 'Enviar Informe de Cátedra' : 'Enviar Encuesta'}
                            className="w-100"
                        />
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default ResumenRespuestas;