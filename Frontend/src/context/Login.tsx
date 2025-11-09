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
    <Card
      className="shadow-lg border-0 rounded-4"
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        width: "520px",
        minHeight: "320px",
        margin: "0 auto",
      }}
    >
      <Card.Body className="px-4 py-4 d-flex align-items-center justify-content-center">
        <Row className="w-100 justify-content-center">
          <Col xs={12} lg={10}>
            <div className="text-center mb-4 mt-1">
              <h2
                className="fw-bold text-primary mb-1"
                style={{ fontSize: "1.9rem" }}
              >
                Bienvenido
              </h2>
              <p className="text-muted mb-2" style={{ fontSize: "0.95rem" }}>
                Inicie sesión para continuar
              </p>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Floating className="mb-3">
                <Form.Control
                  type="text"
                  id="floatingUsername"
                  placeholder="Ingrese su usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="rounded-3"
                  style={{
                    borderColor: "#dee2e6",
                    fontSize: "1rem",
                    padding: "0.5rem 1rem",
                    height: "40px",
                    width: "100%",
                  }}
                />
                <label
                  htmlFor="floatingUsername"
                  style={{ marginLeft: "2.5%", fontSize: "0.95rem" }}
                >
                  Usuario
                </label>
              </Form.Floating>

              <Form.Floating className="mb-3">
                <Form.Control
                  type="password"
                  id="floatingPassword"
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-3"
                  style={{
                    borderColor: "#dee2e6",
                    fontSize: "1rem",
                    padding: "0.5rem 1rem",
                    height: "40px",
                    width: "100%",
                  }}
                />
                <label
                  htmlFor="floatingPassword"
                  style={{ marginLeft: "2.5%", fontSize: "0.95rem" }}
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

              <div className="text-end mb-3" style={{ marginRight: "4%" }}>
                <a
                  href="/recuperar-password"
                  className="text-decoration-none small text-primary"
                >
                  ¿Olvidó su contraseña?
                </a>
              </div>

              <div className="d-flex justify-content-center">
                <Button
                  variant="primary"
                  type="submit"
                  className="rounded-3 fw-semibold"
                  style={{
                    fontSize: "1.05rem",
                    height: "40px",
                    width: "100%",
                    transition: "all 0.2s ease",
                  }}
                >
                  Ingresar
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Card.Body>
    </Card>
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
    return <Navigate to="/seleccionar-rol" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(username, password);
      if (showModal) onClose?.();
      else navigate("/seleccionar-rol");
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
