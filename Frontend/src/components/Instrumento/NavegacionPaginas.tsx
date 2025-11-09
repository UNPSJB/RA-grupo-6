import { Row, Col, Button, Alert, ProgressBar } from 'react-bootstrap';
import type { GrupoPreguntas, RespuestaTemporal, InstanciaRespuestas } from '../types';
import { calcularProgresoTotal, validarPaginaCompleta } from '../Respuesta/ValidarRespuestas';

type Props = {
    paginaActual: number;
    totalPaginas: number;
    gruposOrganizados: GrupoPreguntas[];
    respuestas: RespuestaTemporal[];
    respuestasMultiples: { [grupoCuadroId: number]: InstanciaRespuestas[] };
    mostrarResumen: boolean;
    mostrarProgreso?: boolean;
    mostrarIndicadores?: boolean;
    mostrarBotones?: boolean;
    mostrarAlerta?: boolean;
    onAvanzar: () => void;
    onRetroceder: () => void;
    onIrAPagina: (index: number) => void;
};

function NavegacionPaginas({
    paginaActual,
    totalPaginas,
    gruposOrganizados,
    respuestas,
    respuestasMultiples,
    mostrarResumen,
    mostrarProgreso = false,
    mostrarIndicadores = false,
    mostrarBotones = false,
    mostrarAlerta = false,
    onAvanzar,
    onRetroceder,
    onIrAPagina,
}: Props) {
    const progreso = calcularProgresoTotal(respuestas, respuestasMultiples);
    const paginaCompleta = validarPaginaCompleta(paginaActual, gruposOrganizados, respuestas, respuestasMultiples);

    return (
        <>
            {!mostrarResumen && (
                <>
                    {mostrarProgreso && (
                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <small className="text-muted fw-semibold">Progreso general</small>
                                <small className="text-muted fw-semibold">{Math.round(progreso)}%</small>
                            </div>
                            <ProgressBar
                                now={progreso}
                                variant="success"
                                style={{ height: '10px', borderRadius: '10px' }}
                            />
                        </div>
                    )}

                    {mostrarIndicadores && (
                        <div className="d-flex justify-content-center align-items-center gap-2 mb-4 flex-wrap">
                            {gruposOrganizados.map((grupo, index) => {
                                const completada = index < paginaActual || (index === paginaActual && paginaCompleta);
                                const actual = index === paginaActual;

                                return (
                                    <div
                                        key={grupo.id}
                                        onClick={() => onIrAPagina(index)}
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

                    {mostrarBotones && (
                        <div className="mt-4 pt-3 border-top">
                            <Row className="align-items-center">
                                <Col xs={6}>
                                    {paginaActual > 0 && (
                                        <Button variant="outline-secondary" onClick={onRetroceder}>
                                            <i className="fa-solid fa-arrow-left"></i> Anterior
                                        </Button>
                                    )}
                                </Col>
                                <Col xs={6} className="text-end">
                                    <Button variant="primary" onClick={onAvanzar} disabled={!paginaCompleta}>
                                        {paginaActual < totalPaginas - 1 ? 'Siguiente →' : 'Ver Resumen →'}
                                    </Button>
                                </Col>
                            </Row>

                            {mostrarAlerta && !paginaCompleta && (
                                <Alert variant="warning" className="mt-3 mb-0">
                                    <i className="fas fa-info-circle me-2"></i>
                                    Complete todas las preguntas de esta sección para continuar
                                </Alert>
                            )}
                        </div>
                    )}
                </>
            )}
        </>
    );
}

export default NavegacionPaginas;