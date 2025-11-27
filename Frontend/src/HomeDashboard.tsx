import { useEffect, useState } from 'react';
import { CCardBody, CRow, CCol } from '@coreui/react';
import ShadowedCard from './components/coreui-components/ShadowedCard';
import { Spinner, Alert } from 'react-bootstrap';
import { useAuth } from './context/AuthContext';

interface HomeStats {
    nombre_completo: string;
    rol: string;
    
    materias_inscriptas?: number;
    encuestas_pendientes?: number;
    encuestas_completadas?: number;

    materias_dictadas?: number;
    informes_pendientes?: number;
    informes_completados?: number;

    materias_departamento?: number;
    docentes_departamento?: number;
    informes_sinteticos?: number;

    total_estudiantes?: number;
    total_docentes?: number;
    total_carreras?: number;
}

interface DashboardCardData {
    titulo: string;
    valor: number;
    icon: string;
    color: string; 
}

export default function HomeDashboard() {
    const [estadisticas, setEstadisticas] = useState<HomeStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    
    const { user } = useAuth(); 

    useEffect(() => {
        const cargarDatos = async () => {
            
            if (!user) {
                return;
            }
            setLoading(true);
            setError("");

            try {
                const estadisticasResponse = await fetch(`http://127.0.0.1:8000/home/?usuario_id=${user.id}`, {
                    method: "GET",
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (estadisticasResponse.ok) {
                    const data = await estadisticasResponse.json();
                    setEstadisticas(data);
                } else {
                    throw new Error(`Error al cargar estadísticas: ${estadisticasResponse.statusText}`);
                }

            } catch (err) {
                setError(err instanceof Error ? err.message : "Error desconocido de conexión");
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, [user]);

    const getCardsForRole = (data: HomeStats): DashboardCardData[] => {
        const cards: DashboardCardData[] = [];
        const rol = data.rol.toLowerCase();

        if (rol.includes('estudiante') || rol.includes('alumno')) {
            cards.push({
                titulo: 'Materias Inscriptas',
                valor: data.materias_inscriptas || 0,
                icon: 'fa-book',
                color: 'primary'
            });
            cards.push({
                titulo: 'Encuestas Pendientes',
                valor: data.encuestas_pendientes || 0,
                icon: 'fa-clock',
                color: 'warning'
            });
            cards.push({
                titulo: 'Encuestas Completadas',
                valor: data.encuestas_completadas || 0,
                icon: 'fa-check-circle',
                color: 'success'
            });
        } else if (rol.includes('docente') || rol.includes('profesor')) {
            cards.push({
                titulo: 'Materias a Cargo',
                valor: data.materias_dictadas || 0,
                icon: 'fa-chalkboard-teacher',
                color: 'primary'
            });
            cards.push({
                titulo: 'Informes Pendientes',
                valor: data.informes_pendientes || 0,
                icon: 'fa-file-signature',
                color: 'warning'
            });
            cards.push({
                titulo: 'Informes Entregados',
                valor: data.informes_completados || 0,
                icon: 'fa-paper-plane',
                color: 'success'
            });
        } else if (rol.includes('departamento')) {
            cards.push({
                titulo: 'Total Materias',
                valor: data.materias_departamento || 0,
                icon: 'fa-sitemap',
                color: 'info'
            });
            cards.push({
                titulo: 'Docentes Activos',
                valor: data.docentes_departamento || 0,
                icon: 'fa-users',
                color: 'primary'
            });
            cards.push({
                titulo: 'Informes Históricos',
                valor: data.informes_sinteticos || 0,
                icon: 'fa-file-contract',
                color: 'secondary'
            });
        } else {
            cards.push({
                titulo: 'Estudiantes Activos',
                valor: data.total_estudiantes || 0,
                icon: 'fa-user-graduate',
                color: 'info'
            });
            cards.push({
                titulo: 'Docentes Activos',
                valor: data.total_docentes || 0,
                icon: 'fa-chalkboard-teacher',
                color: 'primary'
            });
            cards.push({
                titulo: 'Carreras',
                valor: data.total_carreras || 0,
                icon: 'fa-university',
                color: 'secondary'
            });
        }

        return cards;
    };

    if (!user) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
                <Spinner animation="border" variant="secondary" />
                <span className="ms-3">Verificando sesión...</span>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
                <Spinner animation="border" variant="primary" />
                <span className="ms-3">Cargando panel...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <Alert variant="danger">
                    <Alert.Heading><i className="fas fa-exclamation-triangle me-2"></i>Error de Carga</Alert.Heading>
                    <p>{error}</p>
                </Alert>
            </div>
        );
    }

    if (!estadisticas) {
        return (
            <div className="p-4">
                <Alert variant="warning">No se encontraron datos para este usuario.</Alert>
            </div>
        );
    }

    const cardsToShow = getCardsForRole(estadisticas);

    return (
        <div className="p-4">
            <ShadowedCard className="mb-4">
                <CCardBody className="p-4">
                    <div className="d-flex align-items-center">
                        <div className="me-3">
                            <div style={{ 
                                width: '60px', 
                                height: '60px', 
                                backgroundColor: '#e7f1ff',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <i className="fas fa-user fa-lg text-primary"></i>
                            </div>
                        </div>
                        <div>
                            <h3 className="mb-1 fw-bold">¡Hola, {estadisticas.nombre_completo}!</h3>
                            <p className="text-muted mb-0">
                                Panel de control de <span className="badge bg-primary">{estadisticas.rol}</span>
                            </p>
                        </div>
                    </div>
                </CCardBody>
            </ShadowedCard>

            <CRow>
                {cardsToShow.map((card, index) => {
                    const colorMap: { [key: string]: string } = {
                        'primary': '#0d6efd',
                        'success': '#198754',
                        'warning': '#ffc107',
                        'danger': '#dc3545',
                        'info': '#0dcaf0',
                        'secondary': '#6c757d'
                    };
                    const borderColor = colorMap[card.color] || '#6c757d';
                    
                    return (
                        <CCol sm={12} md={4} className="mb-3" key={index}>
                            <ShadowedCard>
                                <div style={{ borderLeft: `4px solid ${borderColor}` }}>
                                    <CCardBody className="p-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <div className="text-uppercase text-muted small fw-bold mb-1">
                                                    {card.titulo}
                                                </div>
                                                <div className="fs-2 fw-bold">
                                                    {card.valor}
                                                </div>
                                            </div>
                                            <div>
                                                <i 
                                                    className={`fas ${card.icon}`}
                                                    style={{ 
                                                        fontSize: '32px', 
                                                        color: borderColor,
                                                        opacity: 0.7
                                                    }}
                                                ></i>
                                            </div>
                                        </div>
                                    </CCardBody>
                                </div>
                            </ShadowedCard>
                        </CCol>
                    );
                })}
            </CRow>
        </div>
    );
}