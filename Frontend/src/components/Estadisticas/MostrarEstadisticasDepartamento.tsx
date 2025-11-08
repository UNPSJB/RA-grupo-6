import { Card, Col, Container, Row, Form, Button, Alert, Badge} from "react-bootstrap";
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

// Interfaces para los datos de filtro
interface Departamento {
    id: number;
    nombre: string;
}
interface Carrera {
    id: number;
    nombre: string;
    departamento_id: number;
}
interface Materia {
    id: string;
    nombre: string;
    carrera_id: number;
}

export function MostrarEstadisticasDepartamento() {
    // Estados para las estadísticas
    const [estadisticasCarrera, setEstadisticasCarrera] = useState<EstadisticasDepartamento>({});
    const [estadisticasAnio, setEstadisticasAnio] = useState<EstadisticasDepartamento>({});
    const [estadisticasDetalladas, setEstadisticasDetalladas] = useState<EstadisticaDetallada[]>([]);

    // Estados para los datos de filtro
    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [carreras, setCarreras] = useState<Carrera[]>([]);
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [anios, setAnios] = useState<number[]>([]);

    // Estados para los filtros activos
    const [filtros, setFiltros] = useState({
        departamento: '',
        carrera: '',
        anio: '',
        materia: ''
    });

    // Estado para la vista activa
    const [vistaActiva, setVistaActiva] = useState<'carrera' | 'anio' | 'detallada'>('carrera');
    const [cargando, setCargando] = useState(false);

    // Cargar departamentos
    useEffect(() => {
        cargarDepartamentos();
    }, []);

    // Cargar carreras y estadísticas cuando cambia el departamento
    useEffect(() => {
        if (filtros.departamento) {
            cargarCarrerasPorDepartamento();
            cargarEstadisticas();
        } else {
            // Limpiar cuando no hay departamento seleccionado
            setCarreras([]);
            setMaterias([]);
            setEstadisticasCarrera({});
            setEstadisticasAnio({});
            setEstadisticasDetalladas([]);
            setAnios([]);
            setFiltros(prev => ({ ...prev, carrera: '', anio: '', materia: '' }));
        }
    }, [filtros.departamento]);

    // Cargar materias cuando cambia la carrera
    useEffect(() => {
        if (filtros.carrera) {
            cargarMateriasPorCarrera();
        } else {
            setMaterias([]);
            setFiltros(prev => ({ ...prev, materia: '' }));
        }
    }, [filtros.carrera]);

    // Función para cargar departamentos
    const cargarDepartamentos = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/departamentos/");
            const data = await response.json();
            setDepartamentos(data);
        } catch (error) {
            console.error('Error cargando departamentos:', error);
        }
    };

    // Función para cargar carreras por departamento
    const cargarCarrerasPorDepartamento = async () => {
        if (!filtros.departamento) return;
        
        try {
            const response = await fetch("http://127.0.0.1:8000/carreras/");
            const todasLasCarreras: Carrera[] = await response.json();
            // Filtrar carreras por departamento seleccionado
            const carrerasFiltradas = todasLasCarreras.filter(carrera => 
                carrera.departamento_id === parseInt(filtros.departamento)
            );
            setCarreras(carrerasFiltradas);
            
            // Resetear carrera seleccionada si ya no pertenece al departamento
            if (filtros.carrera && !carrerasFiltradas.some(c => c.id === parseInt(filtros.carrera))) {
                setFiltros(prev => ({ ...prev, carrera: '' }));
            }
        } catch (error) {
            console.error('Error cargando carreras:', error);
        }
    };

