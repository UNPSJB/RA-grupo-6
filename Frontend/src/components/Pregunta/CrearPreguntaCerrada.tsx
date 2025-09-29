import { useEffect, useState } from "react";
import type { Opcion } from "../Opcion/OpcionTypes";

import OpcionList from "../Opcion/OpcionList";
import { Button, Col } from "react-bootstrap";

import IngresarPregunta from "./IngresarPregunta";

type PreguntaCerrada = {
  texto: string;
  opciones: number[];
  tipo: string;
};


function CrearPreguntaCerrada() {

  //Definicion de constantes
  const [preguntaCerrada, setPreguntaCerrada] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [TextoMostrar, setTextoMostrar] = useState("Mostrar");
  const[opcionesSeleccionadas, setOpcionesSeleccionadas] = useState<Opcion[]>([])

  const crearPregunta = () => {
    const seleccionadas = opcionesSeleccionadas.map(op => op.id);

    // if (!preguntaCerrada.trim() || seleccionadas.length === 0) {
    //   alert("Escribe la pregunta y selecciona al menos una opción");
    //   return;
    // }

    const nuevaPregunta: PreguntaCerrada = {
      texto: preguntaCerrada,
      opciones: seleccionadas,
      tipo: "Cerrada",
    };

    fetch("http://127.0.0.1:8000/preguntas/cerrada", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaPregunta),
    }).then(() => {
      setPreguntaCerrada("");
      setOpcionesSeleccionadas([]);
    });
  };

  function cambiarMostrar() {
    setMostrar(!mostrar);
    
    mostrar? setTextoMostrar("Mostrar") : setTextoMostrar("Ocultar")
  
  }

  const [texto, setTexto] = useState("")

  return (
    <div>

      <IngresarPregunta texto={texto} setTexto={setTexto}></IngresarPregunta>
    
      <div className="options mb-3 ">
        <h3>Gestion de opciones </h3>
        
        <Button className="show-options bg-transparent text-dark border-0 fw-semibold d-flex align-items-center gap-2" onClick={cambiarMostrar}> <i className="fa-solid fa-gear text-dark" style={{ fontSize: '18px', color: 'white' }} > </i> {TextoMostrar} </Button>
      </div>

      {mostrar && <OpcionList opcionesSeleccionadas={opcionesSeleccionadas} setOpcionesSeleccionadas={setOpcionesSeleccionadas}/>}

      <Col className="d-flex justify-content-center">
        <Button className="mt-3" onClick={crearPregunta}>Crear Pregunta</Button>
      </Col>
    </div>
  );
}

export default CrearPreguntaCerrada;