import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  CModal,
  CCard,
  CButton,
  CForm,
  CAlert,
  CModalBody,
  CCardBody,
  CCol,
  CFormFloating,
  CFormInput,
  CFormLabel,
  CRow,
  CSpinner,
} from "@coreui/react";

interface LoginFormContentProps {
  handleSubmit: (e: React.FormEvent) => Promise<void> | void;
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  error?: string;
}

const LoginFormContent: React.FC<LoginFormContentProps> = ({
  handleSubmit,
  username,
  setUsername,
  password,
  setPassword,
  error,
}) => {
  return (
    <CCard className="shadow-lg border-0 rounded-4" style={{ width: "520px", minHeight: "340px" }}>
      <CCardBody className="px-5 py-4 d-flex align-items-center justify-content-center">
        <CRow className="w-100 justify-content-center">
          <CCol xs={12} lg={10}>
            <div className="text-center mb-4">
              <h2 className="fw-bold text-primary mb-2">Bienvenido</h2>
              <p className="text-medium-emphasis mb-0">Inicie sesión para continuar</p>
            </div>

            <CForm onSubmit={handleSubmit}>
              <CFormFloating className="mb-3">
                <CFormInput
                  type="text"
                  id="floatingUsername"
                  placeholder="Usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <CFormLabel htmlFor="floatingUsername">Usuario</CFormLabel>
              </CFormFloating>

              <CFormFloating className="mb-3">
                <CFormInput
                  type="password"
                  id="floatingPassword"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <CFormLabel htmlFor="floatingPassword">Contraseña</CFormLabel>
              </CFormFloating>

              {error && (
                <CAlert color="danger" className="py-2 text-center">
                  <small>{error}</small>
                </CAlert>
              )}

              <div className="d-grid mt-4">
                <CButton color="primary" type="submit" size="lg">
                  Ingresar
                </CButton>
              </div>
            </CForm>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  );
};

interface LoginProps {
  showModal?: boolean;
  onClose?: () => void;
}

export default function Login({ showModal = false, onClose }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <CSpinner />
        <p className="ms-2">Cargando...</p>
      </div>
    );
  }

  if (!showModal && user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(username, password);
      if (showModal) onClose?.();
      else navigate("/");
    } catch {
      setError("Usuario o contraseña incorrectos");
    }
  };

  const cardForm = (
    <LoginFormContent
      handleSubmit={handleSubmit}
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      error={error}
    />
  );

  if (showModal) {
    return (
      <CModal visible onHide={onClose} centered>
        <CModalBody className="p-0">{cardForm}</CModalBody>
      </CModal>
    );
  }

  return (
    <div
      className="bg-light min-vh-100 d-flex flex-column align-items-center justify-content-center text-center p-3"
    >
      <div className="mb-4">
        <img
          src="/Unipat.png"
          alt="Logo UNPSJB"
          style={{
            maxWidth: 140,
            height: "auto",
          }}
        />
        <h3 className="fw-light mt-3" style={{ fontSize: "1.75rem" }}>
          Sistema de Reportes Académicos
        </h3>
        <p className="text-medium-emphasis" style={{ fontSize: "0.95rem" }}>
          Universidad Nacional de la Patagonia San Juan Bosco
        </p>
      </div>

      <div className="d-flex justify-content-center align-items-center w-100">
        {cardForm}
      </div>
    </div>
  );
}