// Función para cargar materias por carrera
const cargarMateriasPorCarrera = async () => {
    if (!filtros.carrera) {
        setMaterias([]); // limpiar materias si no hay carrera
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/materias/");
        const todasLasMaterias: Materia[] = await response.json();

        // Filtrar materias por carrera seleccionada
        const materiasFiltradas = todasLasMaterias.filter(
            (materia) => materia.carrera_id === parseInt(filtros.carrera)
        );
        setMaterias(materiasFiltradas);

        // Resetear materia seleccionada si ya no pertenece a la carrera
        if (
            filtros.materia &&
            !materiasFiltradas.some((m) => m.id === parseInt(filtros.materia))
        ) {
            setFiltros((prev) => ({ ...prev, materia: "" }));
        }
    } catch (error) {
        console.error("Error cargando materias:", error);
    }
};

// Llamar cargarMateriasPorCarrera cada vez que cambia la carrera
useEffect(() => {
    cargarMateriasPorCarrera();
}, [filtros.carrera]);

    // Función para cargar todas las estadísticas
    const cargarEstadisticas = async () => {
        if (!filtros.departamento) return;
        
        setCargando(true);
        try {
            const baseUrl = "http://127.0.0.1:8000/Dictados";
            const departamentoParam = `?departamento_id=${filtros.departamento}`;
            
            const [resCarrera, resAnio, resDetalladas] = await Promise.all([
                fetch(`${baseUrl}/EstadisticasPorCarrera${departamentoParam}`),
                fetch(`${baseUrl}/EstadisticasPorAnio${departamentoParam}`),
                fetch(`${baseUrl}/EstadisticasDetalladas${departamentoParam}`)
            ]);

            const dataCarrera = await resCarrera.json();
            const dataAnio = await resAnio.json();
            const dataDetalladas = await resDetalladas.json();

            setEstadisticasCarrera(dataCarrera);
            setEstadisticasAnio(dataAnio);
            setEstadisticasDetalladas(dataDetalladas.detallado || []);

            // Extraer años únicos de las estadíticas detalladas para el filtro de año
            const aniosUnicos = [...new Set(dataDetalladas.detallado?.map((e: any) => e.anio) || [])] as number[];
            setAnios(aniosUnicos.sort((a, b) => b - a));

        } catch (error) {
            console.error('Error cargando estadísticas:', error);
            setEstadisticasCarrera({});
            setEstadisticasAnio({});
            setEstadisticasDetalladas([]);
        } finally {
            setCargando(false);
        }
    };

    // Filtrar datos detallados asegún los filtros activos
    const datosFiltrados = estadisticasDetalladas.filter(item => {
        if (filtros.carrera && item.carrera_id !== parseInt(filtros.carrera)) return false;
        if (filtros.anio && item.anio !== parseInt(filtros.anio)) return false;
        if (filtros.materia && item.materia_id !== filtros.materia) return false;
        return true;
    });

    // Agrupar datos filtrados para vistas consolidadas
    const datosAgrupadosPorCarrera = datosFiltrados.reduce((acc, item) => {
        const key = item.carrera_id.toString();
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
        return acc;
    }, {} as EstadisticasDepartamento);

    const datosAgrupadosPorAnio = datosFiltrados.reduce((acc, item) => {
        const key = item.anio.toString();
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
        return acc;
    }, {} as EstadisticasDepartamento);

    // Función para renderizar una tarjeta de estadísticas
    const renderTarjetaEstadistica = (titulo: string, stats: EstadisticaBase, key: string) => (
        <Col xs={12} md={6} lg={4} key={key} className="mb-4">
            <Card className="h-100 shadow-sm">
                <Card.Header className="bg-light text-center">
                    <h6 className="mb-0 fw-bold">{titulo}</h6>
                </Card.Header>
                <Card.Body className="d-flex flex-column align-items-center">
                    <div className="mb-3" style={{ width: '200px', height: '200px' }}>
                        <GraficoRespondidos 
                            titulo=""
                            respondidos={stats.respondidos}
                            noRespondidos={stats.no_respondidos}
                        />
                    </div>
                    <div className="w-100">
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
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );

    // Departamento seleccionado actualmente
    const departamentoActual = departamentos.find(depto => depto.id === parseInt(filtros.departamento));

    // Filtrar carreras según departamento seleccionado
