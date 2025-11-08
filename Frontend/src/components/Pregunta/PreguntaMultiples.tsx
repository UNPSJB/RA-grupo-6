import { Card, Badge, Form } from 'react-bootstrap';
import { EnumTipoPregunta } from '../types';
import type { InstanciaRespuestas } from '../types';
import EliminarInstancia from '../Instrumento/EliminarInstancia';

type Props = {
    pregunta: any;
    index: number;
    instancia: InstanciaRespuestas;
    instanciaIndex: number;
    grupoCuadroId: number;
    totalInstancias: number;
    onActualizar: (
        grupoCuadroId: number,
        instanciaIndex: number,
        preguntaId: number,
        texto?: string,
        opcionId?: number
    ) => void;
    onEliminar: (grupoCuadroId: number, instanciaIndex: number) => void;
};

function PreguntaMultiple({pregunta,index,instancia,instanciaIndex,grupoCuadroId,totalInstancias,onActualizar,onEliminar,}: Props) {
    
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

            <Card className="border-0 shadow-sm w-100 mb-3" style={{ borderRadius: '1rem' }}>
                <Card.Body className="p-3">
                    <div className="mb-2 d-flex align-items-center gap-3">
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
                        <div>
                            <h5 className="fw-semibold mb-1">{pregunta.texto}</h5>
                            <Badge bg={pregunta.tipo === EnumTipoPregunta.abierta ? 'success' : 'info'}>
                                {pregunta.tipo}
                            </Badge>
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
                </Card.Body>
            </Card>
        </>
    );
}

export default PreguntaMultiple;