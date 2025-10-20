
import { Badge, Container } from "react-bootstrap"
import type { PlantillaFormulario } from "./types"
import { useEffect, useState } from "react"

// export function VerPorcentajes({plantilla_formulario} : {plantilla_formulario : PlantillaFormulario} ){
    
export function VerPorcentajes({id_instrumento} :{id_instrumento : number}){

    const [instrumento, setInstrumento] = useState<PlantillaFormulario>()

    const url_base = `http://127.0.0.1:8000/instrumentos/${id_plantilla_formulario}/detail`

    useEffect( () => {

        fetch(url_base)
        .then((response) => response.json())    
        .then((data) => setInstrumento(data))
        .catch((err) => console.log(err))
        
    })



    let preguntas_agrupadas = new Map() 
    
    
    return(
        <Container>


            <h3><i className="fa-solid fa-graduation-cap"></i> Respuestas de los estudiantes</h3>
        {plantilla_formulario?.preguntas.map((pregunta) => 
        <>
            <Badge className="p-2">
                <p className="mb-0">
                    {pregunta.tipo}
                </p>
            </Badge>
            
            <p>
                {pregunta.texto}
            </p>
            
            {/* <Badge>
                <p>
                    {pregunta.grupo.letra}
                </p>
            </Badge> */}
        </>
            
            )
        }

        </Container>
    )




}