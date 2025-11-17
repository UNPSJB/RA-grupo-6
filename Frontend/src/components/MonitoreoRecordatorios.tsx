import {
    CCard,
    CButton,
    CAlert,
    CBadge,
    CSpinner,
    CTable,
    CCardBody,
    CTableHead,
    CTableRow,
    CTableHeaderCell, CTableBody, CTableDataCell,
    CCardHeader
} from "@coreui/react";
import { useState, useEffect } from "react";
import { capitalizarCadena } from "./Funciones";
import ShadowedCard from "./coreui-components/ShadowedCard";

interface EstadoProgramador {
    automatico: boolean;
    programado: string;
    funcionalidad: string;
}

interface ResultadoEnvio {
    enviados: number;
    fallidos: number;
    total_estudiantes: number;
    detalles: Array<{
        estudiante: string;
        email: string;
        materia: string;
        fecha_cierre: string;
        dias_restantes: number;
        estado: string;
    }>;
}

export function MonitoreoRecordatorios() {
    const [estado, setEstado] = useState<EstadoProgramador | null>(null);
    const [ejecutando, setEjecutando] = useState(false);
    const [resultado, setResultado] = useState<ResultadoEnvio | null>(null);
    const [mostrarDetalles, setMostrarDetalles] = useState(false);

    useEffect(() => {
        cargarEstado();
    }, []);

    const cargarEstado = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/email/estado-programador");
            const data = await response.json();
            setEstado(data);
        } catch (error) {
            console.error('Error cargando estado:', error);
        }
    };

    const ejecutarAhora = async () => {
        setEjecutando(true);
        setResultado(null);
        try {
            const response = await fetch("http://127.0.0.1:8000/email/recordatorios/ejecutar-ahora", {
                method: 'POST'
            });
            const data: ResultadoEnvio = await response.json();
            setResultado(data);
        } catch (error) {
            console.error('Error ejecutando recordatorios:', error);
            alert('Error ejecutando recordatorios');
        } finally {
            setEjecutando(false);
        }
    };

    return (
        <ShadowedCard >
            <CCardHeader>
                <div className="m-2">
                    <h4 >
                        Recordatorios Automáticos
                    </h4>
                    <p className="text-medium-emphasis">
                        Configuración y ejecución del sistema de recordatorios
                    </p>
                </div>
            </CCardHeader>
            <CCardBody className="p-4 p-md-5">
                {estado ? (
                    <div>
                        <div className="row g-3 mb-4">
                            <div className="col-md-4 text-center">
                                <div className="text-uppercase small text-medium-emphasis">Estado del Sistema</div>
                                <CBadge color={estado.automatico ? "success" : "danger"} className="fs-6 px-3 py-1 mt-1">
                                    {estado.automatico ? "ACTIVO" : "INACTIVO"}
                                </CBadge>
                            </div>

                            <div className="col-md-4 text-center">
                                <div className="text-uppercase small text-medium-emphasis">Programación Automática</div>
                                <p className="fw-bold mb-0 mt-1">{estado.programado}</p>
                            </div>

                            <div className="col-md-4 text-center">
                                <div className="text-uppercase small text-medium-emphasis">Función</div>
                                <p className="fw-bold mb-0 mt-1">{estado.funcionalidad}</p>
                            </div>
                        </div>

                        <hr />

                        <CAlert color="info" className="d-flex align-items-center">
                            <i className="fas fa-info-circle me-3" style={{ fontSize: '1.5rem' }}></i>
                            <div>
                                Presione el botón "Ejecutar Recordatorios Ahora" para enviar notificaciones inmediatamente sin esperar la programación automática.
                            </div>
                        </CAlert>

                        <div className="d-grid mt-4">
                            <CButton
                                color="primary"
                                onClick={ejecutarAhora}
                                disabled={ejecutando}
                            >
                                {ejecutando ? (
                                    <>
                                        <CSpinner as="span" size="sm" aria-hidden="true" className="me-2" />
                                        Ejecutando...
                                    </>
                                ) : (
                                    "Ejecutar Recordatorios Ahora"
                                )}
                            </CButton>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-5">
                        <CSpinner className="me-2" />
                        <span>Cargando estado del sistema...</span>
                    </div>
                )}

                {resultado && (
                    <div className="mt-5">
                        <hr className="mb-4" />

                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold mb-0">Resultado del Envío</h5>
                                <CButton
                                    variant="outline"
                                    color="primary"
                                    size="sm"
                                    onClick={() => setMostrarDetalles(!mostrarDetalles)}
                                >
                                   Ver detalles
                                </CButton>
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col-md-4">
                                    <CCard className="text-center p-3">
                                        <div className="text-uppercase small text-medium-emphasis">Total Estudiantes</div>
                                        <div className="fs-4 fw-bold mb-0">{resultado.total_estudiantes}</div>
                                    </CCard>
                                </div>

                                <div className="col-md-4">
                                    <CCard className="text-center p-3 bg-success-light">
                                        <div className="text-uppercase small text-medium-emphasis">Enviados</div>
                                        <div className="fs-4 fw-bold mb-0 text-success">{resultado.enviados}</div>
                                    </CCard>
                                </div>

                                <div className="col-md-4">
                                    <CCard className="text-center p-3 bg-danger-light">
                                        <div className="text-uppercase small text-medium-emphasis">Fallidos</div>
                                        <div className="fs-4 fw-bold mb-0 text-danger">{resultado.fallidos}</div>
                                    </CCard>
                                </div>
                            </div>
                        </div>

                        {mostrarDetalles && resultado.detalles.length > 0 && (
                            <div className="mt-4">
                                <CTable striped hover responsive>
                                    <CTableHead color="light">
                                        <CTableRow>
                                            <CTableHeaderCell className="text-center">Estudiante</CTableHeaderCell>
                                            <CTableHeaderCell className="text-center">Email</CTableHeaderCell>
                                            <CTableHeaderCell className="text-center">Materia</CTableHeaderCell>
                                            <CTableHeaderCell className="text-center">Vence en</CTableHeaderCell>
                                            <CTableHeaderCell className="text-center">Estado</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {resultado.detalles.map((detalle, index) => (
                                            <CTableRow key={index} verticalAlign="middle">
                                                <CTableDataCell><strong>{capitalizarCadena(detalle.estudiante)}</strong></CTableDataCell>
                                                <CTableDataCell><small>{detalle.email}</small></CTableDataCell>
                                                <CTableDataCell>{capitalizarCadena(detalle.materia)}</CTableDataCell>
                                                <CTableDataCell className="text-center">
                                                    <CBadge color={
                                                        detalle.dias_restantes <= 3 ? "danger" :
                                                        detalle.dias_restantes <= 7 ? "warning" : "info"
                                                    }>
                                                        {detalle.dias_restantes} días
                                                    </CBadge>
                                                    <div className="small text-medium-emphasis mt-1">{detalle.fecha_cierre}</div>
                                                </CTableDataCell>
                                                <CTableDataCell className="text-center">
                                                    <CBadge color={detalle.estado === "enviado" ? "success" : "danger"}>
                                                        {detalle.estado}
                                                    </CBadge>
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))}
                                    </CTableBody>
                                </CTable>
                            </div>
                        )}

                        {resultado.detalles.length === 0 && (
                            <CAlert color="info" className="text-center mt-4">
                                No se encontraron estudiantes pendientes para instrumentos que vencen en 7 días.
                            </CAlert>
                        )}
                    </div>
                )}
            </CCardBody>
        </ShadowedCard>
    );
}