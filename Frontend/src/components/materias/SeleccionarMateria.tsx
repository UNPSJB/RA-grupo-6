import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
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
import { capitalizarCadena } from "../Funciones";
import ShadowedCard from '../coreui-components/ShadowedCard';

interface Materia {
    id: string;
    nombre: string;
    tieneEncuestaActiva?: boolean;
    instrumentoId?: number;
    plantillaFormularioId?: number;
    fechaCierre?: string;
}

const USUARIO_ACTUAL = {
    id: 1,
    nombre: "Alumno",
    apellido: "Demo"
};

function SeleccionarMateria() {
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const cargarMateriasConEncuestas = async () => {
            try {
                // Obtener instrumentos de tipo ENCUESTA_ESTUDIANTE
                const response = await fetch(`http://127.0.0.1:8000/instrumentos/ENCUESTA_ESTUDIANTE?usuario_id=${USUARIO_ACTUAL.id}&mostrar_respondidos=false`);
                
                if (!response.ok) {
                    throw new Error('Error al cargar encuestas');
                }
                
                const instrumentos = await response.json();
                
                // Mapear instrumentos a materias con encuesta activa
                const materiasConEncuesta = instrumentos.map((instrumento: any) => ({
                    id: instrumento.materia.id,
                    nombre: instrumento.materia.nombre,
                    tieneEncuestaActiva: true,
                    instrumentoId: instrumento.id,
                    plantillaFormularioId: instrumento.plantilla_formulario.id,
                    fechaCierre: instrumento.fecha_cierre
                }));
                
                setMaterias(materiasConEncuesta);
                setCargando(false);
                
            } catch (error) {
                console.error('Error:', error);
                setMensaje('Error de conexión al cargar las encuestas activas');
                setCargando(false);
            }
        };

        cargarMateriasConEncuestas();
    }, []);

    const handleResponderEncuesta = (materia: Materia) => {
        if (!materia.instrumentoId) {
            setMensaje('No hay encuesta activa para esta materia');
            return;
        }
        
        // Navegar al instrumento para responder encuesta
        navigate(`/responder-instrumento/${materia.instrumentoId}`, { 
            state: { 
                materiaNombre: materia.nombre,
                materiaId: materia.id,
                rol: 'alumno'
            } 
        });
    };

    if (cargando) {
        return (
            <CCard className="text-center p-5">
                <CCardBody>
                    <CSpinner className="mb-3" />
                    <p className="text-medium-emphasis">Cargando materias con encuestas activas...</p>
                </CCardBody>
            </CCard>
        );
    }

    return (
        <ShadowedCard >
            <CCardHeader>
                <div className="m-2">
                    <h4 >Encuestas para Alumnos</h4>
                    <p className="text-medium-emphasis mb-0">
                        Selecciona una materia para responder la encuesta correspondiente
                    </p>
                </div>
            </CCardHeader>
            <CCardBody className="p-4 p-md-5">
                

                {mensaje && (
                    <CAlert color={mensaje.includes('Error') ? 'warning' : 'info'} className="mb-4">
                        {mensaje}
                    </CAlert>
                )}

                {materias.length > 0 ? (
                    <CListGroup flush>
                        {materias.map((materia) => (
                            <CListGroupItem
                                key={materia.id}
                                onClick={() => materia.tieneEncuestaActiva && handleResponderEncuesta(materia)}
                                className="d-flex justify-content-between align-items-center p-4"
                                disabled={!materia.tieneEncuestaActiva}
                            >
                                <div className="flex-grow-1 text-start">
                                    <div className="fw-bold fs-5 mb-1">{capitalizarCadena(materia.nombre)}</div>
                                    <div className="d-flex align-items-center gap-3">
                                        <small className="text-medium-emphasis">
                                            Código: {materia.id}
                                        </small>
                                        {materia.tieneEncuestaActiva && (
                                            <>
                                                <CBadge color="success" className="ms-2">
                                                    Encuesta Activa
                                                </CBadge>
                                                <small className="text-medium-emphasis">
                                                    Vence: {new Date(materia.fechaCierre!).toLocaleDateString()}
                                                </small>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {materia.tieneEncuestaActiva ? (
                                    <CButton
                                        color="primary"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleResponderEncuesta(materia);
                                        }}
                                        className="px-4 py-2"
                                    >
                                        <i className="fas fa-edit me-2"></i>
                                        Responder Encuesta
                                    </CButton>
                                ) : (
                                    <CButton
                                        variant="outline"
                                        color="secondary"
                                        size="sm"
                                        disabled
                                    >
                                        Sin Encuesta
                                    </CButton>
                                )}
                            </CListGroupItem>
                        ))}
                    </CListGroup>
                ) : (
                    <div className="text-center py-5">
                        <i className="fas fa-inbox fa-3x text-medium-emphasis mb-3"></i>
                        <h5 className="text-medium-emphasis mb-3">No hay encuestas disponibles</h5>
                        <p className="text-medium-emphasis">
                            No se encontraron encuestas pendientes para tus materias cursadas.
                        </p>
                    </div>
                )}
            </CCardBody>
        </ShadowedCard>
    );
}

export default SeleccionarMateria;