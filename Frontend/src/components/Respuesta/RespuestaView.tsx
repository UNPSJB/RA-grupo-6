import { useEffect, useState } from "react";
import type { Pregunta } from "../Pregunta/PreguntaTypes";
import type { Respuesta } from "../RespuestasFormulario/RespuestasFormularioTypes";
import { ListGroupItem } from "react-bootstrap";


function RespuestaView({respuesta}: {respuesta : Respuesta}){

    const [pregunta, setPregunta] = useState<Pregunta>()

    const url_base_pregunta = `http://127.0.0.1:8000/preguntas/${respuesta.pregunta_id}`

    useEffect(()=>{
        fetch(url_base_pregunta)
        .then((response) => response.json())
        .then((data) => setPregunta(data))
        .catch(error => console.log(error))

    }, [])

    const url_base_opcion = `http://127.0.0.1:8000/opciones/${respuesta.opcion_id}`

    const [opcion, setOpcion] = useState<Pregunta>()

    useEffect(()=>{
            fetch(url_base_opcion)
            .then((response) => response.json())
            .then((data) => setOpcion(data))
            .catch(error => console.log(error))

        }, [])




    return(
        <>
            <ListGroupItem>
                {pregunta?.texto}
            </ListGroupItem>

            <ListGroupItem>
            {
                opcion? opcion.texto : respuesta.texto
            }
            </ListGroupItem>

        </>


    )

}

export default RespuestaView;