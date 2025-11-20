import { Badge, Button, Form } from 'react-bootstrap';
import { EnumTipoPregunta } from '../types';
import type { InstanciaRespuestas, InstrumentoDetail } from '../types';
import EliminarInstancia from '../Instrumento/EliminarInstancia';
import { RespuestasFormulario } from '../RespuestasFormulario/RespuestasFormulario';

type Props = {
    pregunta: any;
    index: number;
    instancia: InstanciaRespuestas;
    instanciaIndex: number;
    grupoCuadroId: number;
    totalInstancias: number;
    instrumento?: InstrumentoDetail
    onActualizar: (
        grupoCuadroId: number,
        instanciaIndex: number,
        preguntaId: number,
        texto?: string,
        opcionId?: number
    ) => void;
    onEliminar: (grupoCuadroId: number, instanciaIndex: number) => void;
};

function PreguntaMultiple({
    pregunta,
    index,
    instancia,
    instanciaIndex,
    grupoCuadroId,
    totalInstancias,
    onActualizar,
    onEliminar,
    instrumento,
}: Props) {
    
    const respuesta = instancia[pregunta.id];
    
    return (
        <>
            {index === 0 && (
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Badge bg="primary" style={{ fontSize: '1rem' }}>
                        Respuesta {instanciaIndex + 1}
                    </Badge>
                    <EliminarInstancia
                        grupoCuadroId={grupoCuadroId}
                        instanciaIndex={instanciaIndex}
                        totalInstancias={totalInstancias}
                        onEliminar={onEliminar}
                    />
                </div>
            )}

            {index===0 && instrumento?.tipo === "INFORME_SINTETICO" &&
                <h5 className="fw-semibold mb-1"> materiaNombre</h5>
            }

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
                        value={respuesta?.texto || ''}
                        onChange={(e) =>
                            onActualizar(grupoCuadroId, instanciaIndex, pregunta.id, e.target.value)
                        }
                        placeholder="Escriba su respuesta..."
                        className="input-pregunta"
                    />
                ) : (
                    <Form.Group>
                        {pregunta.opciones?.map((opcion: any) => (
                            <Form.Check
                                key={opcion.id}
                                type="radio"
                                name={`pregunta-${pregunta.id}-instancia-${instanciaIndex}`}
                                label={opcion.texto}
                                checked={respuesta?.opcion_id === opcion.id}
                                onChange={() =>
                                    onActualizar(grupoCuadroId, instanciaIndex, pregunta.id, undefined, opcion.id)
                                }
                                className="mb-2"
                            />
                        ))}
                    </Form.Group>
                )}

                {pregunta.pregunta_fuente_id &&
                <div className='text-end mb-1 mt-1'>

                    <Button  style={{border: "none", color:"black", backgroundColor:"transparent"}}> <i className="fa-solid fa-arrow-rotate-left"></i> Actualizar respuestas</Button>
                </div>
                }
            </div>
        </>
    );
}

export default PreguntaMultiple;