import CrearPreguntaAbierta from "./CrearPreguntaAbierta";
import CrearPreguntaCerrada from "./CrearPreguntaCerrada";
import { EnumTipoPregunta } from "../types";
import type { TipoPregunta } from "../types";
import { useState } from "react";
import { Form, Modal, Button } from 'react-bootstrap';

type Props = {
    mostrar: boolean;
    manejarPestania: () => void;
    refrescarPreguntas: () => void;
};

import "./pregunta.css";
import { CButton, CForm, CFormLabel, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from "@coreui/react";

function CrearPregunta({ mostrar, manejarPestania, refrescarPreguntas }: Props) {
    const [tipoPregunta, setTipoPregunta] = useState<TipoPregunta>(EnumTipoPregunta.abierta);

    return (
        <CModal visible={mostrar} onClose={manejarPestania} size="lg">
            <CModalHeader closeButton className="border-bottom" style={{ padding: "1.5rem" }}>
                <CModalTitle className="fw-bold" style={{ fontSize: "1.5rem", color: "#1f2937" }}> Crear Pregunta </CModalTitle>
            </CModalHeader>
            <CModalBody className="px-4 py-4">
                <CForm>
                    <div className="mb-4 text-center">
                        <CFormLabel 
                            className="fw-semibold mb-3 d-block"
                            style={{ fontSize: "0.875rem", color: "#4b5563" }}
                        >
                            Tipo de pregunta
                        </CFormLabel>
                        
                        <div className="d-flex justify-content-center align-items-center gap-3">
                            <CButton
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
                            </CButton>

                            <CButton
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
                            </CButton>
                        </div>
                    </div>

                    {tipoPregunta === EnumTipoPregunta.abierta ? (
                        <CrearPreguntaAbierta
                            manejarPestania={manejarPestania}
                            refrescarPreguntas={refrescarPreguntas}
                        />
                    ) : (

                        <CrearPreguntaCerrada
                            manejarPestaña={manejarPestania}
                            refrescarPreguntas={refrescarPreguntas}
                            />

                    )}
                </CForm>

            </CModalBody>
            <CModalFooter className="border-top" style={{ padding: "1.25rem 1.5rem" }}>
                <CButton variant="outline-secondary" onClick={manejarPestania}>
                    Cerrar
                </CButton>
            </CModalFooter>
        </CModal>
    );
}

export default CrearPregunta;
