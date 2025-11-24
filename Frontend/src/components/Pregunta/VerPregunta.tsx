import { useEffect, useState } from "react";
import EliminarPregunta from "./EliminarPregunta";
import { EnumTipoPregunta } from "../types";
import ModificarPregunta from "./ModificarPregunta";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardSubtitle,
  CCardText,
  CCardTitle,
  CSpinner,
} from "@coreui/react";

const url_base = 'http://127.0.0.1:8000/preguntas/todos';

import type { Pregunta } from "../types";

function VerPregunta() {
    const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(url_base)
            .then(response => response.json())
            .then((data) => {
                setPreguntas(data);
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setError("No se pudieron cargar las preguntas.");
                setLoading(false);
            });
    }, []);

    const handleDeleted = (id: string) => {
        setPreguntas(prev => prev.filter(p => p.id !== Number(id)));
    };

    const handleEdited = (preguntaActualizada: Pregunta) => {
        setPreguntas(prev =>
            prev.map(p => (p.id === preguntaActualizada.id ? preguntaActualizada : p))
        );
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <CSpinner />
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <>
            <div className="mb-4">
                <h3>Banco de Preguntas</h3>
                <p className="text-medium-emphasis">Gestiona todas las preguntas del sistema</p>
            </div>
            <div className="d-flex flex-wrap justify-content-start gap-3">
                {preguntas.map((pregunta) => (
                    <CCard style={{ width: '30rem' }} key={pregunta.id}>
                        <CCardBody className="d-flex flex-column gap-3">
                            <CCardTitle className="d-flex justify-content-between align-items-center">
                                <div className="d-flex gap-2 align-items-center">
                                    <CBadge
                                        color="primary"
                                        shape="rounded-circle"
                                        className="d-inline-flex justify-content-center align-items-center"
                                        style={{ width: '30px', height: '30px' }}
                                    >
                                        {pregunta.id}
                                    </CBadge>

                                    <CBadge color="success" shape="rounded-pill">
                                        {pregunta.tipo}
                                    </CBadge>
                                </div>

                                <div className='d-flex gap-2'>
                                    {pregunta.puede_modificarse && (
                                        <ModificarPregunta pregunta={pregunta} onEditar={handleEdited}/>
                                    )}
                                    {pregunta.puede_eliminarse && (
                                        <EliminarPregunta preguntaId={pregunta.id} onDeleted={handleDeleted} />
                                    )}
                                </div>
                            </CCardTitle>

                            <CCardSubtitle className="text-medium-emphasis">{pregunta.texto}</CCardSubtitle>

                            {pregunta.tipo === EnumTipoPregunta.cerrada &&
                                <CCardText as="div">
                                    <div className="d-flex flex-column gap-2">
                                        {pregunta.opciones.map((op) => (
                                            <div className="border rounded-2 p-2" key={op.id}>
                                                {op.texto}
                                            </div>
                                        ))}
                                    </div>
                                </CCardText>
                            }
                        </CCardBody>
                    </CCard>
                ))}
            </div>
        </>
    );
}

export default VerPregunta;