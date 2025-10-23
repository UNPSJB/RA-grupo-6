import { useState } from "react";
import { Form, Container, Card, Alert, Modal } from "react-bootstrap";
import ElegirRol from "../Rol/ElegirRol";
import ElegirPregunta from "../Pregunta/ElegirPregunta";
import type { Pregunta } from "../types";
import type { Formulario } from "../types";
import type { ErrorValidacion } from "../types";


function CrearPlantillaFormulario() {
  const [titulo, setTitulo] = useState("");
  const [rolSeleccionado, setRolSeleccionado] = useState<string>("");
  const [preguntasSeleccionadas, setPreguntasSeleccionadas] = useState<Pregunta[]>([]);
  const [errores, setErrores] = useState<ErrorValidacion>({});
  const [intentoEnvio, setIntentoEnvio] = useState<(boolean)>(false);
  const [mostrarError, setMostrarError] = useState(false);


  const mostrarErrorTemporal = () => {
    setMostrarError(true);
    setTimeout(() => {
      setMostrarError(false);
    }, 3000); 
  };

  const validarFormulario = () => {
    const nuevosErrores: ErrorValidacion = {};
    let erroresTotales = 0;

    if(!titulo.trim()){
      nuevosErrores.titulo = "El título es obligatorio";
      erroresTotales++;
    }

    if(!rolSeleccionado){
      nuevosErrores.rol = "Debes seleccionar un rol";
      erroresTotales++;
    }

    if(preguntasSeleccionadas.length === 0){
      nuevosErrores.preguntas = "Agrega al menos una pregunta";
      erroresTotales++;
    }

    setErrores(nuevosErrores);

    return erroresTotales === 0;
  };

  
  const crearFormularioNuevo = () => {
    setIntentoEnvio(true);

    if(!validarFormulario()){
        mostrarErrorTemporal();
      return;
    }

    const nuevoFormulario: Formulario = {
      titulo,
      rol: rolSeleccionado,
      preguntas: preguntasSeleccionadas.map((p) => Number(p.id)),
    };

    fetch("http://127.0.0.1:8000/formularios/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoFormulario),
    }).then((response) => {
      if (response.ok) {
          setTitulo("");
          setRolSeleccionado("");
          setPreguntasSeleccionadas([]);
          setErrores({});
          setIntentoEnvio(false);
      } else {
        mostrarErrorTemporal();
      }
    }).catch(() => {
      mostrarErrorTemporal();
    });
  };

    const manejarCrearFormulario = (): boolean => {
    setIntentoEnvio(true);

    const formularioValido = validarFormulario();

    if (!formularioValido) {
      mostrarErrorTemporal();
      return false;
    }
    crearFormularioNuevo();
    return true;
  };

  const cambiarTitulo = (valor: string) =>{
    setTitulo(valor);
    if(intentoEnvio && errores.titulo){
      setErrores(prev => ({...prev, titulo: undefined}));
    }
  };

  const cambiarRol = (valor: string) => {
    setRolSeleccionado(valor);
    setPreguntasSeleccionadas([]); 
    if(intentoEnvio && errores.rol){
      setErrores(prev => ({...prev, rol: undefined}));
    }
  };

  const cambiarPreguntas = (preguntas: Pregunta[]) => {
    setPreguntasSeleccionadas(preguntas);
    if(intentoEnvio && errores.preguntas && preguntas.length > 0){
      setErrores(prev => ({...prev, preguntas:undefined}))
    };
  };

  let cantidadErrores = 0;
  if (errores.titulo) cantidadErrores++;
  if (errores.rol) cantidadErrores++;
  if (errores.preguntas) cantidadErrores++;

  return (
    <>
      <Modal show={mostrarError} onHide={() => setMostrarError(false)}>
        <Modal.Header className="bg-danger text-white">
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <p className="mb-0">Por favor completa todos los campos requeridos</p>
        </Modal.Body>
      </Modal>

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

              {intentoEnvio && cantidadErrores > 0 && (
                <Alert variant="warning" className="mb-4 d-flex align-items-start gap-2">
                  <span style={{ fontSize: '1.25rem' }}><i className="fa-sharp fa-solid fa-triangle-exclamation" style={{color: "#FFD43B"}}></i></span>
                  <div>
                    <strong style={{ fontSize: '0.9rem' }}>
                      {cantidadErrores} {cantidadErrores === 1 ? 'campo requiere' : 'campos requieren'} tu atención
                    </strong>
                    <p className="mb-0 mt-1" style={{ fontSize: '0.8rem' }}>
                      Revisa los campos marcados en rojo antes de continuar
                    </p>
                  </div>
                </Alert>
              )}

              <div className="d-flex flex-column gap-4">
                <div>
                  <Form.Label className="fw-semibold mb-2" style={{ fontSize: "0.875rem", color: "#4b5563" }}>
                    Título del Formulario
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={titulo}
                    onChange={(e) => cambiarTitulo(e.target.value)}
                    placeholder="Ingrese el título del formulario..."
                    className="shadow-none"
                    style={{ 
                      borderWidth: "2px",
                      borderColor: errores.titulo? "#dc3545" :"#e5e7eb",
                      borderRadius: "0.5rem",
                    }}
                  />
                {errores.titulo && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.25rem',
                    color: '#dc3545',
                    fontSize: '0.875rem',
                    marginTop: '0.25rem'
                  }}>
                    {errores.titulo}
                  </div>
                )}
                </div>  

                  {/* Rol */}
                    <ElegirRol 
                      selectedRol={rolSeleccionado} 
                      onChangeRol={cambiarRol} 
                      error={errores.rol}
                      />

                  {/* Preguntas */}
                    <ElegirPregunta
                      preguntasSeleccionadas={preguntasSeleccionadas}
                      setPreguntasSeleccionadas={cambiarPreguntas}
                      rolSeleccionado={rolSeleccionado}
                      error={errores.preguntas}
                      onCrearFormulario={manejarCrearFormulario}
                      />
              </div>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
}

export default CrearPlantillaFormulario;
