import type { Respuesta } from "../RespuestasFormulario/RespuestasFormularioTypes";
import { Badge, Col, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import { EnumTipoPregunta } from "./PreguntaTypes";

type RespuestaViewProps = {
    respuesta: Respuesta,
    numeroPregunta: number,
    cantidadPreguntas: number,
}


function RespuestaView({respuesta, numeroPregunta, cantidadPreguntas} : RespuestaViewProps){

    return(
        <>            
            {respuesta.pregunta.tipo == EnumTipoPregunta.cerrada?
            
            <ListGroupItem className="p-3 mb-3 ms-2 me-2">
                <h4>{respuesta.pregunta.texto}</h4>
                
                <p>
                    Tu Respuesta
                </p>
                <div className="border boder-dark p-3 bg-success rounded d-flex align-content-center mb-3">
                    <p className="fw-bold mb-0">
                        {respuesta.opcion.texto}
                    </p>
                </div>

                <p>
                    Todas las opciones disponibles
                </p>
                
                <ListGroup>
                    <Row className="g-3 ">
                        {respuesta.pregunta.opciones.map((opcion) => (
                        <Col md={6} >
                            <ListGroupItem className="border border-dark rounded">
                                <p className="mb-0 ms-2">
                                    {opcion.texto}
                                </p>
                            </ListGroupItem>
                        </Col>
                        ))}
                    </Row>


                </ ListGroup>

            </ListGroupItem>
            
            :
                <div className="p-3 gap-3 d-flex align-items-center mb-3 ms-2 me-2">
                    <Row className="d-flex gap-3">
                        <Col xs={12} className="d-flex gap-3 align-items-start justify-content-between">
                            <h4>{respuesta.pregunta.texto}</h4>
                            <Badge bg="secondary" className="p-2 ">
                                <p className="m-0">{numeroPregunta} de {cantidadPreguntas}</p>
                            </Badge>
                        </Col>
                        <Col xs={12} className="d-flex gap-3 align-items-start">
                            <Badge bg="secondary" className="p-3">
                                <i  style={{ fontSize: '24px' }} className="fa-regular fa-lightbulb"></i>
                            </Badge>
                            <p className="m-0 fs-4">
                                {respuesta.texto}
                            </p>
                        </Col>
                    </Row>
                </div>
                
            }
        </>


    )

}

export default RespuestaView;