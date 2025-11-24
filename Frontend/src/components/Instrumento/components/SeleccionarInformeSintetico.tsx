import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    CButton, 
    CBadge, 
    CSpinner, 
    CAlert,
    CCardBody,
    CCardHeader,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell
} from "@coreui/react";
import { capitalizarCadena } from "../../Funciones";
import ShadowedCard from '../../coreui-components/ShadowedCard';

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
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        cargarInformesSinteticos();
    }, []);

    const cargarInformesSinteticos = async () => {
        try {
            setCargando(true);
            console.log('Cargando informes sintéticos...');

            const usuarioActual = JSON.parse(localStorage.getItem('usuario_actual') || '{}');
            const usuarioId = usuarioActual.id || 3; 

            const url = `http://127.0.0.1:8000/instrumentos/INFORME_SINTETICO?usuario_id=${usuarioId}&mostrar_respondidos=false`;
            console.log('URL:', url);
            
            const response = await fetch(url);
            console.log('Response status:', response.status, response.statusText);
            
            if (response.ok) {
                const informesData: InstrumentoDepartamento[] = await response.json();
                console.log('Datos recibidos:', informesData);
                
                const hoy = new Date();
                const informesActivos = informesData.filter(instr => 
                    new Date(instr.fecha_inicio) <= hoy && 
                    new Date(instr.fecha_cierre) >= hoy
                );
                
                console.log('Informes activos:', informesActivos);
                setInformes(informesActivos);
            } else {
                const errorText = await response.text();
                console.error('Error del servidor:', errorText);
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            setCargando(false);
            
        } catch (error) {
            console.error('Error completo:', error);
            setMensaje(`Error al cargar los informes sintéticos: ${error}`);
            setCargando(false);
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

    if (cargando) {
        return (
            <ShadowedCard className="text-center">
                <CCardBody className="p-5">
                    <CSpinner color="primary" className="mb-3" />
                    <p className="text-medium-emphasis">Cargando informes sintéticos disponibles...</p>
                </CCardBody>
            </ShadowedCard>
        );
    }

    return (
        <ShadowedCard>
            <CCardHeader>
                <div className="m-2">
                    <h4>Informes Sintéticos Pendientes</h4>
                    <p className="text-medium-emphasis">
                        Selecciona un informe sintético para completar.
                    </p>
                </div>
            </CCardHeader>
            <CCardBody>
                {mensaje && (
                    <CAlert color={mensaje.includes('Error') ? 'warning' : 'info'} className="mb-4">
                        {mensaje}
                    </CAlert>
                )}
                
                {informes.length > 0 ? (
                    <CTable className='border mb-1' hover responsive>
                        <CTableHead>
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
                                    <CTableRow 
                                        key={informe.id} 
                                        onClick={() => activo && handleSeleccionarInforme(informe)} 
                                        style={{ cursor: activo ? 'pointer' : 'not-allowed' }}
                                    >
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
                                                Completar Informe
                                            </CButton>
                                        </CTableDataCell>
                                    </CTableRow>
                                );
                            })}
                        </CTableBody>
                    </CTable>
                ) : (
                    <div className="text-center py-5">
                        <i className="fas fa-inbox fa-3x text-medium-emphasis mb-3"></i>
                        <h5 className="text-medium-emphasis mb-3">No hay informes sintéticos pendientes</h5>
                        <p className="text-medium-emphasis">
                            No se encontraron informes sintéticos para completar en este momento.
                        </p>
                    </div>
                )}
            </CCardBody>
        </ShadowedCard>
    );
}