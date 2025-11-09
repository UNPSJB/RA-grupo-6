import { Card, Col, Container, Row, Button, Alert, Badge} from "react-bootstrap";
import { GraficoRespondidos } from "../Graficos/GraficoRespondidos";
import { useEffect, useState } from "react";

// Interfaces para las estadísticas
export interface EstadisticaBase {
    asignados: number;
    respondidos: number;
    no_respondidos: number;
    carrera_nombre?: string;
    materia_nombre?: string;
    anio?: number;
    carrera_id?: number;
    departamento_id?: number;
    departamento_nombre?: string;
}
export interface EstadisticasDepartamento {
    [key: string]: EstadisticaBase;
}
export interface EstadisticaDetallada extends EstadisticaBase {
    instrumento_id: number;
    materia_id: string;
    fecha_inicio: string;
    fecha_cierre: string;
}

export function MostrarEstadisticasDepartamento({departamento_id} : {departamento_id:number}) {

    // Estados para las estadísticas
    const [estadisticasDetalladas, setEstadisticasDetalladas] = useState<EstadisticaDetallada[]>([]);


    // Estado para la vista activa
    const [vistaActiva, setVistaActiva] = useState<string>('carrera');
    const [cargando, setCargando] = useState(false);

    // Cargar carreras y estadísticas cuando cambia el departamento
    useEffect(() => {
        if (departamento_id) {
            cargarEstadisticas();
        } 
    }, [departamento_id]);

    // Función para cargar todas las estadísticas
    const cargarEstadisticas = async () => {
        if (!departamento_id) return;
        
        setCargando(true);
        try {
            const baseUrl = "http://127.0.0.1:8000/Dictados";
            const departamentoParam = `?departamento_id=${departamento_id}`;
            
            const [resCarrera, resAnio, resDetalladas] = await Promise.all([
                fetch(`${baseUrl}/EstadisticasPorCarrera${departamentoParam}`),
                fetch(`${baseUrl}/EstadisticasPorAnio${departamentoParam}`),
                fetch(`${baseUrl}/EstadisticasDetalladas${departamentoParam}`)
            ]);

            const dataDetalladas = await resDetalladas.json();

            setEstadisticasDetalladas(dataDetalladas.detallado || []);

        } catch (error) {
            console.error('Error cargando estadísticas:', error);
            setEstadisticasDetalladas([]);
        } finally {
            setCargando(false);
        }
    };

    // Agrupar datos filtrados para vistas consolidadas
    const datosAgrupadosPorCarrera = estadisticasDetalladas.reduce((acc, item) => {
        const key = item.carrera_id?.toString();
        if(key != undefined){
            if (!acc[key]) {
                acc[key] = {
                    asignados: 0,
                    respondidos: 0,
                    no_respondidos: 0,
                    carrera_nombre: item.carrera_nombre,
                    carrera_id: item.carrera_id
                };
            }
            acc[key].asignados += item.asignados;
            acc[key].respondidos += item.respondidos;
            acc[key].no_respondidos += item.no_respondidos;
        }
        return acc;
    }, {} as EstadisticasDepartamento);

    const datosAgrupadosPorAnio = estadisticasDetalladas.reduce((acc, item) => {
        const key = item.anio?.toString();
        if (key != undefined) {
            if (!acc[key]) {
                acc[key] = {
                    asignados: 0,
                    respondidos: 0,
                    no_respondidos: 0,
                    anio: item.anio
                };
            }
            acc[key].asignados += item.asignados;
            acc[key].respondidos += item.respondidos;
            acc[key].no_respondidos += item.no_respondidos;
        }
        return acc;
    }, {} as EstadisticasDepartamento);

    // Función para renderizar una tarjeta de estadísticas
    const renderTarjetaEstadistica = (titulo: string, stats: EstadisticaBase, key: string) => (
        <Col xs={6} key={key} className="mb-4">
            <Card className="shadow-sm">
                <Card.Header className="bg-light text-center">
                    <h6 className="mb-0 fw-bold">{titulo}</h6>
                </Card.Header>
                <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                    
                    <div className="mb-3" style={{ width: '200px', height: '200px'}}>
                        <GraficoRespondidos titulo="" respondidos={stats.respondidos} noRespondidos={stats.no_respondidos} />
                    </div>
                    <Row className="text-center">
                        <Col xs={4} className="border-end">
                            <span className="fw-bold text-success d-block fs-5">
                                {stats.respondidos}
                            </span>
                            <small className="text-muted">Respondidos</small>
                        </Col>
                        <Col xs={4} className="border-end">
                            <span className="fw-bold text-danger d-block fs-5">
                                {stats.no_respondidos}
                            </span>
                            <small className="text-muted">Sin responder</small>
                        </Col>
                        <Col xs={4}>
                            <span className="fw-bold text-primary d-block fs-5">
                                {stats.asignados}
                            </span>
                            <small className="text-muted">Total</small>
                        </Col>
                    </Row>
                    {stats.asignados > 0 && (
                        <div className="mt-3 text-center">
                            <Badge bg="secondary">
                                Tasa: {((stats.respondidos / stats.asignados) * 100).toFixed(1)}%
                            </Badge>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Col>
    );

return (
    <Container className="py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
            <div>
                <h1 className="h2 mb-2">Estadísticas de Respuestas</h1>
                <p className="text-muted mb-0">
                    Visualiza las tasas de respuesta por carrera, materia y año
                </p>
            </div>
        </div>

        {/* Botones de Vista Filtrada */}
        <Card.Body className="py-3">
            <Row className="g-2">
                {["carrera", "detallada", "anio"].map((v) => (
                    <Col sm={4} key={v}>
                        <Button variant={vistaActiva === v ? "primary" : "outline-primary"} onClick={() => setVistaActiva(v)} className="w-100 text-truncate">
                            {v === "carrera" ? "Carreras" : v === "anio" ? "Años" : "Materias"}
                        </Button>
                    </Col>
                ))}
            </Row>
        </Card.Body>

        {/* Contenido según Vista */}
        {!departamento_id ? (
            <Alert variant="warning" className="text-center py-4">
                <h5>Seleccione un departamento para comenzar</h5>
                <p className="mb-0 fs-6">
                    Elige un departamento del filtro superior para visualizar las estadísticas de encuestas.
                </p>
            </Alert>
        ) : vistaActiva === "carrera" ? (
            <div>
                <h4 className="text-center mb-4">Estadísticas por Carrera</h4>
                <Row>
                    {Object.entries(datosAgrupadosPorCarrera).map(([carreraId, stats]) =>
                        renderTarjetaEstadistica(stats.carrera_nombre || `Carrera ${carreraId}`, stats, `carrera-${carreraId}`)
                    )}
                    {Object.keys(datosAgrupadosPorCarrera).length === 0 && !cargando && (
                        <Col xs={12}>
                            <Alert variant="info" className="text-center py-4">
                                No hay estadísticas disponibles para los filtros aplicados.
                            </Alert>
                        </Col>
                    )}
                </Row>
            </div>
        ) : vistaActiva === "anio" ? (
            <div>
                <h4 className="text-center mb-4">Estadísticas por Año</h4>
                <Row>
                    {Object.entries(datosAgrupadosPorAnio).map(([anio, stats]) =>
                        renderTarjetaEstadistica(`Año ${anio}`, stats, `anio-${anio}`)
                    )}
                    {Object.keys(datosAgrupadosPorAnio).length === 0 && !cargando && (
                        <Col xs={12}>
                            <Alert variant="info" className="text-center py-4">
                                No hay estadísticas disponibles para los filtros aplicados.
                            </Alert>
                        </Col>
                    )}
                </Row>
            </div>
        ) : vistaActiva === "detallada" ? (
            <div>
                <h4 className="text-center mb-4">Estadística Detallada por Materia</h4>
                <Row>
                    {estadisticasDetalladas.map((item) =>
                        renderTarjetaEstadistica(`${item.materia_nombre} - ${item.anio}`, item, `detalle-${item.instrumento_id}`)
                    )}
                    {estadisticasDetalladas.length === 0 && !cargando && (
                        <Col xs={12}>
                            <Alert variant="info" className="text-center py-4">
                                No hay estadísticas disponibles para los filtros aplicados.
                            </Alert>
                        </Col>
                    )}
                </Row>
            </div>
        ) : null}
    </Container>
);
}