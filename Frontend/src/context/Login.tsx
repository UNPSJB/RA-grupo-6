import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Importamos más componentes de react-bootstrap
import {
  Modal,
  Card,
  Button,
  Form, // <-- Importante para Form.Floating
  Row,
  Col,
  Container,
  Alert,
} from 'react-bootstrap';

// --- Componente de Formulario Reutilizable ---
// Este componente "tonto" solo renderiza la UI del formulario
// La lógica (estado y handleSubmit) se queda en el componente principal
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

        {/* Usamos Form de react-bootstrap */}
        <Form onSubmit={handleSubmit}>
          {/* 1. Cambio a "Floating Labels" */}
          <Form.Floating className="mb-3">
            <Form.Control
              type="text" // Es mejor ser explícito con el tipo
              id="floatingUsername"
              placeholder="Ingrese su usuario" // El placeholder es necesario para floating labels
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

          {/* 2. Error mostrado con un Alert de Bootstrap */}
          {error && (
            <Alert variant="danger" className="py-2 text-center">
              {error}
            </Alert>
          )}

          {/* 3. Enlace común de "Olvidé contraseña" */}
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

// --- Componente Principal (Contenedor) ---
interface LoginProps {
  showModal?: boolean;
  onClose?: () => void;
}

export default function Login({ showModal = false, onClose }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Limpiamos el error en cada intento
    try {
      await login(username, password);
      if (showModal) onClose?.();
      else navigate('/seleccionar-rol');
    } catch {
      setError('Usuario o contraseña incorrectos');
    }
  };

  // El contenido del formulario ahora es un componente separado
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

  // --- VISTA MODAL ---
  if (showModal) {
    return (
      // Un tamaño 'md' suele ser mejor para un login modal
      <Modal show onHide={onClose} centered>
        {/* Quitamos el padding del body para que la card se ajuste */}
        <Modal.Body className="p-0">{formContent}</Modal.Body>
      </Modal>
    );
  }

  // --- VISTA DE PÁGINA COMPLETA ---
  // 4. Layout mejorado de 2 columnas para la página completa
  return (
    <div
      className="d-flex align-items-center vh-100 py-5"
      style={{
        background: 'linear-gradient(135deg, #f3f6faff 0%, #3a587796 100%)',
      }}
    >
      <Container>
        <Row className="justify-content-center align-items-center">
          {/* Columna 1: Branding/Imagen (se oculta en pantallas chicas) */}
          <Col md={6} lg={7} className="d-none d-md-block text-center px-lg-5">
            
            <h3 className="mt-4 fw-light text-l">
              {/* Podrías hacer este título dinámico */}
              Sistema de Reportes Académicos
            </h3>
            <p className="text-muted">
              Universidad Nacional de la Patagonia San Juan Bosco
            </p>
          </Col>

          {/* Columna 2: Formulario */}
          <Col md={6} lg={5}>
            {formContent}
          </Col>
        </Row>
      </Container>
    </div>
  );
}