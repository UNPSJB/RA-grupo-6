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

    const estaActiva = (materia: Materia) => {
        return materia.tieneEncuestaActiva === true;
    };

    if (cargando) {
        return (
            <ShadowedCard className="text-center">
                <CCardBody className="p-5">
                    <CSpinner color="primary" className="mb-3" />
                    <p className="text-medium-emphasis">Cargando materias con encuestas activas...</p>
                </CCardBody>
            </ShadowedCard>
        );
    }

    return (
        <ShadowedCard>
            <CCardHeader>
                <div className="m-2">
                    <h4>Encuestas para Alumnos</h4>
                    <p className="text-medium-emphasis">
                        Selecciona una materia para responder la encuesta correspondiente.
                    </p>
                </div>
            </CCardHeader>
            <CCardBody>
                {mensaje && (
                    <CAlert color={mensaje.includes('Error') ? 'warning' : 'info'} className="mb-4">
                        {mensaje}
                    </CAlert>
                )}
                
                {materias.length > 0 ? (
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
                            {materias.map((materia) => {
                                const activa = estaActiva(materia);
                                return (
                                    <CTableRow 
                                        key={materia.id} 
                                        onClick={() => activa && handleResponderEncuesta(materia)} 
                                        style={{ cursor: activa ? 'pointer' : 'not-allowed' }}
                                    >
                                        <CTableDataCell>
                                            <div className="fw-bold">{capitalizarCadena(materia.nombre)}</div>
                                            <div className="small text-medium-emphasis">Código: {materia.id}</div>
                                        </CTableDataCell>
                                        <CTableDataCell className="text-center">
                                            <CBadge color={activa ? "success" : "secondary"}>
                                                {activa ? "Activo" : "Inactivo"}
                                            </CBadge>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            {activa ? new Date(materia.fechaCierre!).toLocaleDateString() : '-'}
                                        </CTableDataCell>
                                        <CTableDataCell className="text-center">
                                            <CButton
                                                color="primary"
                                                size="sm"
                                                disabled={!activa}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleResponderEncuesta(materia);
                                                }}
                                            >
                                                <i className="fas fa-edit me-2"></i>
                                                Responder Encuesta
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