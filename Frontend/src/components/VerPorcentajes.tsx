
import { Badge, Button, ListGroup } from "react-bootstrap"
import { useEffect, useState } from "react"
import { EnumTipoPregunta, type GrupoPregunta, type Instrumento, type Pregunta} from "./types"


export function VerPorcentajes({id_instrumento} :{id_instrumento : number}){

    const [instrumento, setInstrumento] = useState<Instrumento>()

    const url_base = `http://127.0.0.1:8000/instrumentos/${id_instrumento}/detail`

    useEffect( () => {

        fetch(url_base)
        .then((response) => response.json())    
        .then((data) => setInstrumento(data))
        .catch((err) => console.log(err))
        
    }, [])

    const [respuestasMostradas, setRespuestasMostradas] = useState<Pregunta[]>([])

    function obtenerCantRespuestas(id_pregunta : number, id_opcion : number){

        const cantRespuestas = instrumento?.respuestas_formulario?.reduce((cantidad, respuestas_formulario) => {
            return cantidad + (respuestas_formulario.respuestas?.filter( (respuesta) => respuesta.pregunta?.id === id_pregunta && respuesta.opcion?.id === id_opcion).length ?? 0);
        }, 0) ?? 0;
        
        return cantRespuestas
    }

    const cantidadRespuestas = instrumento?.respuestas_formulario.length


    function obtenerGrupos(){

        let grupos: GrupoPregunta[] = [];
        let grupos_ids: number[] = [];

        instrumento?.plantilla_formulario.preguntas.map((pregunta) => {
            if(!grupos_ids.includes(pregunta.grupo_pregunta.id)){
                grupos.push(pregunta.grupo_pregunta)
                grupos_ids.push(pregunta.grupo_pregunta.id)
            }}
        )

        return grupos
    
    }

    return(


        <div className="container border rounded p-3">
                <div className="d-flex align-items-center justify-content-between m-3">
                    <h3><i className="fa-solid fa-graduation-cap m-3"></i> Respuestas de los estudiantes </h3>
                    <h3> {instrumento?.plantilla_formulario.preguntas.length} preguntas</h3>
                </div>

                <div className="choose-group d-flex gap-3 m-3">

                    {obtenerGrupos().map((grupo) => 
                        <Button key={grupo.id} onClick={() => setRespuestasMostradas(  instrumento?.plantilla_formulario.preguntas.filter((pregunta) => pregunta.grupo_pregunta.id === grupo.id) ?? [] )}>
                            Grupo {grupo.letra}
                        </Button>
                    )
                }

                </div>

                {respuestasMostradas.map((pregunta) => 
                <ListGroup key={pregunta.id} className="border p-3 mb-3" > 
                    <div className="d-flex gap-3">

                        <Badge className="p-2 align-content-center">
                            {pregunta.grupo_pregunta.letra}#
                        </Badge>

                        <Badge className="p-2 align-content-center">
                            {pregunta.tipo}
                        </Badge>
                    </div>
                    <p className="mb-3 mt-3">
                        {pregunta.texto}
                    </p>

                    {pregunta.tipo == EnumTipoPregunta.cerrada.toLowerCase()? (
                        
                        pregunta.opciones.map((opcion) =>
                            <ListGroup.Item key={opcion.id} className="border rounded p-3 mb-3 d-flex justify-content-between align-items-center">

                                <p className="mb-0">{opcion.texto} </p>
                                <div className="d-flex gap-3">
                                    <p className="mb-0">
                                        ({obtenerCantRespuestas(pregunta.id, opcion.id) ?? 0} respuestas)
                                    </p>
                                <Badge className="p-2">
                                    {((obtenerCantRespuestas(pregunta.id, opcion.id) ?? 0)  * 100) / (cantidadRespuestas? cantidadRespuestas : 1)}%
                                </Badge>
                                </div>
                            </ListGroup.Item>   
                        )
                    )
                        :

                        <p>Respuestas</p>
                    
                    }


                </ListGroup>
                    
                ) 
            } 
            </div>
    )




}