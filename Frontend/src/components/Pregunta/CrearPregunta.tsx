import CrearPreguntaAbierta from "./CrearPreguntaAbierta";
import CrearPreguntaCerrada from "./CrearPreguntaCerrada";
import { useState } from "react";
import { Form, Col} from 'react-bootstrap'
import Menu from "../Menu";


import "./pregunta.css"

function CrearPregunta(){


    const [checked, setChecked] = useState(true);

    return(

    <>
        <Menu></Menu>

        <div className="container text-start mt-4"></div>

        <div className="container text-start">
            <div className="vertical-line">
                <h3 className="mb-3">Crear Nueva Pregunta</h3>
                <p className="text-muted">Seleccione el tipo de pregunta a crear</p>
            </div>

            <Col className="d-flex justify-content-center">
                <Form.Label className="switch">
                    <Form.Control 
                        type="checkbox" 
                        onChange={() => setChecked(!checked)}    
                        />

                    <span> Abierta </span>
                    <span> Cerrada </span>
                </Form.Label>
            </Col>
        </div>
        
        {checked? <div className="container"> <CrearPreguntaAbierta/> </div> : <div className="container"><CrearPreguntaCerrada/> </div>}
        
    </>

    )

}


export default CrearPregunta;