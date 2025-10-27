import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Button, Alert, Badge, Spinner, Row, Col, Form } from 'react-bootstrap';
import ModalExito from "../ModalEnvio"; // Frontend/src/components/ModalEnvio.tsx
import { EnumTipoPregunta } from "../types"; // Frontend/src/components/types.ts

// Usuario temporal
const USUARIO_ACTUAL = {
    id: 1,
    nombre: "Usuario",
    apellido: "Demo"
};

interface RespuestaTemporal {
    pregunta_id: number;
    texto?: string;
    opcion_id?: number;
}

export default function ResponderInstrumento() {
  const { instrumentoId: instrumentoIdParam } = useParams<{ instrumentoId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [instrumentoSeleccionado, setInstrumentoSeleccionado] = useState<any>(null);
  const [plantillaFormulario, setPlantillaFormulario] = useState<any>(null);
  const [respuestas, setRespuestas] = useState<RespuestaTemporal[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const { materiaNombre, rol } = location.state || {};
  const esAlumno = rol === 'alumno';
  const esDocente = rol === 'docente';

  // Si hay instrumentoId en los parámetros, cargarlo directamente
  useEffect(() => {
    if (instrumentoIdParam) {
      cargarInstrumento(parseInt(instrumentoIdParam));
    }
  }, [instrumentoIdParam]);

  // Cargar datos del instrumento seleccionado
  const cargarInstrumento = async (instrumentoId: number) => {
    setCargando(true);
    setError('');
    try {
      const instrumentoResponse = await fetch(`http://127.0.0.1:8000/instrumentos/${instrumentoId}/detail`);
      if (!instrumentoResponse.ok) throw new Error('No se pudo cargar el instrumento');
      const instrumentoData = await instrumentoResponse.json();
      setInstrumentoSeleccionado(instrumentoData);

      const plantillaResponse = await fetch(`http://127.0.0.1:8000/formularios/${instrumentoData.plantilla_formulario_id}`);
      if (!plantillaResponse.ok) throw new Error('No se pudo cargar el formulario');
      const plantillaData = await plantillaResponse.json();
      setPlantillaFormulario(plantillaData);

      const respuestasIniciales = plantillaData.preguntas.map((pregunta: any) => ({
        pregunta_id: pregunta.id,
        texto: '',
        opcion_id: undefined,
      }));
      setRespuestas(respuestasIniciales);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  // Actualizar respuesta
  const actualizarRespuesta = (preguntaId: number, texto?: string, opcionId?: number) => {
    setRespuestas((prev) =>
      prev.map((r) =>
        r.pregunta_id === preguntaId
          ? { ...r, texto: texto ?? r.texto, opcion_id: opcionId ?? r.opcion_id }
          : r
      )
    );
  };

  const obtenerRespuesta = (preguntaId: number) => respuestas.find(r => r.pregunta_id === preguntaId);

  const todasRespondidas = respuestas.every(r => r.texto?.trim() || r.opcion_id);

  // 🔹 Enviar respuestas
  const enviarRespuestas = async (): Promise<boolean> => {
    if (!instrumentoSeleccionado) return false;
    setEnviando(true);

    try {
      const formularioResponse = await fetch('http://127.0.0.1:8000/RespuestasFormulario/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materia_id: instrumentoSeleccionado.materia?.id,
          usuario_id: USUARIO_ACTUAL.id,
          instrumento_id: instrumentoSeleccionado.id,
          fecha_envio: new Date().toISOString().split('T')[0],
          respuestas: []
        })
      });

      if (!formularioResponse.ok) throw new Error('Error al crear el formulario');
      const formularioCreado = await formularioResponse.json();

      const promesasRespuestas = respuestas
        .filter(r => r.texto?.trim() || r.opcion_id)
        .map(r =>
          fetch('http://127.0.0.1:8000/respuestas/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              pregunta_id: r.pregunta_id,
              texto: r.texto?.trim() || null,
              opcion_id: r.opcion_id || null,
              formulario_id: formularioCreado.id,
            }),
          })
        );

      await Promise.all(promesasRespuestas);
      return true;
    } catch (err: any) {
      console.error(err);
      alert('Error al enviar las respuestas: ' + err.message);
      return false;
    } finally {
      setEnviando(false);
    }
  };

  // 🔹 Si hay instrumento seleccionado, mostrar formulario
  if (cargando) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status" className="mb-3" />
        <p>Cargando {esAlumno ? 'encuesta' : 'informe'}...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <div className="mt-3">
            <Button variant="outline-danger" onClick={() => navigate(-1)}>
              Volver atrás
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  const rutaVolver = esAlumno ? '/materias' : '/instrumentos-docente';
  const tituloPagina = esAlumno ? 'Encuesta' : 'Informe de Cátedra';

  return (
    <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh", paddingTop: "2.5rem", paddingBottom: "2.5rem" }}>
      <Container style={{ maxWidth: '900px' }}>
        <Button variant="outline-secondary" className="mb-3" onClick={() => navigate(rutaVolver)}>
          ← Volver atrás
        </Button>

        <Card className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
          <div className="text-center mb-3 mt-3">
            <h1 className="fw-bold mb-2" style={{ color: "#1f2937", fontSize: "1.875rem" }}>
              {plantillaFormulario?.titulo || instrumentoSeleccionado?.nombre || `${tituloPagina} de ${materiaNombre}`}
            </h1>
            <p className="text-muted mb-0">Complete todas las preguntas para finalizar el {esAlumno ? 'encuesta' : 'informe'}.</p>
          </div>

          <Card.Body className="p-3 p-md-4">
            {plantillaFormulario?.preguntas?.map((pregunta: any, idx: number) => (
              <Card key={pregunta.id} className="border-0 shadow-sm w-100 mb-3" style={{ borderRadius: "1rem" }}>
                <Card.Body className="p-3">
                  <div className="mb-2 d-flex align-items-center gap-3">
                    <Badge bg="secondary" className="rounded-circle" style={{ width: '35px', height: '35px', fontSize: '1rem', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {idx + 1}
                    </Badge>
                    <div>
                      <h5 className="fw-semibold mb-1">{pregunta.texto}</h5>
                      <Badge bg={pregunta.tipo.toLowerCase() === EnumTipoPregunta.abierta ? 'success' : 'info'}>
                        {pregunta.tipo === EnumTipoPregunta.abierta ? EnumTipoPregunta.abierta : EnumTipoPregunta.cerrada}
                      </Badge>
                    </div>
                  </div>

                  {pregunta.tipo.toLowerCase() === EnumTipoPregunta.abierta.toLowerCase() ? (
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={obtenerRespuesta(pregunta.id)?.texto || ''}
                      onChange={(e) => actualizarRespuesta(pregunta.id, e.target.value)}
                      placeholder="Escriba su respuesta..."
                      className="input-pregunta"
                      style={{ marginBottom: '0.5rem' }}
                    />
                  ) : (
                    <Form.Group>
                      {pregunta.opciones?.map((opcion: any) => (
                        <Form.Check
                          key={opcion.id}
                          type="radio"
                          name={`pregunta-${pregunta.id}`}
                          label={opcion.texto}
                          checked={obtenerRespuesta(pregunta.id)?.opcion_id === opcion.id}
                          onChange={() => actualizarRespuesta(pregunta.id, undefined, opcion.id)}
                          className="mb-2"
                        />
                      ))}
                    </Form.Group>
                  )}
                </Card.Body>
              </Card>
            ))}

            {todasRespondidas ? (
              <Alert variant="success" className="text-center mt-3">¡Listo para enviar tus respuestas!</Alert>
            ) : (
              <Alert variant="warning" className="text-center mt-3">Por favor, responde todas las preguntas antes de enviar.</Alert>
            )}

            <Row className="mt-4">
              <Col md={6} className="mb-2">
                <Button variant="outline-secondary" className="w-100" onClick={() => navigate(rutaVolver)}>
                  Volver atrás
                </Button>
              </Col>
              <Col md={6} className="mb-2">
                <ModalExito
                  onEnviar={enviarRespuestas}
                  onExito={() => navigate(rutaVolver)}
                  desactivado={!todasRespondidas || enviando}
                  variante="success"
                  textoBoton={`Enviar ${esAlumno ? 'Encuesta' : 'Informe'}`}
                  className="w-100"
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}