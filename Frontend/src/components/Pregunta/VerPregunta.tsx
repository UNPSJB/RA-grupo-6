import { useEffect, useState } from "react";
import type { Opcion } from "../Opcion/OpcionTypes";
import Card from "react-bootstrap/Card"
import { Badge, Button } from "react-bootstrap";
import Menu from "../Menu";


const url_base = 'http://127.0.0.1:8000/preguntas/'

type Pregunta = {
    id: string;
    texto: string;
    opciones: Opcion[];
    tipo: string;
};

const eliminarPregunta = ({eleccion} : {eleccion : string}) =>{

    window.location.href =`/EliminarPregunta/${eleccion}`

}
const editarPregunta = ({eleccion} : {eleccion : string}) =>{

    window.location.href =`/EditarPregunta/${eleccion}`

}

function VerPregunta(){
    const [preguntas, setPreguntas] = useState<Pregunta[]>([])
    
    useEffect(() => {
        fetch(url_base)
        .then(response => response.json())
        .then((data) => setPreguntas(data))
        .catch(error => console.log(error));
    }, []);
    return(
        <>
        <Menu></Menu>

        <div className="container text-start mt-4"></div>

        <div className="container">
            <div className="vertical-line text-start">
                <h3 className="mb-3">Banco de Preguntas</h3>
                <p className="text-muted ">Gestiona todas las preguntas del sistema</p>
            </div>
            
            <div className="container mt-4 p-0 d-flex flex-wrap justify-content-start" >

                {preguntas.map((pregunta) => (
                    <Card style={{width: '20rem'}}>
                        <Card.Body className="d-flex flex-column gap-3">
                            <Card.Title className="d-flex justify-content-between align-items-center">
                                <div className="d-flex gap-3">
                                    <Badge
                                        bg="primary"
                                        className="rounded-circle p-2 d-inline-flex justify-content-center align-items-center"
                                        style={{ minWidth:'30px', minHeight: '30px'}}
                                        >
                                        {pregunta.id} 
                                    </Badge>

                                    <Badge
                                        bg="success"
                                        className="rounded-5 p-2.5 d-inline-flex justify-content-center align-items-center"
                                        style={{ minWidth:'30px', minHeight: '25px'}}
                                        >
                                        {pregunta.tipo}
                                    </Badge>
                                </div>
                                
                                <div className='d-flex gap-2 '>
                                    <Button size="sm" className="bg-transparent border-secondary" onClick={() => editarPregunta({eleccion: pregunta.id})}> 
                                        <i className="fa-solid fa-pencil" style={{ fontSize: '18px', color: 'black' }}></i>
                                    </Button>

                                    <Button size="sm" className="bg-transparent border-secondary" onClick={() => eliminarPregunta({eleccion: pregunta.id})}> 
                                        <i className="fa-solid fa-trash" style={{ fontSize: '18px', color: "rgba(163, 32, 52, 1)" }}></i>
                                    </Button>
                                </div>

                            </Card.Title>

                            <Card.Subtitle className="d-flex"> {pregunta.texto} </Card.Subtitle>

                            {/* Muestro las opciones solo si es pregunta cerrada  */}
                            {
                                pregunta.tipo.toLocaleLowerCase() == "cerrada" &&
                                
                                <Card.Text className="d-flex gap-2 flex-wrap">
                                    {pregunta.opciones.map((op) => (
                                        <span className="border rounded-3 p-2 d-inline-flex justify-content-center align-items-center" key={op.id}>
                                            {op.texto}
                                        </span>
                                    ))}
                                </Card.Text>

                            }
                        </Card.Body>
                    </Card>

            ))} 
            </div>
        </div>
    </>
    );
};


export default VerPregunta;