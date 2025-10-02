import { useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import ElegirRol from "../Rol/ElegirRol";
import ElegirPregunta from "../Pregunta/ElegirPregunta";
import type { Pregunta } from "../Pregunta/PreguntaTypes";

type Formulario = {
  titulo: string;
  rol: string;
  preguntas: number[];
};


function CrearPlantillaFormulario() {
  const [titulo, setTitulo] = useState("");
  const [rolSeleccionado, setRolSeleccionado] = useState<string>("");
  const [preguntasSeleccionadas, setPreguntasSeleccionadas] = useState<Pregunta[]>([]);

  const crearFormularioNuevo = () => {
    const nuevoFormulario: Formulario = {
      titulo,
      rol: rolSeleccionado,
      preguntas: preguntasSeleccionadas.map((p) => p.id),
    };

    fetch("http://127.0.0.1:8000/formularios/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoFormulario),
    }).then(() => {
      setTitulo("");
      setRolSeleccionado("");
      setPreguntasSeleccionadas([]);
    });
  };

  return (
    <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh", paddingTop: "2rem", paddingBottom: "2rem" }}>
      <Container style={{ maxWidth: "1000px" }}>
        <Card className="border-0 shadow-sm w-100">
          <Card.Body className="p-4">
            <div className="mb-5">
              <h1 className="fw-bold mb-2" style={{ color: "#2c3e50" }}>
                Crear Nuevo Formulario
              </h1>
              <p className="text-muted mb-0">
                Completa los campos para crear el Formulario
              </p>
            </div>

            <div className="d-flex flex-column gap-4">

              <Form.Label className="fw-semibold text-secondary mb-3" style={{ fontSize: "0.95rem" }}>
                Título del Formulario
              </Form.Label>
              <Form.Control
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ingrese Título..."
                className="border-2"
                style={{ 
                  borderColor: "#dee2e6",
                  fontSize: "1rem",
                  padding: "0.75rem"
                }}
              />

              {/* Rol */}
                <ElegirRol 
                  selectedRol={rolSeleccionado} 
                  onChangeRol={setRolSeleccionado} 
                />

              {/* Preguntas */}
                <ElegirPregunta
                  preguntasSeleccionadas={preguntasSeleccionadas}
                  setPreguntasSeleccionadas={setPreguntasSeleccionadas}
                />

              {/* Botón Crear */}
                <div className="d-grid">
                  <Button className="btn-success" onClick={crearFormularioNuevo}>
                    Crear Formulario
                  </Button>
                </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default CrearPlantillaFormulario;
