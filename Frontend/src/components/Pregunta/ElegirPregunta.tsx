import { useState, useEffect } from "react";
import { Form, Button, Card, Badge} from "react-bootstrap";
import type { Pregunta} from "../types";
import CrearPregunta from "./CrearPregunta";
import { EnumTipoPregunta } from "../types";
import ModalExito from "../ModalEnvio";
import { CButton, CCol, CRow } from "@coreui/react";


type Props = {
  preguntasSeleccionadas: Pregunta[];
  setPreguntasSeleccionadas: (pregs: Pregunta[]) => void;
  rolSeleccionado: string;
  error?: string;
  onCrearFormulario?: () => boolean;
};

function ElegirPregunta({ preguntasSeleccionadas, setPreguntasSeleccionadas, rolSeleccionado, error, onCrearFormulario }: Props) {
  const [preguntasDisponibles, setPreguntasDisponibles] = useState<Pregunta[]>([]);
  const [preguntaSeleccionadaId, setPreguntaSeleccionadaId] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  
  const refrescarPreguntas = () => {
    fetch("http://127.0.0.1:8000/preguntas/todos")
      .then(res => res.json())
      .then(data => setPreguntasDisponibles(data))
      .catch(err => console.error(err));
  };


  useEffect(() => {
    refrescarPreguntas();
    setPreguntaSeleccionadaId("");
  }, [rolSeleccionado, setPreguntasSeleccionadas]);
  
  const agregarPregunta = () => {

    const pregunta = preguntasDisponibles.find((p) => String(p.id) === preguntaSeleccionadaId);
    if (!pregunta) return;

    setPreguntasSeleccionadas([...preguntasSeleccionadas, pregunta]);
    setPreguntaSeleccionadaId("");
    
  };
  
  const eliminarPregunta = (id: string) => {
    setPreguntasSeleccionadas(preguntasSeleccionadas.filter(p => String(p.id) !== id));
  };


  const preguntasParaSelect = preguntasDisponibles
    .filter((p) => !preguntasSeleccionadas.some((s) => s.id === p.id))
    .filter((p) => rolSeleccionado === "" || Number(p.rol_id) === Number(rolSeleccionado));
  
  return (
    <div>
      <div>
        <div className="mb-3">
          <h5 className="mb-3 fw-semibold text-secondary" style={{ fontSize: "0.95rem" }}>
            Preguntas del Formulario
          </h5>
          {preguntasSeleccionadas.length > 0 && (
            <Badge bg="info" className="px-2 py-1" style={{ fontSize: "0.8rem" }}>
              {preguntasSeleccionadas.length}{" "}
              {preguntasSeleccionadas.length === 1 ? "pregunta" : "preguntas"}
            </Badge>
          )}
        </div>
        
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={() => setShowModal(true)}
            className="d-flex align-items-center gap-2 mb-3"
          >
            <i className="fa-solid fa-plus"></i>
            Nueva Pregunta
          </Button>
      </div>

      {preguntasSeleccionadas.length > 0 ? (
        <div className="mb-4">
          <div>
            {preguntasSeleccionadas.map((pregunta, index) => (
              <Card
                key={pregunta.id}
                className="border"
                style={{ borderColor: "#e0e0e0" }}
              >
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex gap-2 align-items-center">
                      <Badge
                        bg="primary"
                        className="rounded-circle d-inline-flex justify-content-center align-items-center"
                        style={{ width: "24px", height: "24px", fontSize: "0.75rem" }}
                      >
                        {index + 1}
                      </Badge>

                      <Badge
                        bg={pregunta.tipo === EnumTipoPregunta.cerrada? "secondary" : "success"}
                        className="px-2 py-1"
                        style={{ fontSize: "0.7rem", fontWeight: "500" }}
                      >
                        {pregunta.tipo}
                      </Badge>
                    </div>

                    <Button
                      onClick={() => eliminarPregunta(String(pregunta.id))}
                      className="bg-transparent border-0 p-0"
                    >
                      <i
                        className="fa-solid fa-xmark"
                        style={{ fontSize: "20px", color: "#dc3545" }}
                      ></i>
                    </Button>
                  </div>

                  <p
                    className="mb-2 fw-medium"
                    style={{ color: "#2c3e50", fontSize: "0.9rem" }}
                  >
                    {pregunta.texto}
                  </p>

                  {pregunta.tipo === EnumTipoPregunta.cerrada && pregunta.opciones.length > 0 && (
                    <div className="d-flex gap-2 flex-wrap mt-2">
                      {pregunta.opciones.map((op) => (
                        <span
                          key={op.id}
                          className="border rounded-pill px-2 py-1"
                          style={{
                            fontSize: "0.75rem",
                            backgroundColor: "#f8f9fa",
                            borderColor: "#dee2e6",
                            color: "#495057",
                          }}
                        >
                          {op.texto}
                        </span>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div
          className="text-center mb-3 rounded"
          style={{
            backgroundColor: error? "#fff5f5":"#f8f9fa",
            border: `2px dashed ${error ? "#dc3545" : "#dee2e6"}`,
            padding: "2rem 1rem",
          }}
        >
          <div style={{ fontSize: "2rem", opacity: 0.3 }}></div>
          <p className="text-muted mb-0 mt-2" style={{ color: error?"#dc3545" : "#6c757d", fontSize: "0.85rem" }}>
            {error||"No hay preguntas agregadas aún"}
          </p>
          {!error && (
            <small className="text-muted" style={{ fontSize: "0.75rem" }}>
              Selecciona una pregunta del menú de abajo
            </small>
          )}
        </div>
      )}

      <Form.Select
        value={preguntaSeleccionadaId}
        onChange={(e) => setPreguntaSeleccionadaId(e.target.value)}
        className="border-2 mb-3"
        style={{ borderColor: "#dee2e6"}}
      >
        <option value="">Seleccione una pregunta...</option>
        {preguntasParaSelect.map((p) => (
          <option key={p.id} value={p.id}>
            {p.tipo} - {p.texto}
          </option>
        ))}
      </Form.Select>
      <CCol xs="auto">
          <CButton color="primary" onClick={agregarPregunta} >
            Agregar
          </CButton>
        </CCol>
      <CRow className="justify-content-center mt-4 pt-4 border-top">
        
        
        <CCol xs="auto">
        {onCrearFormulario && (
          <ModalExito
            onEnviar={onCrearFormulario}
            desactivado={false}
            variante="success"
            className="btn-success text-white"
            textoBoton="Crear Formulario"
          />
        )}
      </CCol>
      </CRow>
      <CrearPregunta
        mostrar={showModal}
        manejarPestania={() => setShowModal(false)}
        refrescarPreguntas={refrescarPreguntas}
      />
    </div>
  );
}

export default ElegirPregunta;

