import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Spinner, Alert } from "react-bootstrap";
import { CCard, CCardBody, CBadge, CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from "@coreui/react";
import { capitalizarCadena } from "../../Funciones";

interface InstrumentoDepartamento {
    id: number;
    tipo: 'INFORME_SINTETICO';
    fecha_inicio: string;
    fecha_cierre: string;
    materia: {
        id: string;
        nombre: string;
    };
    plantilla_formulario: {
        id: number;
        titulo: string;
    };
    plantilla_formulario_id: number;
    materia_id: string;
}

export default function SeleccionarInformeSintetico() {
    const [informes, setInformes] = useState<InstrumentoDepartamento[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        cargarInformesSinteticos();
    }, []);

    const cargarInformesSinteticos = async () => {
        try {
            setLoading(true);
            setError(null);

           
            const usuarioActual = JSON.parse(localStorage.getItem('usuario_actual') || '{}');
            const usuarioId = usuarioActual.id || 3; 

            console.log('Cargando informes sintéticos para usuario:', usuarioId);
           
            const response = await fetch(
                `http://127.0.0.1:8000/instrumentos/INFORME_SINTETICO?usuario_id=${usuarioId}&mostrar_respondidos=false`
            );
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.detail || `Error ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            console.log('Informes sintéticos recibidos:', data);
            
            setInformes(Array.isArray(data) ? data : []);
            
            if (!Array.isArray(data) || data.length === 0) {
                setMensaje('No se encontraron informes sintéticos pendientes.');
            }
            
        } catch (err: any) {
            setError(err.message);
            console.error("Error cargando informes sintéticos:", err);
            setMensaje("Error al cargar los informes sintéticos");
        } finally {
            setLoading(false);
        }
    };

    const handleSeleccionarInforme = (informe: InstrumentoDepartamento) => {
        console.log('Informe sintético seleccionado:', informe);
        
        
        navigate(`/responder-instrumento/${informe.id}`, {
            state: {
                materiaNombre: informe.materia.nombre,
                materiaId: informe.materia.id,
                rol: 'departamento'
            }
        });
    };

    const estaActivo = (instrumento: InstrumentoDepartamento) => {
        const hoy = new Date();
        return new Date(instrumento.fecha_inicio) <= hoy && 
               new Date(instrumento.fecha_cierre) >= hoy;
    };

    if (loading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" role="status" className="mb-3" />
                <p>Cargando informes sintéticos disponibles...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                    <div className="mt-3">
                        <CButton color="outline-danger" onClick={cargarInformesSinteticos}>
                            Reintentar
                        </CButton>
                    </div>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <CCard className="border-0 shadow-sm">
                <CCardBody className="p-4 p-md-5">
                    <div className="mb-4">
                        <h1 className="fw-bold mb-2">Informes Sintéticos Pendientes</h1>
                        <p className="text-medium-emphasis mb-0">
                            Selecciona un informe sintético para completar.
                        </p>
                    </div>

                    {mensaje && !informes.length && (
                        <Alert variant={mensaje.includes('Error') ? 'warning' : 'info'} className="mb-4">
                            {mensaje}
                        </Alert>
                    )}

                    {informes.length > 0 ? (
                        <CTable striped hover responsive>
                            <CTableHead color="light">
                                <CTableRow>
                                    <CTableHeaderCell>Materia</CTableHeaderCell>
                                    <CTableHeaderCell className="text-center">Estado</CTableHeaderCell>
                                    <CTableHeaderCell>Vencimiento</CTableHeaderCell>
                                    <CTableHeaderCell className="text-center">Acción</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {informes.map((informe) => {
                                    const activo = estaActivo(informe);
                                    return (
                                        <CTableRow key={informe.id} onClick={() => activo && handleSeleccionarInforme(informe)} style={{ cursor: activo ? 'pointer' : 'not-allowed' }}>
                                            <CTableDataCell>
                                                <div className="fw-bold">{capitalizarCadena(informe.materia.nombre)}</div>
                                                <div className="small text-medium-emphasis">Código: {informe.materia.id}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <CBadge color={activo ? "success" : "secondary"}>
                                                    {activo ? "Activo" : "Inactivo"}
                                                </CBadge>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {activo ? new Date(informe.fecha_cierre).toLocaleDateString() : '-'}
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <CButton
                                                    color="primary"
                                                    size="sm"
                                                    disabled={!activo}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSeleccionarInforme(informe);
                                                    }}
                                                >
                                                    <i className="fas fa-edit me-2"></i>
                                                    Completar
                                                </CButton>
                                            </CTableDataCell>
                                        </CTableRow>
                                    );
                                })}
                            </CTableBody>
                        </CTable>
                    ) : (
                        !mensaje.includes('Error') && (
                            <div className="text-center py-5">
                                <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                                <h5 className="text-muted mb-3">No hay informes sintéticos pendientes</h5>
                                <p className="text-muted">
                                    No se encontraron informes para completar en este momento.
                                </p>
                            </div>
                        )
                    )}
                </CCardBody>
            </CCard>
        </Container>
    );
}