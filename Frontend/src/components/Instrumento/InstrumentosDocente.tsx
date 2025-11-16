import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    CContainer, 
    CCard, 
    CButton, 
    CListGroup, 
    CListGroupItem, 
    CBadge, 
    CSpinner, 
    CAlert,
    CCardBody,
    CCardHeader
} from '@coreui/react';
import {capitalizarCadena} from "../Funciones";

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
    const navigate = useNavigate();

    useEffect(() => {
        const cargarInstrumentosDocente = async () => {
            try {
                console.log('Cargando informes de cátedra...');
                
                const url = `http://127.0.0.1:8000/instrumentos/INFORME_CATEDRA?usuario_id=${5}&mostrar_respondidos=false`;
                console.log('URL:', url);
                
                const response = await fetch(url);
                console.log('Response status:', response.status, response.statusText);
                
                if (response.ok) {
                    const instrumentosData: InstrumentoDocente[] = await response.json();
                    console.log('Datos recibidos:', instrumentosData);
                    
                    const hoy = new Date('2025-10-20')
                    const instrumentosActivos = instrumentosData.filter(instr => 
                        new Date(instr.fecha_inicio) <= new Date(hoy) && 
                        new Date(instr.fecha_cierre) >= new Date(hoy)
                    );
                    
                    console.log('Instrumentos activos:', instrumentosActivos);
                    setInstrumentos(instrumentosActivos);
                } else {
                    const errorText = await response.text();
                    console.error('Error del servidor:', errorText);
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                
                setCargando(false);
                
            } catch (error) {
                console.error('Error completo:', error);
                setMensaje(`Error al cargar los informes de cátedra: ${error.message}`);
                setCargando(false);
                
                const datosEjemplo: InstrumentoDocente[] = [
                    {
                        id: 201,
                        tipo: 'INFORME_CATEDRA',
                        fecha_inicio: '2024-01-01',
                        fecha_cierre: '2024-12-31',
                        materia: { id: 'FIS1', nombre: 'Física I' },
                        plantilla_formulario: { id: 3, titulo: 'Informe de Cátedra - Física I - 2024' },
                        plantilla_formulario_id: 3,
                        materia_id: 'FIS1'
                    },
                    {
                        id: 202,
                        tipo: 'INFORME_CATEDRA',
                        fecha_inicio: '2024-01-01', 
                        fecha_cierre: '2024-12-31',
                        materia: { id: 'MAT1', nombre: 'Matemática I' },
                        plantilla_formulario: { id: 4, titulo: 'Informe de Cátedra - Matemática I - 2024' },
                        plantilla_formulario_id: 4,
                        materia_id: 'MAT1'
                    }
                ];
                setInstrumentos(datosEjemplo);
                console.log('Usando datos de ejemplo para desarrollo');
            }
        };

        cargarInstrumentosDocente();
    }, []);

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
        const hoy = new Date('2025-10-20')
        return new Date(instrumento.fecha_inicio) <= new Date(hoy) && 
               new Date(instrumento.fecha_cierre) >= new Date(hoy);
    };

    if (cargando) {
        return (
            <CContainer className="mt-4">
                <CCard className="text-center">
                    <CCardBody className="p-5">
                        <CSpinner color="primary" className="mb-3" />
                        <p className="text-medium-emphasis">Cargando informes de cátedra disponibles...</p>
                    </CCardBody>
                </CCard>
            </CContainer>
        );
    }

    return (
            <CCard>
                <CCardHeader>
                    <div className="m-2">
                        <h4 >Informes de Cátedra Pendientes</h4>
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
                        <CListGroup flush>
                            {instrumentos.map((instrumento) => {
                                const activo = estaActivo(instrumento);
                                return (
                                    <CListGroupItem 
                                        key={instrumento.id} 
                                        as="button"
                                        action 
                                        onClick={() => activo && handleSeleccionarInstrumento(instrumento)}
                                        className="d-flex justify-content-between align-items-center p-3"
                                        disabled={!activo}
                                    >
                                        <div className="flex-grow-1 text-start">
                                            <div className="fw-bold fs-5 mb-1">
                                                {capitalizarCadena(instrumento.materia.nombre)}
                                            </div>
                                            <div className="d-flex align-items-center gap-3">
                                                <small className="text-medium-emphasis">
                                                    Código: {instrumento.materia.id}
                                                </small>
                                                {activo ? (
                                                    <>
                                                        <CBadge color="success" className="ms-2">
                                                           Informe Activo
                                                        </CBadge>
                                                        <small className="text-medium-emphasis">
                                                            Vence: {new Date(instrumento.fecha_cierre).toLocaleDateString()}
                                                        </small>
                                                    </>
                                                ) : (
                                                    <CBadge color="secondary" className="ms-2">
                                                        Inactivo
                                                    </CBadge>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {activo ? (
                                            <CButton 
                                                color="primary"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSeleccionarInstrumento(instrumento);
                                                }}
                                            >
                                                <i className="fas fa-edit me-2"></i>
                                                Completar
                                            </CButton>
                                        ) : (
                                            <CButton 
                                                color="secondary"
                                                variant="outline"
                                                disabled
                                            >
                                                No Disponible
                                            </CButton>
                                        )}
                                    </CListGroupItem>
                                );
                            })}
                        </CListGroup>
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
            </CCard>
    );
}

export default InstrumentosDocente;