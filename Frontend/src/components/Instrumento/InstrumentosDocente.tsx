import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CButton, CBadge, CSpinner, CAlert, CCardBody, CCardHeader, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react';
import { capitalizarCadena } from "../Funciones";
import ShadowedCard from '../coreui-components/ShadowedCard';
import type { Usuario } from '../types';

interface InstrumentoDocente {
    id: number;
    tipo: 'INFORME_CATEDRA';
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

function InstrumentosDocente() {
    const [instrumentos, setInstrumentos] = useState<InstrumentoDocente[]>([]);
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState('');
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("http://localhost:8000/users/me", {
                    credentials: 'include'
                });
                if (!response.ok) throw new Error("No se pudo autenticar al usuario");
                const data = await response.json();
                setUsuario(data);
            } catch (error) {
                console.error(error);
                setMensaje("Error: No se pudo identificar al usuario.");
                setCargando(false);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (!usuario) return;

        const cargarInstrumentosDocente = async () => {
            try {
                setCargando(true);
                setMensaje('');

                const url = `http://127.0.0.1:8000/instrumentos/ObtenerDatosInstrumentosNoRespondidos/INFORME_CATEDRA?usuario_id=${usuario.id}&mostrar_respondidos=false`;
                console.log('URL:', url);

                const response = await fetch(url, { credentials: 'include' });
                console.log('Response status:', response.status, response.statusText);

                if (response.ok) {
                    const instrumentosData: InstrumentoDocente[] = await response.json();
                    console.log('Datos recibidos:', instrumentosData);

                    const hoy = new Date();
                    const instrumentosActivos = instrumentosData.filter(instr =>
                        new Date(instr.fecha_inicio) <= hoy &&
                        new Date(instr.fecha_cierre) >= hoy
                    );

                    console.log('Instrumentos activos:', instrumentosActivos);
                    setInstrumentos(instrumentosActivos);
                } else {
                    const errorText = await response.text();
                    console.error('Error del servidor:', errorText);
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

            } catch (error) {
                console.error('Error completo:', error);
                setMensaje(`Error al cargar los informes de cátedra: ${error}`);
            } finally {
                setCargando(false);
            }
        };

        cargarInstrumentosDocente();
    }, [usuario]);

    const handleSeleccionarInstrumento = (instrumento: InstrumentoDocente) => {
        console.log('Instrumento seleccionado:', instrumento);
        navigate(`/responder-instrumento/${instrumento.id}`, {
            state: {
                materiaNombre: instrumento.materia.nombre,
                materiaId: instrumento.materia.id,
                rol: 'docente'
            }
        });
    };

    const estaActivo = (instrumento: InstrumentoDocente) => {
        const hoy = new Date();
        return new Date(instrumento.fecha_inicio) <= hoy &&
            new Date(instrumento.fecha_cierre) >= hoy;
    };

    if (cargando) {
        return (
            <ShadowedCard className="text-center">
                <CCardBody className="p-5">
                    <CSpinner color="primary" className="mb-3" />
                    <p className="text-medium-emphasis">Cargando informes de cátedra disponibles...</p>
                </CCardBody>
            </ShadowedCard>
        );
    }

    return (
        <ShadowedCard>
            <CCardHeader>
                <div className="m-2">
                    <h4>Informes de Cátedra Pendientes</h4>
                    <p className="text-medium-emphasis">
                        Selecciona un informe de cátedra para completar.
                    </p>
                </div>
            </CCardHeader>
            <CCardBody>
                {mensaje && (
                    <CAlert color={mensaje.includes('Error') ? 'warning' : 'info'} className="mb-4">
                        {mensaje}
                    </CAlert>
                )}

                {instrumentos.length > 0 ? (
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
                            {instrumentos.map((instrumento) => {
                                const activo = estaActivo(instrumento);
                                return (
                                    <CTableRow
                                        key={instrumento.id}
                                        onClick={() => activo && handleSeleccionarInstrumento(instrumento)}
                                        style={{ cursor: activo ? 'pointer' : 'not-allowed' }}
                                    >
                                        <CTableDataCell>
                                            <div className="fw-bold">{capitalizarCadena(instrumento.materia.nombre)}</div>
                                            <div className="small text-medium-emphasis">Código: {instrumento.materia.id}</div>
                                        </CTableDataCell>
                                        <CTableDataCell className="text-center">
                                            <CBadge color={activo ? "success" : "secondary"}>
                                                {activo ? "Activo" : "Inactivo"}
                                            </CBadge>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            {activo ? new Date(instrumento.fecha_cierre).toLocaleDateString() : '-'}
                                        </CTableDataCell>
                                        <CTableDataCell className="text-center">
                                            <CButton
                                                color="primary"
                                                size="sm"
                                                disabled={!activo}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSeleccionarInstrumento(instrumento);
                                                }}
                                            >
                                                Completar
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
                        <h5 className="text-medium-emphasis mb-3">No hay informes de cátedra pendientes</h5>
                        <p className="text-medium-emphasis">
                            No se encontraron informes de cátedra pendientes para completar.
                        </p>
                    </div>
                )}
            </CCardBody>
        </ShadowedCard>
    );
}

export default InstrumentosDocente;