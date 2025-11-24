import {useState, useEffect } from "react";
import type { Opcion } from "../types";

import OpcionList from "../Opcion/OpcionList";
import { Button, Col, Form } from "react-bootstrap";
import { EnumTipoPregunta } from "../types";
import IngresarPregunta from "./IngresarPregunta";
import ElegirGrupoPregunta from "../GrupoPregunta/GrupoPregunta";
import type { PreguntaCerrada } from "../types";
import ELegirRol from "../Rol/ElegirRol";
import type { ErrorPreguntaCerrada } from "../types";
import ElegirGrupoCuadro from "../GrupoCuadro/ElegirGrupoCuadro";

type Props = {
  manejarPestaña: () => void;
  refrescarPreguntas: () => void;
};


function CrearPreguntaCerrada({manejarPestaña, refrescarPreguntas}: Props) {

  const [texto, setTexto] = useState("")
  const [mostrar, setMostrar] = useState(false);
  const [TextoMostrar, setTextoMostrar] = useState("Mostrar");
  const [opcionesSeleccionadas, setOpcionesSeleccionadas] = useState<Opcion[]>([])
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(0)
  const [rolSeleccionado, setRolSeleccionado] = useState<string>("")
  const [estadisticaSeleccionada, setEstadisticaSeleccionada] = useState<boolean>(true)
  const [multiplesRespuestas, setMultiplesRespuestas] = useState<boolean>(false);
  const [errores, setErrores] = useState<ErrorPreguntaCerrada>({});
  const [grupoCuadroSeleccionado, setGrupoCuadroSeleccionado] = useState<number | null>(null)
  const [ordenEnGrupo, setOrdenEnGrupo] = useState<number>(1);
  const [obligatoria, setObligatoria] = useState<boolean>(false);

  const crearPregunta = () => {
    const nuevosErrores: ErrorPreguntaCerrada = {};

    let erroresTotales = 0;

    if (!texto.trim()){
      nuevosErrores.texto = "El texto de la pregunta es obligatorio";
      erroresTotales++;
    };
    if (grupoSeleccionado === 0){
      nuevosErrores.grupo = "Debes seleccionar un grupo";
      erroresTotales++;
    };
    if (opcionesSeleccionadas.length < 2){ 
      nuevosErrores.opciones = "Debes agregar al menos dos opciones";
      erroresTotales++;
    };
    if (!rolSeleccionado) {
      nuevosErrores.rol = "Debes seleccionar un rol";
      erroresTotales++;
  }

    setErrores(nuevosErrores);

    if (erroresTotales > 0) return;


    const seleccionadas = opcionesSeleccionadas.map(op => op.id);

    const nuevaPregunta: PreguntaCerrada = {
      texto: texto,
      opciones: seleccionadas,
      tipo: EnumTipoPregunta.cerrada,
      grupo_pregunta_id: grupoSeleccionado,
      estadistica: estadisticaSeleccionada,
      rol_id: rolSeleccionado,
      multiple_respuestas: multiplesRespuestas,
      grupo_cuadro_id: grupoCuadroSeleccionado,
      orden_en_grupo: grupoCuadroSeleccionado? ordenEnGrupo: null,
      obligatoria: obligatoria,
    };

    fetch("http://127.0.0.1:8000/preguntas/cerrada", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaPregunta),
    }).then(() => {
      setTexto("");
      setOpcionesSeleccionadas([]);
      setGrupoSeleccionado(0);
      setRolSeleccionado("");
      setEstadisticaSeleccionada(true);
      setMultiplesRespuestas(false);
      setGrupoCuadroSeleccionado(null);
      setOrdenEnGrupo(1);
      setObligatoria(false);
      setErrores({});
      refrescarPreguntas();
      manejarPestaña();
    });
  };

  useEffect(() => {
    const nuevosErrores = { ...errores };
    let huboCambios = false;

    if (texto.trim() && nuevosErrores.texto) {
      delete nuevosErrores.texto;
      huboCambios = true;
    }

    if (grupoSeleccionado !== 0 && nuevosErrores.grupo) {
      delete nuevosErrores.grupo;
      huboCambios = true;
    }

    if (rolSeleccionado && nuevosErrores.rol) {
      delete nuevosErrores.rol;
      huboCambios = true;
    }

    if (opcionesSeleccionadas.length >= 2 && nuevosErrores.opciones) {
      delete nuevosErrores.opciones;
      huboCambios = true;
    }

    if (huboCambios) {
      setErrores(nuevosErrores);
    }
  }, [texto, grupoSeleccionado, rolSeleccionado, opcionesSeleccionadas, errores]);

  function cambiarMostrar() {
        const nuevoMostrar = !mostrar;
        setMostrar(nuevoMostrar);
        
        if (nuevoMostrar) {
            setTextoMostrar("Ocultar");
        } else {
            setTextoMostrar("Mostrar");
        }
  }

  return (
    <div>

      <div className="contenedor-scroll"style={{maxHeight: '400px', 
          overflowY: 'auto',  padding: '1.25rem'}}>
      <IngresarPregunta texto={texto} setTexto={setTexto} error={errores.texto} label="Contenido de la pregunta"/>

      <ElegirGrupoPregunta selectedGrupo={grupoSeleccionado} onChangeGrupo={setGrupoSeleccionado} error={errores.grupo}></ElegirGrupoPregunta>

      <ELegirRol selectedRol={rolSeleccionado} onChangeRol={setRolSeleccionado} error={errores.rol}></ELegirRol>



      <Form.Group className="mb-3 text-start mt-3" >
        <Form.Label className="fw-semibold mb-3">Estadisticas</Form.Label>
        <div className="d-flex align-items-center justify-content-between border rounded p-2 px-3 shadow-sm">
          <div className="d-flex flex-column" style={{fontSize:"0.9rem"}}>
              <span className="fw-semibold">Incluir en estadísticas</span>
              <small className='text-muted' style={{fontSize: "0.75rem"}}>
                Para preguntas de las que se quiera sacar estadísticas
              </small>
          </div>
          <Form.Check
            type="switch"
            id="switch-multiples-respuestas"
            checked={estadisticaSeleccionada}
            onChange={(e) => setEstadisticaSeleccionada(e.target.checked)}
          />
        </div>
      </Form.Group>



      <Form.Group className='mb-2 text-start mt-3'>
          <Form.Label className='fw-semibold mb-2'>Configuración</Form.Label>
          <div className='d-flex align-items-center justify-content-between border rounded p-2 px-3 shadow-sm'>
              <div className='d-flex flex-column'>
                  <span className='fw-semibold' style={{fontSize: "0.9rem"}}>
                      Permite múltiples respuestas
                  </span>
                  <small className='text-muted' style={{fontSize: "0.75rem"}}>
                      Para cuadros con varias filas (ej: un docente por fila)
                  </small>
              </div>
              <Form.Check
                  type='switch'
                  id='switch-multiples-respuestas'
                  checked={multiplesRespuestas}
                  onChange={(e) => setMultiplesRespuestas(e.target.checked)}
              />
          </div>
      </Form.Group>

      <div className='d-flex align-items-center justify-content-between border rounded p-2 px-3 shadow-sm mb-3'>
          <div className='d-flex flex-column'>
              <span className='fw-semibold' style={{fontSize: "0.9rem"}}>
                  Respuesta obligatoria
              </span>
              <small className='text-muted' style={{fontSize: "0.75rem"}}>
                  La respuesta será requerida antes de continuar
              </small>
          </div>
                              
          <Form.Check
              type='switch'
              id='switch-pregunta-obligatoria'
              checked={obligatoria}
              onChange={(e) => setObligatoria(e.target.checked)}
          />
      </div>

      <ElegirGrupoCuadro seleccionarGrupo={grupoCuadroSeleccionado} cambiarGrupo={setGrupoCuadroSeleccionado}/>

      {grupoCuadroSeleccionado && (
          <Form.Group className='mb-3 text-start'>
              <Form.Label className='fw-semibold'>Orden en el grupo</Form.Label>
              <Form.Control
                  type='number'
                  min={0}
                  value={ordenEnGrupo}
                  onChange={(e) => setOrdenEnGrupo(parseInt(e.target.value) || 0)}
              />
              <Form.Text className='text-muted'>
                  Define el orden de esta pregunta dentro del cuadro (0,1,2..)
              </Form.Text>
          </Form.Group>
      )}

      <Form.Group className="mb-4 mt-3 text-start">
        <div className="d-flex justify-content-between align-items-center">
          <h6>Gestión de opciones</h6>
          <Button
            className="show-options bg-transparent border-0 fw-semibold d-flex align-items-center gap-2"
            onClick={cambiarMostrar}
            >
            <i className="fa-solid fa-gear text-dark" style={{ fontSize: "13px" }} />
            {TextoMostrar}
          </Button>
        </div>
        {errores.opciones && <div style={{ color: "#dc3545", fontSize: "0.85rem", marginTop: "0.25rem" }}>{errores.opciones}</div>}
      </Form.Group>


      {mostrar && (
        <OpcionList
        opcionesSeleccionadas={opcionesSeleccionadas}
        setOpcionesSeleccionadas={setOpcionesSeleccionadas}
        />
      )}
      

      <Col className="d-flex justify-content-center">
        <Button className="mt-3" onClick={crearPregunta} size="sm">
          Crear Pregunta
        </Button>
      </Col>
      </div>
    </div>
  );
}

export default CrearPreguntaCerrada;