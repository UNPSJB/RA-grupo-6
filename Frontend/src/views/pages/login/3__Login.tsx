import React, { useState } from 'react';
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
      setError('Usuario o contraseña incorrectos. Por favor, intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const FormContent = (
    <CForm onSubmit={handleSubmit}>
      <h2>Bienvenido</h2>
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
    backgroundImage: 'linear-gradient(180deg, #ffffffaa 0%, rgba(130, 182, 255, 0.46)100%)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
  const background_card = {
    backgroundImage: 'linear-gradient(130deg, #60b3ea9f 4%, #80b3edbd 20%, #1a5a84f0 80%)',
    
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center" style={background}>
      <CContainer>
        <CRow className="justify-content-center mt-4">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4 mb-0 ">
                <CCardBody  className="border-0 py-5">
                  {FormContent}
                </CCardBody>
              </CCard>

              <CCard className="border-0 text-white py-5" style={{...background_card}}>
                <CCardBody className="text-center d-flex flex-column justify-content-center">
                  <div>
                    <img
                      src="/Unipat.png" 
                      alt="Logo UNPSJB"
                      style={{
                        maxWidth: 100,
                        height: "auto",
                        marginBottom: '1rem'
                      }}
                    />
                    <h2 className="fw-light">Sistema de Reportes Académicos</h2>
                    <p className='mb-0'>
                      Universidad Nacional de la Patagonia
                    </p>
                    <p >
                     San Juan Bosco
                    </p>
                    <Link to="/register">
                      <CButton className="mt-3 outline-light text-white" active tabIndex={-1}>
                        Registrarse Ahora
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
}