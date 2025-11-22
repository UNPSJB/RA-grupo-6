import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
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
import { cilLockLocked, cilUser } from '@coreui/icons';
import { useAuth } from '../../../context/AuthContext'; 

interface LoginProps {
  showModal?: boolean; 
  onClose?: () => void;
}

export default function Login({ showModal = false, onClose }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
      <h3 className='text-dark'>Bienvenido</h3>
      <p className="text-body-secondary">Inicie sesión para continuar</p>

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
          type="password"
          placeholder="Contraseña"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isSubmitting}
        />
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
           <CButton color="link" className="px-0" disabled={isSubmitting}>
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
    // Un fondo más moderno con un degradado sutil y un patrón SVG
    backgroundImage: `
      radial-gradient(circle at 1% 1%, rgba(220, 230, 255, 1), rgba(150, 169, 244, 0.05) 25%),
      radial-gradient(circle at 99% 50%, rgba(144, 167, 202, 0.94), rgba(255, 255, 255, 0) 35%),
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='80' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23a1c4fd' fill-opacity='0.1'%3E%3Cpath opacity='.4' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v--9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v--9h-9v9h9zm-9-10h9v-9h-9v9sm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0h1v5h9V0h1v5h9V0h1v5h9V0h1v5h9V0h1v5h9V0h1v5h9V0h1v5h9V0h1v5h9V0h1v5h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4H0v-1h5v-9H0v-1h5v-9H0v-1h5v-9H0v-1h5v-9H0v-1h5v-9H0v-1h5v-9H0v-1h5v-9H0v-1h5V0h1v5h9V0h1v5h9V0h1v5h9V0h1v5h9V0h1v5h9V0h1v5h9V0h1v5h9V0h1v5h9V0h1v5z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
    `,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
  const background_card = {
    backgroundImage: 'linear-gradient(130deg, #2c7aae99 5%, #5e84b0c1 40%, #023151be 95%)',
    
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center" style={background}>
      <CContainer>
        <CRow className="justify-content-center mt-4">
          <CCol lg={8}>
            <CCard className="mb-0 shadow">
              <CRow className="g-0">
                <CCol md={6}>
                  <CCardBody className="p-4 p-md-5">
                    {FormContent}
                  </CCardBody>
                </CCol>
                <CCol md={6} style={{ ...background_card, borderTopRightRadius: '0.375rem', borderBottomRightRadius: '0.375rem' }}>
                  <CCardBody className="text-center d-flex flex-column justify-content-center h-100 p-4">
                    <div className='mt-2 text-light'>
                      <CImage
                        src="/Unipat.png"
                        alt="Logo UNPSJB"
                        style={{
                          maxWidth: 80,
                          height: "auto",
                          marginBottom: '1rem'
                        }}
                      />
                      <h5 className="fw-light">Sistema de Reportes Académicos</h5>
                      <p className='mb-0'>
                        Universidad Nacional de la Patagonia San Juan Bosco
                      </p>
                      
                      <Link to="/register">
                        <CButton className="mt-4 mb-4 outline-light text-white" active tabIndex={-1}>
                          Registrarse 
                        </CButton>
                      </Link>
                    </div>
                  </CCardBody>
                </CCol>
              </CRow>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
}