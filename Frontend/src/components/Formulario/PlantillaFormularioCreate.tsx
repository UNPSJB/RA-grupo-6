import { useState } from "react";
import {
  CForm,
  CContainer,
  CCard,
  CCardBody,
  CAlert,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody, CFormLabel, CFormInput,
  CCardHeader
} from "@coreui/react";
import ElegirRol from "../Rol/ElegirRol";
import ElegirPregunta from "../Pregunta/ElegirPregunta";
import type { Pregunta } from "../types";
import type { Formulario } from "../types";
import type { ErrorValidacion } from "../types";
import ShadowedCard from "../coreui-components/ShadowedCard";


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
    }, 1000); 
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
            <h4 >
              Crear Nuevo Formulario
            </h4>
            <p className="text-medium-emphasis mb-0">
              Completa los campos para crear el Formulario
            </p>
          </div>
        </CCardHeader>
        <CCardBody className="p-4 p-md-5">
          

          {intentoEnvio && cantidadErrores > 0 && (
            <CAlert color="warning" className="mb-4 d-flex align-items-start gap-2">
              <div>
                <strong>
                  {cantidadErrores} {cantidadErrores === 1 ? 'campo requiere' : 'campos requieren'} tu atención
                </strong>
                <p className="mb-0 mt-1 small">
                  Revisa los campos marcados en rojo antes de continuar
                </p>
              </div>
            </CAlert>
          )}

          <CForm className="d-flex flex-column gap-4">
            <div>
              <CFormLabel className="fw-semibold mb-2">
                Título del Formulario
              </CFormLabel>
              <CFormInput
                type="text"
                value={titulo}
                onChange={(e) => cambiarTitulo(e.target.value)}
                placeholder="Ingrese el título del formulario..."
                invalid={!!errores.titulo}
              />
            {errores.titulo && (
              <div className="text-danger small mt-1">
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
          </CForm>
        </CCardBody>
      </ShadowedCard>
    </>
  );
}

export default CrearPlantillaFormulario;
