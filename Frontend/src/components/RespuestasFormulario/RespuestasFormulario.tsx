import { useEffect, useState } from "react"
import type { Respuesta, TypeRespuestasFormulario } from "../RespuestasFormulario/RespuestasFormularioTypes";
import { Button, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import RespuestaView from "../Respuesta/RespuestaView";



export function RespuestasFormulario({id_respuestas_formulario} :{id_respuestas_formulario : number}){

    const url_base = `http://127.0.0.1:8000/RespuestasFormulario/${id_respuestas_formulario}`

    const [respuestasFormulario, setRespuestasFormulario] = useState<TypeRespuestasFormulario>()

    const [respuestaElegida, setRespuestaElegida] = useState<Respuesta>({
        texto: "",
        opcion: {id: 0, texto:""},
        pregunta: {  id: 0, texto: "", tipo: "", opciones: []}
    })

    useEffect( () => {

        fetch(url_base)
        .then((response) => response.json())
        .then((data) => setRespuestasFormulario(data))
        .catch(error => console.log(error))
    
    }, []);


    return(

        <div className="container">

            <ListGroup>
                <h2> Tus respuestas </h2>
                
                <ListGroupItem className="rounded">
                    <h3>Respondido por</h3>
                    {respuestasFormulario?.usuario.nombre}
                    {" "}
                    {respuestasFormulario?.usuario.apellido} ({respuestasFormulario?.usuario.email})
                </ListGroupItem>

                <ListGroupItem>
                    <h3>Materia</h3>
                    {respuestasFormulario?.materia.nombre}
                </ListGroupItem>

                <ListGroupItem>
                    <h3>Completada</h3>
                    {respuestasFormulario?.fecha_envio.toString()}
                </ListGroupItem>

            </ListGroup>

            <br />
            
            <div>

                <h3> <i className="fa-regular fa-comment"></i> Preguntas</h3>

                {respuestasFormulario?.respuestas.map((respuesta, indice) =>
                    <>
                        <Row>
                            <Button variant="outline-dark" onClick={() => setRespuestaElegida(respuesta)}className="d-flex justify-content-start flex-wrap">
                                Pregunta {indice + 1}
                                <br />
                                {respuesta.pregunta.texto}

                            </Button>
                        </Row>
                    
                    </>
                )}

            </div>

            
            <RespuestaView respuesta={respuestaElegida} />


            


        </div>

    )
}


