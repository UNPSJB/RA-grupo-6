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

    }, [url_base]);

    useEffect( () => {
        setRespuestasMostradas(respuestasFormulario?.respuestas)
    }, [respuestasFormulario])

    const numeroPreguntas = respuestasFormulario?.respuestas.length? respuestasFormulario?.respuestas.length : 0;
    const respuestasAbiertas = respuestasFormulario?.respuestas.filter((respuesta) => respuesta.pregunta.tipo == EnumTipoPregunta.abierta)
    const respuestasCerradas = respuestasFormulario?.respuestas.filter((respuesta) => respuesta.pregunta.tipo == EnumTipoPregunta.cerrada)
    const [respuestasMostradas, setRespuestasMostradas] = useState(respuestasFormulario?.respuestas)

    const [activo, setActivo] = useState("1")
    const estiloBotonActivo = {backgroundColor: "#0d6efd", border: "none", color:"#ffffffff"}
    const estiloBotonInactivo = {backgroundColor: "#E8ECEF", border: "none", color:"#5A5B65"}



    return(        
        
        <Container className="pb-5 w-50 mt-5 ">

            <div className="title p-4 pb-0 border rounded-3">
                <h2 > Tus respuestas </h2>
                <hr />
                <div className="d-flex justify-content-between ms-2 me-2 mb-3">

                    <p className="ms-2 mb-1">
                        <span className="" style={{color: "grey", fontSize:"13px"}}> ASIGNATURA </span> 
                        <br />
                        {respuestasFormulario?.materia.nombre + " "}                 
                    </p>
                    
                    <p className="ms-2 mb-0">
                        <span style={{color: "grey", fontSize:"13px"}}> COMPLETADA </span>
                        <br />
                        {new Date(respuestasFormulario?.fecha_envio || new Date()).toLocaleDateString("es-AR", {day: "numeric", month: "long", year: "numeric"})}
                    </p>

                    <p className="ms-2 mb-0">
                        <span style={{color: "grey", fontSize:"13px"}}> TOTAL RESPUESTAS </span>
                        <br />
                        {numeroPreguntas} preguntas
                    </p>

                </div>
            </div>

            <Stack className="pt-3 pb-3 mb-2 mt-2" direction="horizontal" gap={4}>
                <Button style={activo === "1"? estiloBotonActivo : estiloBotonInactivo } onClick={() => {setRespuestasMostradas(respuestasFormulario?.respuestas); setActivo("1")}}> Todas ({numeroPreguntas}) </Button>

                <Button style={activo === "2"? estiloBotonActivo : estiloBotonInactivo } onClick={() => {setRespuestasMostradas(respuestasAbiertas); setActivo("2")}}> Abiertas ({respuestasAbiertas?.length}) </Button>
                
                <Button style={activo === "3"? estiloBotonActivo : estiloBotonInactivo } onClick={() => {setRespuestasMostradas(respuestasCerradas); setActivo("3")}}> Cerradas ({respuestasCerradas?.length}) </Button>
            </Stack>
            
            <div className="mb-4">

                <ListGroup className="d-flex gap-3">

                {respuestasMostradas?.map((respuesta, indice) =>
                    <ListGroupItem className="mb-2 d-flex border rounded align-items-start gap-3 p-3 ">

                        <Badge bg="primary" className="rounded-circle" style={{ width: '30px', height: '30px', fontSize: '1rem', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            {indice + 1}
                        </Badge>

                        <div className="container-fluid me-3">
                            <Badge className="p-2" bg="" style={{backgroundColor: (respuesta.pregunta.tipo == EnumTipoPregunta.abierta)? '#24c798' : '#6284bf'}} >
                                {respuesta.pregunta.tipo === EnumTipoPregunta.abierta ? EnumTipoPregunta.abierta.toLocaleUpperCase() : EnumTipoPregunta.cerrada.toLocaleUpperCase()}
                            </Badge>

                            <h5 className="fw-semibold mb-1 mb-2 mt-2"> {respuesta.pregunta.texto}</h5>

                            {respuesta.pregunta.tipo == EnumTipoPregunta.abierta? 
                                <Row  className="mb-3 mt-2 ms-1 rounded p-3" style={{border: "1px solid #dee2e6", borderLeft: "5px solid #24c798", backgroundColor: "#fbfafe"}} >
                                    
                                    <p className="mb-0">
                                        <span className="" style={{color:"grey", fontSize:"12px"}}> TU RESPUESTA: </span>
                                        <br />
                                        "{respuesta.texto}"
                                    </p>
                                </Row>                            
                            :
                                <Row className="mb-3 mt-2 ms-1 rounded p-3" style={{border: "1px solid #dee2e6", borderLeft: "5px solid #6284bf", backgroundColor: "#fbfafe"}} >
                                    <p className="mb-0 ">
                                        <span className="" style={{color:"grey", fontSize:"12px"}}> TU RESPUESTA: </span>
                                        <br />
                                        • {respuesta.opcion.texto}
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


