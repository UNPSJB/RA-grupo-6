import { Alert, Badge, Button, Form} from 'react-bootstrap';
import { EnumTipoPregunta, TipoRespuesta } from '../types';
import type { RespuestaTemporal } from '../types';
import { useState } from 'react';
import { cargarRespuesta } from '../Respuesta/CargarRespuestasIniciales';
import { esTipoRespuestaValido } from '../Funciones';

type Props = {
    pregunta: any;
    index: number;
    respuesta?: RespuestaTemporal;
    onActualizar: (preguntaId: number, texto?: string, opcionId?: number) => void;
    instrumento_id: number;
};

export function getMensajeError(jsonTipoDato: string){

    const valorTipoDato = JSON.parse(jsonTipoDato) 

    let mensaje : string = ""

    switch(valorTipoDato.tipo){

        case(TipoRespuesta.ENTERO):
            mensaje = "Formato inválido. Por favor, ingrese un numero entero."
            break;

        case (valorTipoDato.tipo = TipoRespuesta.DECIMAL):
            mensaje = "Formato inválido. Por favor, ingrese un numero decimal."
            break;

        case(valorTipoDato.tipo = TipoRespuesta.TEXTO):
            mensaje = "Formato inválido. Por favor, ingrese un texto."
            break;
    
        case(valorTipoDato.tipo = TipoRespuesta.RANGO_ENTERO):
            mensaje = `Formato inválido. Por favor, ingrese un numero entero comprendido entre ${valorTipoDato.valor_minimo} y ${valorTipoDato.valor_maximo}.`
            break;
    
        case (valorTipoDato.tipo = TipoRespuesta.RANGO_DECIMAL):
            mensaje = `Formato inválido. Por favor, ingrese un numero decimal comprendido entre ${valorTipoDato.valor_minimo} y ${valorTipoDato.valor_maximo}.`
        break;
    
        default:
            mensaje = "Tipo de dato incorrecto"
    }

    return mensaje
}


function PreguntaSimple({ pregunta, index, respuesta, onActualizar, instrumento_id }: Props) {

    const [valor, setValor] = useState(respuesta?.texto? respuesta.texto : "")
    const [respuestaValida, setRespuestaValida] = useState(true)
    

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
                <>
                    <Form.Control
                        as="textarea"
                        rows={4}
                        value={valor}
                        onChange={(e) => {setValor(e.target.value); pregunta.tipo_respuesta? setRespuestaValida(esTipoRespuestaValido(e.target.value, pregunta.tipo_respuesta)) : null;  onActualizar(pregunta.id, valor, undefined)}}
                        placeholder="Escriba su respuesta..."
                        className="input-pregunta"
                    />
                    {!respuestaValida && 
                    
                        <Alert key={pregunta.id} className="mt-3" variant='danger'>
                            <i className="fa-solid fa-circle-exclamation" style={{color: "red"}}> </i> {getMensajeError(pregunta.tipo_respuesta)}
                        </Alert>
                    }
                </>

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

                <Button  onClick={() => cargarRespuesta(pregunta, instrumento_id).then(valor => setValor(String(valor.texto)))} style={{border: "none", color:"black", backgroundColor:"transparent"}}> <i className="fa-solid fa-arrow-rotate-left"></i> Actualizar respuestas  </Button>
            </div>
            }
        </div>
    );
}

export default PreguntaSimple;