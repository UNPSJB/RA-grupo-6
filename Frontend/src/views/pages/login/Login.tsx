import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
  CAlert,
  CModal, 
  CModalBody,
  CImage,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser, cilLowVision } from '@coreui/icons';
import { useAuth } from '../../../context/AuthContext'; 

interface LoginProps {
  showModal?: boolean; 
  onClose?: () => void;
}

export default function Login({ showModal = false, onClose }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, user, loading } = useAuth(); 
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const originalTheme = document.documentElement.dataset.coreuiTheme;
    // Forzar tema claro en la página de login
    document.documentElement.dataset.coreuiTheme = 'light';

    // Restaurar el tema original al desmontar el componente
    return () => {
      if (originalTheme) {
        document.documentElement.dataset.coreuiTheme = originalTheme;
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <CSpinner color="primary" />
        <p className="ms-2 text-primary">Cargando datos de usuario...</p>
      </div>
    );
  }

  if (!showModal && user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(username, password);
      
      if (showModal) onClose?.();
      
    } catch (err: any) {
      console.error("Error en el login:", err);
      setError('Usuario o contraseña incorrectos. ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const FormContent = (
    <CForm onSubmit={handleSubmit}>
      <h3 className='text-dark text-center'>Bienvenido</h3>
      <p className="text-body-secondary text-center">Inicie sesión para continuar</p>

      {/* Campo de Usuario */}
      <CInputGroup className="mb-3">
        <CInputGroupText>
          <CIcon icon={cilUser} />
        </CInputGroupText>
        <CFormInput
          placeholder="Usuario"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </CInputGroup>

      {/* Campo de Contraseña */}
      <CInputGroup className="mb-4">
        <CInputGroupText>
          <CIcon icon={cilLockLocked} />
        </CInputGroupText>
        <CFormInput
          type={showPassword ? "text" : "password"}
          placeholder="Contraseña"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isSubmitting}
        />
        <CInputGroupText 
          style={{ cursor: 'pointer' }}
          onClick={() => setShowPassword(!showPassword)}
          title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          <CIcon icon={cilLowVision} style={{ opacity: showPassword ? 0.5 : 1 }} />
        </CInputGroupText>
      </CInputGroup>

      {error && (
        <CAlert color="danger" className="py-2 text-center">
          <small>{error}</small>
        </CAlert>
      )}

      <CRow>
        <CCol xs={6}>
          <CButton
            color="primary"
            type="submit"
            className="px-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <CSpinner size="sm"  aria-hidden="true" className="me-2" />
                Cargando
              </>
            ) : (
              'Ingresar'
            )}
          </CButton>
        </CCol>
        <CCol xs={6} className="text-end">
           <CButton color="link" className="px-0" disabled={isSubmitting} style={{ whiteSpace: 'nowrap' }}>
             ¿Olvidó su contraseña?
           </CButton>
        </CCol>
      </CRow>
    </CForm>
  );

  if (showModal) {
    return (
      <CModal visible onHide={onClose} centered>
        <CModalBody className="p-0">
          <CCard className="shadow-lg border-0 rounded-4"> 
            <CCardBody className="px-5 py-4 d-flex align-items-center justify-content-center">
              <CRow className="w-100 justify-content-center">
                <CCol xs={12} lg={10}>
                   <div className="text-center mb-4">
                      <h2 className="fw-bold text-primary mb-2">Bienvenido</h2>
                      <p className="text-medium-emphasis mb-0">Inicie sesión para continuar</p>
                   </div>
                   {FormContent}
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CModalBody>
      </CModal>
    );
  }

  const background = {
    background: 'linear-gradient(135deg, #a8d8ea 0%, #d4e9f7 100%)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-column align-items-center justify-content-center" style={background}>
      <CContainer>
        {/* Logo y título en el fondo */}
        <CRow className="justify-content-center mb-4">
          <CCol xs="auto" className="text-center">
            <CImage
              src="/Unipat.png"
              alt="Logo UNPSJB"
              style={{
                maxWidth: 120,
                height: "auto",
                marginBottom: '1rem',
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))'
              }}
            />
            <h4 className="fw-bold text-primary mb-2">Sistema de Reportes Académicos</h4>
            <p className="text-muted mb-0">
              Universidad Nacional de la Patagonia San Juan Bosco
            </p>
          </CCol>
        </CRow>

        {/* Card de login centrada */}
        <CRow className="justify-content-center">
          <CCol md={8} lg={6} xl={5}>
            <CCard className="shadow-lg">
              <CCardBody className="p-4 p-md-5">
                {FormContent}
                
                {/* Link de registro */}
                <div className="text-center mt-4">
                  <p className="text-muted mb-2">¿No tienes cuenta?</p>
                  <Link to="/register">
                    <CButton color="primary" variant="outline" className="w-100">
                      Registrarse
                    </CButton>
                  </Link>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
}