const carrerasFiltradas = filtros.departamento
  ? carreras.filter(c => c.departamento_id === parseInt(filtros.departamento))
  : [];

// Filtrar materias según carrera seleccionada
const materiasFiltradas = filtros.carrera
  ? materias.filter(m => m.carrera_id === parseInt(filtros.carrera))
  : [];


return (
    <Container className="py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
            <div>
                <h1 className="h2 mb-2">Estadísticas de Respuestas</h1>
                <p className="text-muted mb-0">
                    Visualiza las tasas de respuesta por departamento, carrera y año
                </p>
            </div>
            {filtros.departamento && (
                <Badge bg="primary" className="fs-6 px-3 py-2 mt-2 mt-md-0">
                    {datosFiltrados.length} de {estadisticasDetalladas.length} instrumentos
                </Badge>
            )}
        </div>

        {departamentoActual && (
            <Alert variant="info" className="mb-4">
                <strong>Departamento seleccionado:</strong> {departamentoActual.nombre}
            </Alert>
        )}

        {/* Filtros */}
        <Card.Body className="mb-3">
            <Row className="g-3">
                <Col xs={12} sm={6} md={3}>
                    <Form.Group>
                        <Form.Label className="fw-bold">Departamento</Form.Label>
                        <Form.Select
                            value={filtros.departamento}
                            onChange={(e) =>
                                setFiltros({ departamento: e.target.value, carrera: "", anio: "", materia: "" })
                            }
                        >
                            <option value="">Seleccionar departamento</option>
                            {departamentos.map((depto) => (
                                <option key={depto.id} value={depto.id}>
                                    {depto.nombre}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col xs={12} sm={6} md={3}>
                    <Form.Group>
                        <Form.Label className="fw-bold">Carrera</Form.Label>
                        <Form.Select
                            value={filtros.carrera}
                            onChange={(e) => setFiltros({ ...filtros, carrera: e.target.value, materia: "" })}
                            disabled={!filtros.departamento}
                        >
                            <option value="">Todas las carreras</option>
                            {carrerasFiltradas?.map((carrera) => (
                                <option key={carrera.id} value={carrera.id}>
                                    {carrera.nombre}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col xs={12} sm={6} md={2}>
                    <Form.Group>
                        <Form.Label className="fw-bold">Año</Form.Label>
                        <Form.Select
                            value={filtros.anio}
                            onChange={(e) => setFiltros({ ...filtros, anio: e.target.value })}
                            disabled={!filtros.departamento}
                        >
                            <option value="">Todos</option>
                            {anios.map((anio) => (
                                <option key={anio} value={anio}>
                                    {anio}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>



                <Col xs={12} sm={6} md={1} className="d-flex align-items-end">
                    <Button
                        variant="outline-secondary"
                        onClick={() =>
                            setFiltros({ departamento: filtros.departamento, carrera: "", anio: "", materia: "" })
                        }
                        disabled={!filtros.departamento}
                        className="w-100"
                    >
                        Limpiar
                    </Button>
                </Col>
            </Row>
        </Card.Body>

        {/* Botones de Vista Filtrada */}
        <Card.Body className="py-3">
            <Row className="g-2">
                {["carrera", "anio", "detallada"].map((v) => (
                    <Col xs={6} sm={3} key={v}>
                        <Button
                            variant={vistaActiva === v ? "primary" : "outline-primary"}
                            onClick={() => setVistaActiva(v)}
                            className="w-100 text-truncate"
                        >
                            {v === "carrera" ? "Por carrera" :
                             v === "anio" ? "Por año" :
                             "Por Materia"}
                        </Button>
                    </Col>
                ))}
            </Row>
        </Card.Body>

        {/* Contenido según Vista */}
        {!filtros.departamento ? (
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
                    {datosFiltrados.map((item) =>
                        renderTarjetaEstadistica(`${item.materia_nombre} - ${item.anio}`, item, `detalle-${item.instrumento_id}`)
                    )}
                    {datosFiltrados.length === 0 && !cargando && (
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