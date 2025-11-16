import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Modal,
  Card,
  Button,
  Form,
  Row,
  Col,
  Alert,
} from "react-bootstrap";

interface LoginFormContentProps {
  handleSubmit: (e: React.FormEvent) => Promise<void> | void;
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  error?: string;
  showLogo?: boolean;
}

const LoginFormContent: React.FC<LoginFormContentProps> = ({
  handleSubmit,
  username,
  setUsername,
  password,
  setPassword,
  error
}) => {
  return (
    <>
      <style>{`
        .form-floating > .form-control:focus ~ label,
        .form-floating > .form-control:not(:placeholder-shown) ~ label {
          opacity: 0.65;
          transform: scale(0.85) translateY(-0.5rem) translateX(0.15rem);
        }
        
        .form-floating > label {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          padding: 0.65rem 0.875rem;
          pointer-events: none;
          border: 1px solid transparent;
          transform-origin: 0 0;
          transition: opacity 0.1s ease-in-out, transform 0.1s ease-in-out;
        }
        
        .form-floating > .form-control {
          padding: 0.65rem 0.875rem;
        }
      `}</style>
      
      <Card
        className="shadow-lg border-0 rounded-4"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          width: "520px",
          minHeight: "340px",
          margin: "0 auto",
        }}
      >
        <Card.Body className="px-5 py-4 d-flex align-items-center justify-content-center">
          <Row className="w-100 justify-content-center">
            <Col xs={12} lg={10}>
              <div className="text-center mb-3">
                <h2
                  className="fw-bold text-primary mb-2"
                  style={{ fontSize: "1.85rem", letterSpacing: "-0.5px" }}
                >
                  Bienvenido
                </h2>
                <p className="text-muted mb-0" style={{ fontSize: "0.93rem" }}>
                  Inicie sesión para continuar
                </p>
              </div>

              <Form onSubmit={handleSubmit}>
                <div style={{ marginTop: "1.75rem" }}>
                  <Form.Floating className="mb-3">
                  <Form.Control
                    type="text"
                    id="floatingUsername"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="rounded-3"
                    style={{
                      borderColor: "#dee2e6",
                      fontSize: "0.95rem",
                      height: "44px",
                      transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
                    }}
                  />
                  <label
                    htmlFor="floatingUsername"
                    style={{ 
                      fontSize: "0.95rem",
                      color: "#6c757d",
                    }}
                  >
                    Usuario
                  </label>
                </Form.Floating>

                <Form.Floating className="mb-3">
                  <Form.Control
                    type="password"
                    id="floatingPassword"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="rounded-3"
                    style={{
                      borderColor: "#dee2e6",
                      fontSize: "0.95rem",
                      height: "44px",
                      transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
                    }}
                  />
                  <label
                    htmlFor="floatingPassword"
                    style={{ 
                      fontSize: "0.95rem",
                      color: "#6c757d",
                    }}
                  >
                    Contraseña
                  </label>
                </Form.Floating>

                {error && (
                  <Alert
                    variant="danger"
                    className="py-2 text-center rounded-3 mb-3"
                  >
                    <small>{error}</small>
                  </Alert>
                )}

                <div className="text-end mb-3">
                  <a
                    href="/recuperar-password"
                    className="text-decoration-none text-primary"
                    style={{ fontSize: "0.88rem", fontWeight: "500" }}
                  >
                    ¿Olvidó su contraseña?
                  </a>
                </div>

                <div className="d-flex justify-content-center">
                  <Button
                    variant="primary"
                    type="submit"
                    className="rounded-3 fw-semibold shadow-sm"
                    style={{
                      fontSize: "1.05rem",
                      height: "46px",
                      width: "100%",
                      transition: "all 0.2s ease",
                      letterSpacing: "0.3px",
                    }}
                  >
                    Ingresar
                  </Button>
                </div>
              </div>
            </Form>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
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
        <p>Cargando...</p>
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
      showLogo={false}
    />
  );

  if (showModal) {
    return (
      <Modal show onHide={onClose} centered>
        <Modal.Body className="p-0">{cardForm}</Modal.Body>
      </Modal>
    );
  }

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #cfd8e3 0%, #4f6b88 100%)",
        padding: "24px 12px",
        overflow: "hidden",
      }}
    >
      <div className="mb-3">
        <img
          src="/Unipat.png"
          alt="Logo UNPSJB"
          style={{
            maxWidth: 140,
            height: "auto",
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))",
            marginBottom: "12px",
          }}
        />
        <h3
          className="fw-light text-white"
          style={{ fontSize: "1.75rem", marginBottom: "0.3rem" }}
        >
          Sistema de Reportes Académicos
        </h3>
        <p className="text-white-50" style={{ fontSize: "0.95rem" }}>
          Universidad Nacional de la Patagonia San Juan Bosco
        </p>
      </div>

      <div
        className="d-flex justify-content-center align-items-center w-100"
        style={{ marginTop: "4px" }}
      >
        {cardForm}
      </div>
    </div>
  );
}