import { Badge, Button, Form} from 'react-bootstrap';
import { EnumTipoPregunta } from '../types';
import type { RespuestaTemporal } from '../types';
import { useState } from 'react';
import { cargarRespuesta } from '../Respuesta/CargarRespuestasIniciales';

type Props = {
    pregunta: any;
    index: number;
    respuesta?: RespuestaTemporal;
    onActualizar: (preguntaId: number, texto?: string, opcionId?: number) => void;
    instrumento_id: number;
};



function PreguntaSimple({ pregunta, index, respuesta, onActualizar, instrumento_id }: Props) {


    const [valor, setValor] = useState(respuesta?.texto? respuesta.texto : "")

    return (
        <div className="mb-4 pb-3">
            <div className="mb-3 d-flex align-items-center gap-3">
                <Badge
                    bg="secondary"
                    className="rounded-circle"
                    style={{
                        width: '35px',
                        height: '35px',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {index + 1}
                </Badge>
                <div className="flex-grow-1">
                    <h5 className="fw-semibold mb-1">{pregunta.texto} {pregunta.obligatoria && (<span style={{ color: "red" }}>*</span>)} </h5>
                    <div className="d-flex gap-2 align-items-center">
                        <Badge bg={pregunta.tipo === EnumTipoPregunta.abierta ? 'success' : 'info'}>
                            {pregunta.tipo}
                        </Badge>
                        {pregunta.pregunta_fuente_id && (
                            <Badge bg="warning" text="dark">
                                <i className="fas fa-link me-1"></i>
                                Autocompletada
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            {pregunta.tipo === EnumTipoPregunta.abierta ? (
                <Form.Control
                    as="textarea"
                    rows={4}
                    value={valor}
                    onChange={(e) => {setValor(e.target.value);  onActualizar(pregunta.id, valor, undefined)}}
                    placeholder="Escriba su respuesta..."
                    className="input-pregunta"
                />
            ) : (
                <Form.Group>
                    {pregunta.opciones?.map((opcion: any) => (
                        <Form.Check
                            key={opcion.id}
                            type="radio"
                            name={`pregunta-${pregunta.id}`}
                            label={opcion.texto}
                            checked={respuesta?.opcion_id === opcion.id}
                            onChange={() => onActualizar(pregunta.id, undefined, opcion.id)}
                            className="mb-2"
                        />
                    ))}
                </Form.Group>
            )}

            {pregunta.pregunta_fuente_id &&
            <div className='text-end mb-1 mt-1'>

                <Button  onClick={() => cargarRespuesta(pregunta, instrumento_id).then(valor => setValor(valor.texto))} style={{border: "none", color:"black", backgroundColor:"transparent"}}> <i className="fa-solid fa-arrow-rotate-left"></i> Actualizar respuestas  </Button>
            </div>
            }
        </div>
    );
}

export default PreguntaSimple;