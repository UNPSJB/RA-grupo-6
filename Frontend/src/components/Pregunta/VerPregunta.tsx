import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { Badge, Container } from "react-bootstrap";
import EliminarPregunta from "./EliminarPregunta";
import { EnumTipoPregunta } from "../types";
import ModificarPregunta from "./ModificarPregunta";
const url_base = 'http://127.0.0.1:8000/preguntas/';

import type { Pregunta } from "../types";

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

    const handleEdited = (preguntaActualizada: Pregunta) => {
        setPreguntas(prev =>
            prev.map(p => (p.id === preguntaActualizada.id ? preguntaActualizada : p))
         );
    };

    return (
        <>
            <div className="container text-start mt-4"></div>

            <div className="container">
                <div className="vertical-line text-start">
                    <h3 className="mb-3">Banco de Preguntas</h3>
                    <p className="text-muted">Gestiona todas las preguntas del sistema</p>
                </div>
                <Container className="pb-5">

                    <div className="container mt-4 p-0 d-flex flex-wrap justify-content-between">
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
                                            {pregunta.puede_modificarse && (
                                                <ModificarPregunta pregunta={pregunta} onEditar={handleEdited}/>
                                            )}
                                            {pregunta.puede_eliminarse && (
                                                <EliminarPregunta preguntaId={pregunta.id} onDeleted={handleDeleted} />
                                            )}
                                        </div>

                                    </Card.Title>

                                    <Card.Subtitle className="d-flex">{pregunta.texto}</Card.Subtitle>

                                    {pregunta.tipo === EnumTipoPregunta.cerrada &&
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
                </Container>
            </div>
        </>
    );
};

export default VerPregunta;
