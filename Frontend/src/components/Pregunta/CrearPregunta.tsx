import CrearPreguntaAbierta from "./CrearPreguntaAbierta";
import CrearPreguntaCerrada from "./CrearPreguntaCerrada";
import { EnumTipoPregunta } from "../types";
import type { TipoPregunta } from "../types";
import { useState } from "react";
import { Form, Modal, Button } from 'react-bootstrap';

type Props = {
    mostrar: boolean;
    manejarPestaña: () => void;
    refrescarPreguntas: () => void;
};

import "./pregunta.css";

function CrearPregunta({ mostrar, manejarPestaña, refrescarPreguntas }: Props) {
    const [tipoPregunta, setTipoPregunta] = useState<TipoPregunta>(EnumTipoPregunta.abierta);

    return (
        <Modal show={mostrar} onHide={manejarPestaña} size="lg" centered>
            <Modal.Header closeButton className="border-bottom" style={{ padding: "1.5rem" }}>
                <Modal.Title className="fw-bold" style={{ fontSize: "1.5rem", color: "#1f2937" }}> Crear Pregunta </Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-4 py-4">
                <Form>
                    <div className="mb-4 text-center">
                        <Form.Label 
                            className="fw-semibold mb-3 d-block"
                            style={{ fontSize: "0.875rem", color: "#4b5563" }}
                        >
                            Tipo de pregunta
                        </Form.Label>
                        
                        <div className="d-flex justify-content-center align-items-center gap-3">
                            <Button
                                variant={tipoPregunta === EnumTipoPregunta.abierta ? "success" : "light"}
                                className={`flex-fill py-2 d-flex align-items-center justify-content-center gap-2 fw-medium ${
                                    tipoPregunta === EnumTipoPregunta.abierta ? "shadow-sm" : ""
                                }`}
                                style={{
                                    border: tipoPregunta === EnumTipoPregunta.abierta ? "none" : "2px solid #e5e7eb",
                                    borderRadius: "0.5rem",
                                    fontSize: "0.875rem"
                                }}
                                onClick={() => setTipoPregunta(EnumTipoPregunta.abierta)}
                            >
                                <i className="fa-solid fa-align-left"></i>
                                Abierta
                            </Button>

                            <Button
                                variant={tipoPregunta === EnumTipoPregunta.cerrada ? "primary" : "light"}
                                className={`flex-fill py-2 d-flex align-items-center justify-content-center gap-2 fw-medium ${
                                    tipoPregunta === EnumTipoPregunta.cerrada ? "shadow-sm" : ""
                                }`}
                                style={{
                                    border: tipoPregunta === EnumTipoPregunta.cerrada ? "none" : "2px solid #e5e7eb",
                                    borderRadius: "0.5rem",
                                    fontSize: "0.875rem"
                                }}
                                onClick={() => setTipoPregunta(EnumTipoPregunta.cerrada)}
                            >
                                <i className="fa-solid fa-list-check"></i>
                                Cerrada
                            </Button>
                        </div>
                    </div>

                    {tipoPregunta === EnumTipoPregunta.abierta ? (
                        <CrearPreguntaAbierta
                            manejarPestaña={manejarPestaña}
                            refrescarPreguntas={refrescarPreguntas}
                        />
                    ) : (
                        <CrearPreguntaCerrada
                            manejarPestaña={manejarPestaña}
                            refrescarPreguntas={refrescarPreguntas}
                        />
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer className="border-top" style={{ padding: "1.25rem 1.5rem" }}>
                <Button variant="outline-secondary" onClick={manejarPestaña}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CrearPregunta;
