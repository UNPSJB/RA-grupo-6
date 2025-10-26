import { useEffect, useState } from "react"
import { Badge, Button, Container, ListGroup, ListGroupItem, Row, Stack } from "react-bootstrap";
import { EnumTipoPregunta, type TypeRespuestasFormulario } from "../types";
import { useParams } from "react-router-dom";

export function RespuestasFormulario(){

    const { id } = useParams<{ id: string }>();
    const url_base = `http://127.0.0.1:8000/RespuestasFormulario/${id}`

    const [respuestasFormulario, setRespuestasFormulario] = useState<TypeRespuestasFormulario>()

    useEffect( () => {

        fetch(url_base)
        .then((response) => response.json())
        .then((data) => setRespuestasFormulario(data))
        .catch(error => console.log(error))

    }, []);

    useEffect( () => {
        setRespuestasMostradas(respuestasFormulario?.respuestas)
    }, [respuestasFormulario])

    const numeroPreguntas = respuestasFormulario?.respuestas.length? respuestasFormulario?.respuestas.length : 0;
    const respuestasAbiertas = respuestasFormulario?.respuestas.filter((respuesta) => respuesta.pregunta.tipo == EnumTipoPregunta.abierta)
    const respuestasCerradas = respuestasFormulario?.respuestas.filter((respuesta) => respuesta.pregunta.tipo == EnumTipoPregunta.cerrada)
    const [respuestasMostradas, setRespuestasMostradas] = useState(respuestasFormulario?.respuestas)

    return(        
        
        <Container className="pb-5 w-50 mt-5">

            <div className="title mb-4 p-4 pb-0 border-bottom ">
                <h2> Tus respuestas </h2>
                
                <p className="ms-2 mb-1">
                    <i className="fa-solid fa-book"></i> Asignatura: {respuestasFormulario?.materia.nombre + " "}                 
                </p>
                <p className="ms-2 mb-0">
                    <i className="fa-solid fa-calendar"></i> Completada: {new Date(respuestasFormulario?.fecha_envio || new Date()).toLocaleDateString("es-AR", {day: "numeric", month: "long", year: "numeric"})}
                </p>

                <Stack className="pt-3 pb-3 " direction="horizontal" gap={5}>
                    <Button onClick={() => setRespuestasMostradas(respuestasFormulario?.respuestas)}> Todas ({numeroPreguntas}) </Button>
                    <Button onClick={() => setRespuestasMostradas(respuestasAbiertas)}> Abiertas ({respuestasAbiertas?.length}) </Button>
                    <Button onClick={() => setRespuestasMostradas(respuestasCerradas)}> Cerradas ({respuestasCerradas?.length}) </Button>
                </Stack>

            </div>
            
            <div className="mb-4">

                <ListGroup className="d-flex gap-3">

                {respuestasMostradas?.map((respuesta, indice) =>
                    <ListGroupItem className="ms-3 me-3 mb-2 d-flex border rounded align-items-start gap-3 p-3 ">

                        <Badge bg="primary" className="rounded-circle" style={{ width: '30px', height: '30px', fontSize: '1rem', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            {indice + 1}
                        </Badge>

                        <div>
                            <Badge bg={respuesta.pregunta.tipo?.toLowerCase() === EnumTipoPregunta.abierta ? 'success' : 'info'}>
                                {respuesta.pregunta.tipo === EnumTipoPregunta.abierta ? EnumTipoPregunta.abierta : EnumTipoPregunta.cerrada}
                            </Badge>

                            <h5 className="fw-semibold mb-1 mb-2 mt-2"> {respuesta.pregunta.texto}</h5>

                            {respuesta.pregunta.tipo == EnumTipoPregunta.abierta? 
                                <Row  className="mb-3 mt-2 ms-1 rounded p-2 " style={{border: "1px solid #dee2e6", borderLeft: "5px solid #6284bf", backgroundColor: "#fbfafe"}} >
                                    
                                    <p className="mb-0">
                                        <span className="" style={{color:"grey", fontSize:"12px"}}> TU RESPUESTA: </span>
                                        <br />
                                        "{respuesta.texto}"
                                    </p>
                                </Row>                            
                            :

                                <Row className="mb-3 mt-2 ms-1 rounded p-2" style={{border: "1px solid #dee2e6", borderLeft: "5px solid #11ba82", backgroundColor: "#fbfafe"}} >
                                    <p className="mb-0 ">
                                        {respuesta.opcion.texto}
                                    </p>
                                </Row>   
                        
                            }
                            
                        </div>


                    </ListGroupItem>
                
                )}

                </ListGroup>
            </div>

        </Container>

    )
}


