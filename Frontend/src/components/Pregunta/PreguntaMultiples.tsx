import { Alert, Badge, Button, Form } from 'react-bootstrap';
import { EnumTipoPregunta } from '../types';
import type { InstanciaRespuestas, InstrumentoDetail } from '../types';
import EliminarInstancia from '../Instrumento/EliminarInstancia';
import { cargarRespuesta } from '../Respuesta/CargarRespuestasIniciales';
import { useState } from 'react';
import { getMensajeError } from './PreguntaSimple';
import { esTipoRespuestaValido } from '../Funciones';

type Props = {
    pregunta: any;
    index: number;
    instancia: InstanciaRespuestas;
    instanciaIndex: number;
    grupoCuadroId: number;
    totalInstancias: number;
    instrumento?: InstrumentoDetail;
    instrumento_id: number;
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
    instrumento_id,
}: Props) {
    
    const respuesta = instancia[pregunta.id];
    let materiaNombre: string | undefined = undefined;
    let materiaId: string | undefined = undefined;
    const [valor, setValor] = useState(respuesta?.texto? respuesta.texto : "")
    const [respuestaValida, setRespuestaValida] = useState(true)

    for (const key in instancia) {
        const r = instancia[key];
        if (r && r.materia_nombre) {
            materiaNombre = r.materia_nombre;
            materiaId = r.materia_id;
            break;
        }
    }
    
    return (
        <>
            {index === 0 && (
                <>
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

                    {instrumento?.tipo === "INFORME_SINTETICO" && materiaNombre && (
                        <div className="mb-3 p-3 rounded" style={{ 
                            backgroundColor: '#f0f6ff', 
                            borderLeft: '4px solid #0d6efd' 
                        }}>
                            <p className="mb-0 fw-semibold text-primary">
                                <i className="fas fa-book me-2"></i>
                                {materiaNombre}  - 
                                {materiaId && <span className="ms-2">(Código: {materiaId})</span>}
                            </p>
                        </div>
                    )}
                </>
            )}

            <div className="mb-4 pb-3">
                <div className="mb-3 d-flex align-items-center gap-3">
                    <div
                        style={{
                            minWidth: '40px',
                            minHeight: '40px',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            fontSize: '0.95rem',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        {index + 1}
                    </div>
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

                {(pregunta.tipo === EnumTipoPregunta.abierta) ? (
                    <>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={valor}
                            onChange={(e) =>{ setValor(e.target.value); pregunta.tipo_respuesta? setRespuestaValida(esTipoRespuestaValido(e.target.value, pregunta.tipo_respuesta)) : null;
                                ;onActualizar(grupoCuadroId, instanciaIndex, pregunta.id, e.target.value)
                            }}
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
                    <Button onClick={() => cargarRespuesta(pregunta, instrumento_id).then(valor => setValor(String(valor.texto)))} style={{border: "none", color:"black", backgroundColor:"transparent"}}> <i className="fa-solid fa-arrow-rotate-left"></i> Actualizar respuestas  </Button>
                </div>
                }
            </div>
        </>
    );
}

export default PreguntaMultiple;