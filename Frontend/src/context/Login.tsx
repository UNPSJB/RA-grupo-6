import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom'; // <-- 1. Importa Navigate
import { useAuth } from '../context/AuthContext';
import {
  Modal,
  Card,
  Button,
  Form,
  Row,
  Col,
  Container,
  Alert,
} from 'react-bootstrap';

interface LoginFormContentProps {
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  error: string;
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
    <Card className="shadow-sm border-0 rounded-2" style={{ background: 'linear-gradient(135deg, #ffffffe5 0%, #ffffff9d 100%)' }}>
      <Card.Body className="" >
        <div className="text-center mb-4">
          <h2 className="fw-normal text-primary mb-2">Bienvenido</h2>
          <p className="text-muted mb-0">Inicie sesión para continuar</p>
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
            />
            <label htmlFor="floatingUsername">Usuario</label>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              type="password"
              id="floatingPassword"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="floatingPassword">Contraseña</label>
          </Form.Floating>
          {error && (
            <Alert variant="danger" className="py-2 text-center">
              {error}
            </Alert>
          )}
          <div className="text-end mb-3">
            <a href="/recuperar-password" className="text-decoration-none small">
              ¿Olvidó su contraseña?
            </a>
          </div>
          <Button
            variant="primary"
            type="submit"
            className="w-100 py-2 fs-5 fw-semibold"
          >
            Ingresar
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

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
    setError('');
    try {
      await login(username, password);
      if (showModal) onClose?.();
      else navigate('/seleccionar-rol');
    } catch {
      setError('Usuario o contraseña incorrectos');
    }
  };

  const formContent = (
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
      <Modal show onHide={onClose} centered>
        <Modal.Body className="p-0">{formContent}</Modal.Body>
      </Modal>
    );
  }

  return (
    <div
      className="d-flex align-items-center vh-100 py-5"
      style={{
        background: 'linear-gradient(135deg, #f3f6faff 0%, #3a587796 100%)',
      }}
    >
      <Container>
        <Row className="justify-content-center align-items-center">
          <Col md={6} lg={7} className="d-none d-md-block text-center px-lg-5">
            <h3 className="mt-4 fw-light text-l">
              Sistema de Reportes Académicos
            </h3>
            <p className="text-muted">
              Universidad Nacional de la Patagonia San Juan Bosco
            </p>
          </Col>
          <Col md={6} lg={5}>
            {formContent}
          </Col>
        </Row>
      </Container>
    </div>
  );
}