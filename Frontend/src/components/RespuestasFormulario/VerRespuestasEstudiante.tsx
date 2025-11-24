import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@coreui/react';
import { capitalizarCadena } from '../Funciones';
import ShadowedCard from '../coreui-components/ShadowedCard';

interface InstrumentoRespondido {
    id: number;
    fecha_envio: string;
    instrumento_id: number;
    materia: { id: string; nombre: string };
    plantilla_formulario?: { id: number; titulo: string };
    respondido: boolean;
    respuestas_formulario_id?: number;
}

export default function VerRespuestasEstudiante() {
    const navigate = useNavigate();
    const [instrumentos, setInstrumentos] = useState<InstrumentoRespondido[]>([]);
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        const fetchInstrumentos = async () => {
            try {
                setCargando(true);
                setMensaje('');

                const userId = 5; // IMPORTANTE: adaptar al sistema de usuarios
                
                const res = await fetch(
                    `http://127.0.0.1:8000/instrumentos/tipo/ENCUESTA_ESTUDIANTE?usuario_id=${userId}&mostrar_respondidos=true`
                );
                if (!res.ok) throw new Error('No se pudieron cargar las encuestas respondidas');

                const data = await res.json();
                setInstrumentos(data);
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : 'Error desconocido';
                setMensaje(msg);
            } finally {
                setCargando(false);
            }
        };

        fetchInstrumentos();
    }, []);

    const handleVerRespuestas = (instrumento: InstrumentoRespondido) => {
        navigate(`/ver-respuestas/${instrumento.respuestas_formulario_id || instrumento.id}`, {
            state: {
                materiaNombre: instrumento.materia.nombre,
                fechaEnvio: instrumento.fecha_envio,
                instrumentoId: instrumento.instrumento_id || instrumento.id,
                plantillaFormularioId: instrumento.plantilla_formulario?.id,
                tipoInstrumento: 'ENCUESTA_ESTUDIANTE'
            }
        });
    };

    if (cargando) {
        return (
            <ShadowedCard className="text-center">
                <CCardBody className="p-5">
                    <CSpinner color="primary" className="mb-3" />
                    <p className="text-medium-emphasis">Cargando encuestas respondidas...</p>
                </CCardBody>
            </ShadowedCard>
        );
    }

    return (
        <ShadowedCard>
            <CCardHeader>
                <div className="m-2">
                    <h4>Encuestas Respondidas</h4>
                    <p className="text-medium-emphasis mb-0">
                        Selecciona una encuesta para ver tus respuestas
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
                                <CTableHeaderCell>Fecha de Envío</CTableHeaderCell>
                                <CTableHeaderCell className="text-center">Acción</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {instrumentos.map((instrumento) => (
                                <CTableRow 
                                    key={instrumento.id}
                                    onClick={() => handleVerRespuestas(instrumento)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <CTableDataCell>
                                        <div className="fw-bold">{capitalizarCadena(instrumento.materia.nombre)}</div>
                                        <div className="small text-medium-emphasis">Código: {instrumento.materia.id}</div>
                                    </CTableDataCell>
                                    <CTableDataCell className="text-center">
                                        {instrumento.plantilla_formulario && (
                                            <CBadge color="success">
                                                Respondido
                                            </CBadge>
                                        )}
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        {new Date(instrumento.fecha_envio).toLocaleDateString()}
                                    </CTableDataCell>
                                    <CTableDataCell className="text-center">
                                        <CButton
                                            color="primary"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleVerRespuestas(instrumento);
                                            }}
                                        >
                                            <i className="fas fa-eye me-2"></i>
                                            Ver Respuestas
                                        </CButton>
                                    </CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                ) : (
                    <div className="text-center py-5">
                        <i className="fas fa-inbox fa-3x text-medium-emphasis mb-3"></i>
                        <h5 className="text-medium-emphasis mb-3">No hay encuestas respondidas</h5>
                        <p className="text-medium-emphasis">
                            Aún no has respondido ninguna encuesta.
                        </p>
                    </div>
                )}
            </CCardBody>
        </ShadowedCard>
    );
}