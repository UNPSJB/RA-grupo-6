import { useEffect, useState } from "react";
import type { Opcion } from "../types";
import Card from "react-bootstrap/Card";
import { Badge, Button } from "react-bootstrap";
import EliminarPregunta from "./EliminarPregunta";
import { EnumTipoPregunta } from "../types";
const url_base = 'http://127.0.0.1:8000/preguntas/';

type Pregunta = {
    id: string;  
    texto: string;
    opciones: Opcion[];
    tipo: string;
};

const editarPregunta = ({ eleccion }: { eleccion: string }) => {
    window.location.href = `/EditarPregunta/${eleccion}`;
};

function VerPregunta() {
    const [preguntas, setPreguntas] = useState<Pregunta[]>([]);

    useEffect(() => {
        fetch(url_base)
            .then(response => response.json())
            .then((data) => setPreguntas(data))
            .catch(error => console.log(error));
    }, []);


    const handleDeleted = (id: string) => {
        setPreguntas(prev => prev.filter(p => p.id !== id));
    };

    return (
        <>
            <div className="container text-start mt-4"></div>

            <div className="container">
                <div className="vertical-line text-start">
                    <h3 className="mb-3">Banco de Preguntas</h3>
                    <p className="text-muted">Gestiona todas las preguntas del sistema</p>
                </div>

                <div className="container mt-4 p-0 d-flex flex-wrap justify-content-start">
                    {preguntas.map((pregunta) => (
                        <Card style={{ width: '20rem' }} key={pregunta.id}>
                            <Card.Body className="d-flex flex-column gap-3">
                                <Card.Title className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex gap-3">
                                        <Badge
                                            bg="primary"
                                            className="rounded-circle p-2 d-inline-flex justify-content-center align-items-center"
                                            style={{ minWidth: '30px', minHeight: '30px' }}
                                        >
                                            {pregunta.id}
                                        </Badge>

                                        <Badge
                                            bg="success"
                                            className="rounded-5 p-2.5 d-inline-flex justify-content-center align-items-center"
                                            style={{ minWidth: '30px', minHeight: '25px' }}
                                        >
                                            {pregunta.tipo}
                                        </Badge>
                                    </div>

                                    <div className='d-flex gap-2 '>
                                        <Button size="sm" className="bg-transparent border-secondary" onClick={() => editarPregunta({ eleccion: pregunta.id })}>
                                            <i className="fa-solid fa-pencil" style={{ fontSize: '18px', color: 'black' }}></i>
                                        </Button>

                                        <EliminarPregunta preguntaId={pregunta.id} onDeleted={handleDeleted} />
                                    </div>

                                </Card.Title>

                                <Card.Subtitle className="d-flex">{pregunta.texto}</Card.Subtitle>

                                {pregunta.tipo.toLowerCase() === EnumTipoPregunta.cerrada &&
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
