import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col } from 'react-bootstrap';
import type { Usuario } from './types';

type Rol = 'alumno' | 'docente' | 'departamento' | 'secretaria';

const ROLES = {
  alumno: {
    titulo: 'Alumno',
    descripcion: 'Responder encuestas de las materias que cursás',
    icono: 'fas fa-user-graduate',
    color: 'primary',
    ruta: '/materias'
  },
  docente: {
    titulo: 'Docente', 
    descripcion: 'Gestionar informes de cátedra y visualizar estadísticas de materias',
    icono: 'fas fa-chalkboard-teacher',
    color: 'success',
    ruta: '/instrumentos-docente'
  },
  departamento: {
    titulo: 'Departamento',
    descripcion: 'Gestionar informes sintéticos y estadísticas del departamento',
    icono: 'fas fa-building',
    color: 'warning',
    ruta: '/departamento'
  },
  secretaria: {
    titulo: 'Secretaría Académica',
    descripcion: 'Administrar el sistema y generar reportes',
    icono: 'fas fa-university',
    color: 'info',
    ruta: '/secretaria'
  }
};

const USUARIOS_ROLES: Record<'alumno' | 'docente', Usuario> = {
    alumno: { 
        id: 1, 
        nombre: 'Pepe', 
        apellido: 'Flores', 
        legajo: 21, 
        email: 'example@gmail.com', 
        rol: 'alumno', 
        respuestas_formulario: []  
    },
    docente: { 
        id: 2, 
        nombre: 'Leo', 
        apellido: 'Sidocente', 
        legajo: 122133, 
        email: 'docente.demo@unpsjb.edu', 
        rol: 'docente', 
        respuestas_formulario: []  
    }
};

export default function SeleccionarRol() {
    const navigate = useNavigate();
    const [rolSeleccionado, setRolSeleccionado] = useState<Rol | null>(null);
    const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);
    
    useEffect(() => {
        const rolString = localStorage.getItem('rol_actual');
        const rol = (rolString && ['alumno','docente','departamento','secretaria'].includes(rolString) ? rolString as Rol : null);

        const usuarioGuardado = localStorage.getItem('usuario_actual');

        if (usuarioGuardado) {
            setUsuarioActual(JSON.parse(usuarioGuardado) as Usuario);
        } else if (rol && (rol === 'alumno' || rol === 'docente')) {
            const usuario = USUARIOS_ROLES[rol];
            if (usuario) {
                setUsuarioActual(usuario);
                localStorage.setItem('usuario_actual', JSON.stringify(usuario));
            }
        }

        if (rol) setRolSeleccionado(rol);
    }, []);

    const handleSeleccionarRol = (rol: Rol) => {
        setRolSeleccionado(rol);

        if (rol === 'alumno' || rol === 'docente') {
            const usuario = USUARIOS_ROLES[rol];
            if (usuario) {
                setUsuarioActual(usuario);
                localStorage.setItem('usuario_actual', JSON.stringify(usuario));
            }
        }

        localStorage.setItem('rol_actual', rol);

        setTimeout(() => {
            navigate(ROLES[rol].ruta);
        }, 300);
    };

    return (
        <Container className="mt-4">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <Card className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
                        <Card.Body className="p-4 p-md-5 text-center">
                            <div className="mb-5">
                                <h1 className="fw-bold mb-3">Sistema de Encuestas e Informes</h1>
                                <p className="text-muted">
                                    Selecciona tu rol para acceder
                                </p>
                            </div>
                            
                            <Row className="g-4">
                                {(Object.entries(ROLES) as [Rol, typeof ROLES[Rol]][]).map(([rolKey, rolInfo]) => (
                                    <Col md={6} key={rolKey}>
                                        <Card 
                                            className={`border-0 shadow-sm h-100 cursor-pointer ${rolSeleccionado === rolKey ? 'border-primary' : ''}`}
                                            style={{ 
                                                cursor: 'pointer',
                                                border: rolSeleccionado === rolKey ? '2px solid #0d6efd' : '1px solid #dee2e6',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onClick={() => handleSeleccionarRol(rolKey)}
                                        >
                                            <Card.Body className="p-4 text-center">
                                                <div className="mb-3">
                                                    <i className={`${rolInfo.icono} fa-3x text-${rolInfo.color}`}></i>
                                                </div>
                                                <h4 className="fw-bold mb-3">{rolInfo.titulo}</h4>
                                                <p className="text-muted mb-0">
                                                    {rolInfo.descripcion}
                                                </p>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                            
                            <div className="mt-5 pt-4 border-top">
                                <p className="text-muted small">
                                    <i className="fas fa-info-circle me-2"></i>
                                    Selecciona tu rol para continuar
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </Container>
    );
}
