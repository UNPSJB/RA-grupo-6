import { useEffect, useState } from "react"
import type { TypeRespuestasFormulario } from "../RespuestasFormulario/RespuestasFormularioTypes";
import { ListGroup } from "react-bootstrap";
import RespuestaView from "../Respuesta/RespuestaView";



export function RespuestasFormulario({id_respuestas_formulario} :{id_respuestas_formulario : number}){

    const url_base = `http://127.0.0.1:8000/RespuestasFormulario/${id_respuestas_formulario}`

    const [respuestasFormulario, setRespuestasFormulario] = useState<TypeRespuestasFormulario>()

    useEffect( () => {

        fetch(url_base)
        .then((response) => response.json())
        .then((data) => setRespuestasFormulario(data))
        .catch(error => console.log(error))
    
    }, []);


    return(

        <div className="container">
            
            <ListGroup>

            {respuestasFormulario?.respuestas.map((respuesta) =>

                <RespuestaView respuesta={respuesta}></RespuestaView>

            )}


            </ListGroup>

        </div>

    )
}


