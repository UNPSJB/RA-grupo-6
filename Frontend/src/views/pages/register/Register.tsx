import  { useState } from 'react'
import { Link } from 'react-router-dom'
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
  CImage,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilLowVision } from '@coreui/icons'

const background = {
  background: 'linear-gradient(135deg, #a8d8ea 0%, #d4e9f7 100%)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
};

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  // Estilos para forzar modo claro en los inputs
  const inputStyle = {
    backgroundColor: '#ffffff',
    color: '#212529',
    borderColor: '#dee2e6'
  };

  const inputGroupTextStyle = {
    backgroundColor: '#e9ecef',
    color: '#212529',
    borderColor: '#dee2e6'
  };

  return (
    <>
      <style>
        {`
          .force-light-placeholder::placeholder {
            color: #6c757d !important;
            opacity: 1 !important;
          }
        `}
      </style>
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
            <h4 className="fw-bold mb-2" style={{ color: '#212529' }}>Sistema de Reportes Académicos</h4>
            <p className="mb-0" style={{ color: '#6c757d' }}>
              Universidad Nacional de la Patagonia San Juan Bosco
            </p>
          </CCol>
        </CRow>

        {/* Card de registro centrada */}
        <CRow className="justify-content-center">
          <CCol xs={12} sm={10} md={8} lg={6} xl={5}>
            <CCard className="shadow-lg" style={{ backgroundColor: '#ffffff' }}>
              <CCardBody className="p-4 p-md-5">
                <CForm>
                  <h3 style={{ color: '#212529' }} className='text-center'>Registrarse</h3>
                  <p style={{ color: '#6c757d' }} className="text-center">Cree su cuenta</p>

                  {/* Campo de Usuario */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText style={inputGroupTextStyle}>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput 
                      placeholder="Nombre de usuario" 
                      autoComplete="username" 
                      style={inputStyle}
                      className="force-light-placeholder"
                    />
                  </CInputGroup>

                  {/* Campo de Email */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText style={inputGroupTextStyle}>@</CInputGroupText>
                    <CFormInput 
                      placeholder="Email" 
                      autoComplete="email" 
                      style={inputStyle}
                      className="force-light-placeholder"
                    />
                  </CInputGroup>

                  {/* Campo de Contraseña */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText style={inputGroupTextStyle}>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type={showPassword ? "text" : "password"}
                      placeholder="Contraseña"
                      autoComplete="new-password"
                      style={inputStyle}
                      className="force-light-placeholder"
                    />
                    <CInputGroupText 
                      style={{ ...inputGroupTextStyle, cursor: 'pointer' }}
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      <CIcon icon={cilLowVision} style={{ opacity: showPassword ? 0.5 : 1 }} />
                    </CInputGroupText>
                  </CInputGroup>

                  {/* Campo de Repetir Contraseña */}
                  <CInputGroup className="mb-4">
                    <CInputGroupText style={inputGroupTextStyle}>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type={showRepeatPassword ? "text" : "password"}
                      placeholder="Repetir Contraseña"
                      autoComplete="new-password"
                      style={inputStyle}
                      className="force-light-placeholder"
                    />
                    <CInputGroupText 
                      style={{ ...inputGroupTextStyle, cursor: 'pointer' }}
                      onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                      title={showRepeatPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      <CIcon icon={cilLowVision} style={{ opacity: showRepeatPassword ? 0.5 : 1 }} />
                    </CInputGroupText>
                  </CInputGroup>

                  {/* Botones */}
                  <div className="d-grid gap-2">
                    <CButton color="success" className="text-white" type="submit">
                      Crear Cuenta
                    </CButton>
                    <Link to="/login" className="d-grid text-decoration-none">
                      <CButton color="secondary" variant="outline">
                        Volver
                      </CButton>
                    </Link>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
    </>
  )
}

export default Register