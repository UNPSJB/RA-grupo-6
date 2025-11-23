import { Badge, Button, ListGroup, Modal } from "react-bootstrap";
import type { Pregunta, Respuesta} from "../types";

import "./RespuestasAbiertas.css"
import { CBadge, CButton, CListGroup, CListGroupItem, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from "@coreui/react";

export function ModalRespuestasAbiertas({ListaRespuestas, pregunta, numeroPregunta, mostrar, setMostrar} : {ListaRespuestas : Respuesta[], pregunta : Pregunta, numeroPregunta: number, mostrar : boolean, setMostrar : (logico : boolean) => void}){

    return (
        <CModal size="xl" visible={mostrar} onClose={() => setMostrar(false)} >
                <CModalHeader closeButton className=" m-3 align-items-start">
                    <CModalTitle> 
                        <div className="d-flex gap-3 ">

                            <CBadge className="p-2 align-content-center">
                                {pregunta.grupo_pregunta.letra}{numeroPregunta + 1}
                            </CBadge>

                            <CBadge className="p-2 align-content-center">
                                Pregunta {pregunta.tipo}
                            </CBadge>
                        </div>
        
                        <h4 className="mb-0 mt-3">
                            {pregunta.texto}
                        </h4>

                        <h5 className="mb-0 mt-3 fw-normal">
                            {ListaRespuestas.filter((respuesta) => respuesta.pregunta.id === pregunta.id).length} respuestas totales
                        </h5>
                    </CModalTitle>
                </CModalHeader>


                <CModalBody className="border rounded m-3">
                    <div className="contenedor-scroll" style={{maxHeight: '400px', overflowY: 'auto',  padding: '1.25rem'}}>
                        {ListaRespuestas.filter((respuesta) => respuesta.pregunta.id === pregunta.id).map((respuesta, numero) => 
                                
                                respuesta.pregunta.id == pregunta.id &&
                                <CListGroupItem className="mb-3 rounded p-3" style={{border: "1px solid #dee2e6", borderLeft: "5px solid #0d6efd"}}  >

                                        <CBadge className="mb-2">
                                            Estudiante {numero +  1} 
                                        </CBadge>

                                        <p className="mb-0 ms-2">
                                            {respuesta.texto}
                                        </p>
                                </CListGroupItem>    

                        )}
                    </div>
                </CModalBody>

                <CModalFooter>
                    <CButton onClick={() => setMostrar(false)} variant="primary"> Cerrar </CButton>
                </CModalFooter>
            </CModal>
    );


}