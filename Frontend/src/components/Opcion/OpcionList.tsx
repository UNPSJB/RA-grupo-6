import { useEffect, useState } from "react";
import type { Opcion } from "./OpcionTypes";
import CrearOpcion from "./OpcionCreate";
import {Col, Form, ListGroup, Row} from "react-bootstrap"
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

            {/* Se renderiza si existe al menos una opcion */}
            { opciones.length >= 1 &&
                
                <ListGroup variant="flush" className="border border-dark p-3 rounded">
                    
                    {opciones.map((opcion) => (
                        
                        <ListGroup.Item key={opcion.id} className="border border-dark rounded mt-3">
                            <Row className="d-flex align-items-center">
                                <Col>
                                    <Form.Check type="checkbox" id={`opcion-${opcion.id}`} onChange={() => agregarOpcionSeleccionada(opcion)} label={opcion.texto }/> 
                                </Col>
                                <Col className="d-flex justify-content-end">
                                    <EliminarOpcion opcionId={opcion.id} onDeleted={eliminarOpcion}/> 
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        
                    ))}

                </ListGroup>
            }            

            {/* { OpcionesSeleccionadas.length >= 1 &&
                
                <ListGroup className="mb-5 mt-5">
                    <h4>Opciones Seleccionadas</h4>
                    {OpcionesSeleccionadas.map((opcionSeleccionada) =>

                        <ListGroup.Item key={opcionSeleccionada.id}>
                            {opcionSeleccionada.texto}
                        </ListGroup.Item>
                    )}

                </ListGroup>
            } */}

        </>


    )


}

export default OpcionList;