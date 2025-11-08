import { Card, Badge, Form } from 'react-bootstrap';
import { EnumTipoPregunta } from '../types';
import type { RespuestaTemporal } from '../types';

type Props = {
    pregunta: any;
    index: number;
    respuesta?: RespuestaTemporal;
    onActualizar: (preguntaId: number, texto?: string, opcionId?: number) => void;
};

function PreguntaSimple({ pregunta, index, respuesta, onActualizar }: Props) {
    return (
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
                    <div className="flex-grow-1">
                        <h5 className="fw-semibold mb-1">{pregunta.texto}</h5>
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
                        onChange={(e) => onActualizar(pregunta.id, e.target.value)}
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
            </Card.Body>
        </Card>
    );
}

export default PreguntaSimple;