import { useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import ElegirRol from "../Rol/ElegirRol";
import ElegirPregunta from "../Pregunta/ElegirPregunta";
import type { Pregunta } from "../Pregunta/PreguntaTypes";
import Menu from "../Menu";

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
    <>
      <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh", paddingTop: "2.5rem", paddingBottom: "2.5rem" }}>
        <Container style={{ maxWidth: "900px" }}>
          <Card className="border-0 shadow-sm w-100" style={{ borderRadius: "1rem" }}>
            <Card.Body className="p-4 p-md-5">
              <div className="mb-5 text-center text-md-start">
                <h1 className="fw-bold mb-2"  style={{ color: "#1f2937", fontSize: "1.875rem" }}>
                  Crear Nuevo Formulario
                </h1>
                <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>
                  Completa los campos para crear el Formulario
                </p>
              </div>

              <div className="d-flex flex-column gap-4">

                <Form.Label className="fw-semibold mb-2" style={{ fontSize: "0.875rem", color: "#4b5563" }}>
                  Título del Formulario
                </Form.Label>
                <Form.Control
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ingrese el título del formulario..."
                  className="shadow-none"
                  style={{ 
                    borderWidth: "2px",
                    borderColor: "#e5e7eb",
                    borderRadius: "0.5rem",
                    fontSize: "1rem",
                    padding: "0.75rem 1rem"
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
                  <div className="d-grid mt-3">
                    <Button className="btn-success" onClick={crearFormularioNuevo}>
                      <i className="fa-solid fa-check me-2"></i> Crear Formulario
                    </Button>
                  </div>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
}

export default CrearPlantillaFormulario;
