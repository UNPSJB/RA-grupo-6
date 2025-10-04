
import { useEffect, useState } from "react"
import { ListGroup } from "react-bootstrap";
import Form from "react-bootstrap/Form"
import type { TipoPregunta } from "./PreguntaTypes";


function RespuestaCerradaView({pregunta_id} : {pregunta_id : number}){
    
    const url_base = "http://127.0.0.1:8000/preguntas/" + pregunta_id;

    const [pregunta, setPregunta] = useState<TipoPregunta>({
        id: 0,
        texto: "",
        opciones: [],
        tipo: null
    });

    useEffect(() => {

    fetch(url_base) 

        .then(response => response.json())
        .then((data) => setPregunta(data))
        .catch(error => console.log(error))
    }, []);


    return(
        
        <div className={`question-$pregunta.id`}>
            
            <h3>{pregunta.texto}</h3>
            <Form.Label> Seleccione una opcion... </Form.Label>

                {pregunta.opciones.map((opcion) =>

                    <ListGroup.Item > 
                        <Form.Check type="radio" name={`answers-question-${pregunta.id}`} label={opcion.texto}/>
                    </ListGroup.Item>    
                    
                )}
        </div>
    )
    
}

export default RespuestaCerradaView;