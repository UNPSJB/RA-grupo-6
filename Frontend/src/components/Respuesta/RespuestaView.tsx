import { useEffect, useState } from "react";
import type { Pregunta } from "../Pregunta/PreguntaTypes";
import type { Respuesta } from "../RespuestasFormulario/RespuestasFormularioTypes";
import { Col, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import { useRef } from "react";
import { EnumTipoPregunta } from "./PreguntaTypes";



function RespuestaView({respuesta}: {respuesta : Respuesta}){

    return(
        <>
            <br />
            <br />

            <h4>Pregunta {0}: {respuesta.pregunta.texto}</h4>
                
            Tu Respuesta
            <div>
                {respuesta.pregunta.texto}
            </div>
            
            {respuesta.pregunta.tipo == EnumTipoPregunta.cerrada ?
            
            <ListGroupItem>


                Todas las opciones disponibles
                
                <ListGroup>
                    <Row className="g-5">
                        {respuesta.pregunta.opciones.map((opcion) => (
                        <Col md={6} >
                            <ListGroupItem>
                                {opcion.texto}
                            </ListGroupItem>
                        </Col>
                        ))}
                    </Row>


                </ ListGroup>

            </ListGroupItem>
            
            :
                <div>
                    {respuesta.texto}
                </div>
            }


        </>


    )

}

export default RespuestaView;