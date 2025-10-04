import { useEffect, useState } from "react";
import type { TipoPregunta } from "./PreguntaTypes";
import { EnumTipoPregunta } from "./PreguntaTypes";
import { Button, Form, ListGroup } from "react-bootstrap";
import RespuestaCerradaView from "./RespuestaCerradaView";


function ResponderPreguntas(){

    const url_base = "http://127.0.0.1:8000/preguntas/"

    const [preguntas, setPreguntas] = useState<TipoPregunta[]>([])

    useEffect(()=> {

        fetch(url_base)
        .then(response => response.json())
        .then((data) => setPreguntas(data))
        .catch(err => console.log(err))
    })

    return(
        <>
            <Form>
                {preguntas.map((pregunta) =>
                    pregunta.tipo == EnumTipoPregunta.cerrada &&
                    <ListGroup>
                        <RespuestaCerradaView pregunta_id ={pregunta.id}  />
                    </ListGroup>

                )}
                
                <Button variant="primary" type="submit">
                    Enviar Respuestas
                </Button>
            </Form>
        </>
    )
}

export default ResponderPreguntas;