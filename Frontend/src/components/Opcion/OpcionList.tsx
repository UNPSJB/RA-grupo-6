import { useEffect, useState } from "react";
import type { Opcion } from "./OpcionTypes";
import CrearOpcion from "./OpcionCreate";
import { Form, ListGroup} from "react-bootstrap"
import EliminarOpcion from "./OpcionDelete";

const url_base = 'http://127.0.0.1:8000/opciones/'

type Props ={
    opcionesSeleccionadas: Opcion[];
    setOpcionesSeleccionadas: (opcionesSeleccionadas : Opcion[]) => void;
}

function OpcionList({opcionesSeleccionadas, setOpcionesSeleccionadas} : Props){

    const [opciones, setOpciones] = useState<Opcion[]>([])

    // const[OpcionesSeleccionadas, setOpcionesSeleccionadas] = useState<Opcion[]>([])
    
    const agregarOpcion = (nueva: Opcion) => {
        setOpciones((prev) => [...prev, nueva]);
    };


    const eliminarOpcion = (id: number) => {
        const nuevasOpciones = opciones.filter((op) => op.id !== id);
        setOpciones(nuevasOpciones);
    };

    function agregarOpcionSeleccionada(opcion : Opcion) {

        if(opcionesSeleccionadas.includes(opcion)){
            setOpcionesSeleccionadas(opcionesSeleccionadas.filter(opcionSeleccionada => opcionSeleccionada !== opcion))
        }
        else{
            setOpcionesSeleccionadas([...opcionesSeleccionadas, opcion]);

        }
        
    }

    useEffect(() => {
        fetch(url_base)
        .then(response => response.json())
        .then((data) => setOpciones(data))
        .catch(error => console.log(error));
    }, []);

    return(
    <>
      <CrearOpcion onCrear={agregarOpcion} />

      {opciones.length > 0 && (
        <ListGroup variant="flush" className="border p-3 rounded">
          <p className="text-muted mb-3" style={{ fontSize: "0.875rem" }}>
            Selecciona las opciones disponibles:
          </p>
          {opciones.map((opcion) => (
            <ListGroup.Item
              key={opcion.id}
              className="d-flex align-items-center justify-content-between mb-2 border rounded p-2"
            >
              <Form.Check
                type="checkbox"
                id={`opcion-${opcion.id}`}
                label={opcion.texto}
                checked={opcionesSeleccionadas.some((o) => o.id === opcion.id)}
                onChange={() => agregarOpcionSeleccionada(opcion)}
              />
              <EliminarOpcion opcionId={opcion.id} onDeleted={eliminarOpcion} />
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>

    )
}

export default OpcionList;