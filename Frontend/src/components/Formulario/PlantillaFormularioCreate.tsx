import { useState} from "react";
import { CForm, CCardBody, CAlert, CModal, CModalHeader, CModalTitle, CModalBody, CFormLabel, CFormInput, CCardHeader, CFormSelect } from "@coreui/react";
import ElegirRol from "../Rol/ElegirRol";
import ElegirPregunta from "../Pregunta/ElegirPregunta";
import type { Pregunta } from "../types";
import ShadowedCard from "../coreui-components/ShadowedCard";

interface Formulario {
  titulo: string;
  rol: string;
  preguntas: number[];
  ciclo?: string | null; 
}

interface ErrorValidacion {
  titulo?: string;
  rol?: string;
  preguntas?: string;
  ciclo?: string; 
}

function CrearPlantillaFormulario() {
  const [titulo, setTitulo] = useState("");
  const [rolSeleccionado, setRolSeleccionado] = useState<string>("");
  const [cicloSeleccionado, setCicloSeleccionado] = useState<string>(""); 
  const [preguntasSeleccionadas, setPreguntasSeleccionadas] = useState<Pregunta[]>([]);
  const [errores, setErrores] = useState<ErrorValidacion>({});
  const [intentoEnvio, setIntentoEnvio] = useState(false);
  const [mostrarError, setMostrarError] = useState(false);

  const mostrarErrorTemporal = () => {
    setMostrarError(true);
    setTimeout(() => setMostrarError(false), 2000);
  };

  const validarFormulario = () => {
    const nuevosErrores: ErrorValidacion = {};
    let erroresTotales = 0;

    if (!titulo.trim()) {
      nuevosErrores.titulo = "El título es obligatorio";
      erroresTotales++;
    }

    if (!rolSeleccionado) {
      nuevosErrores.rol = "Debes seleccionar un rol";
      erroresTotales++;
    }
    
    if (rolSeleccionado === "1" && !cicloSeleccionado) {
        nuevosErrores.ciclo = "Debes seleccionar un ciclo para el estudiante";
        erroresTotales++;
    }

    if (preguntasSeleccionadas.length === 0) {
      nuevosErrores.preguntas = "Agrega al menos una pregunta";
      erroresTotales++;
    }

    setErrores(nuevosErrores);
    return erroresTotales === 0;
  };

  const crearFormularioNuevo = () => {
    const nuevoFormulario: Formulario = {
      titulo,
      rol: rolSeleccionado,
      preguntas: preguntasSeleccionadas.map((p) => Number(p.id)),
      ciclo: rolSeleccionado === "1" ? cicloSeleccionado : null 
    };

    fetch("http://127.0.0.1:8000/formularios/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoFormulario),
    }).then((response) => {
      if (response.ok) {
          setTitulo("");
          setRolSeleccionado("");
          setCicloSeleccionado(""); 
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
    if (!validarFormulario()) {
      mostrarErrorTemporal();
      return false;
    }
    crearFormularioNuevo();
    return true;
  };

  const cambiarRol = (valor: string) => {
    setRolSeleccionado(valor);
    if (valor !== "1") {
        setCicloSeleccionado("");
    }
    setPreguntasSeleccionadas([]);
    if (intentoEnvio && errores.rol) {
      setErrores((prev) => ({ ...prev, rol: undefined }));
    }
  };

  return (
    <>
      <CModal visible={mostrarError} onClose={() => setMostrarError(false)}>
        <CModalHeader className="bg-danger text-white">
          <CModalTitle>Error</CModalTitle>
        </CModalHeader>
        <CModalBody className="text-center py-4">
          <p className="mb-0">Por favor completa todos los campos requeridos</p>
        </CModalBody>
      </CModal>

      <ShadowedCard className="mb-4">
        <CCardHeader>
          <div className="m-2">
            <h4>Crear Nuevo Formulario</h4>
            <p className="text-medium-emphasis mb-0">Completa los campos para crear el Formulario</p>
          </div>
        </CCardHeader>
        <CCardBody className="p-4 p-md-5">
          
          {intentoEnvio && Object.keys(errores).length > 0 && (
            <CAlert color="warning" className="mb-4">
               Revisa los campos marcados en rojo.
            </CAlert>
          )}

          <CForm className="d-flex flex-column gap-4">
            <div>
              <CFormLabel className="fw-semibold mb-2">Título del Formulario</CFormLabel>
              <CFormInput
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ingrese el título..."
                invalid={!!errores.titulo}
              />
              {errores.titulo && <div className="text-danger small mt-1">{errores.titulo}</div>}
            </div>

            <ElegirRol
              selectedRol={rolSeleccionado}
              onChangeRol={cambiarRol}
              error={errores.rol}
            />

            {rolSeleccionado === "1" && (
                <div className="animate__animated animate__fadeIn">
                    <CFormLabel className="fw-semibold mb-2">Ciclo Académico</CFormLabel>
                    <CFormSelect 
                        value={cicloSeleccionado}
                        onChange={(e) => setCicloSeleccionado(e.target.value)}
                        invalid={!!errores.ciclo}
                    >
                        <option value="" disabled>Seleccione el ciclo...</option>
                        <option value="CICLO_BASICO">Ciclo Básico</option>
                        <option value="CICLO_SUPERIOR">Ciclo Superior</option>
                    </CFormSelect>
                    {errores.ciclo && <div className="text-danger small mt-1">{errores.ciclo}</div>}
                </div>
            )}

            <ElegirPregunta
              preguntasSeleccionadas={preguntasSeleccionadas}
              setPreguntasSeleccionadas={setPreguntasSeleccionadas}
              rolSeleccionado={rolSeleccionado}
              error={errores.preguntas}
              onCrearFormulario={manejarCrearFormulario}
            />
          </CForm>
        </CCardBody>
      </ShadowedCard>
    </>
  );
}

export default CrearPlantillaFormulario;