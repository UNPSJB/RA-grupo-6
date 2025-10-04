import { useState } from "react";
import type { Opcion } from "../Opcion/OpcionTypes";

import OpcionList from "../Opcion/OpcionList";
import { Button, Col } from "react-bootstrap";

import IngresarPregunta from "./IngresarPregunta";

type PreguntaCerrada = {
  texto: string;
  opciones: number[];
  tipo: string;
};

type Props = {
  manejarPestaña: () => void;
  refrescarPreguntas: () => void;
};


function CrearPreguntaCerrada({manejarPestaña, refrescarPreguntas}: Props) {

  //Definicion de constantes
  const [texto, setTexto] = useState("")
  const [mostrar, setMostrar] = useState(false);
  const [TextoMostrar, setTextoMostrar] = useState("Mostrar");
  const[opcionesSeleccionadas, setOpcionesSeleccionadas] = useState<Opcion[]>([])

  const crearPregunta = () => {
    const seleccionadas = opcionesSeleccionadas.map(op => op.id);

    const nuevaPregunta: PreguntaCerrada = {
      texto: texto,
      opciones: seleccionadas,
      tipo: "Cerrada",
    };

    fetch("http://127.0.0.1:8000/preguntas/cerrada", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaPregunta),
    }).then(() => {
      setTexto("");
      setOpcionesSeleccionadas([]);
      refrescarPreguntas();
      manejarPestaña();
    });
  };

  function cambiarMostrar() {
    setMostrar(!mostrar);
    
    mostrar? setTextoMostrar("Mostrar") : setTextoMostrar("Ocultar")
  
  }

  return (
    <div>
      <IngresarPregunta texto={texto} setTexto={setTexto} />

      <div  className="mb-3 d-flex justify-content-between align-items-center">
        <h6>Gestión de opciones</h6>
        <Button
          className="show-options bg-transparent text-dark border-0 fw-semibold d-flex align-items-center gap-2"
          onClick={cambiarMostrar}
        >
          <i className="fa-solid fa-gear text-dark" style={{ fontSize: "13px" }} />
          {TextoMostrar}
        </Button>
      </div>

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
  );
}

export default CrearPreguntaCerrada;