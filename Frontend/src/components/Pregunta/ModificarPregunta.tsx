import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import OpcionList from "../Opcion/OpcionList";
import type { Opcion, Pregunta } from "../types";
import { ElegirGrupoPregunta } from "../GrupoPregunta/GrupoPregunta";

type Props = {
    pregunta: Pregunta
    onEditar: (preguntaActualizada: Pregunta) => void;
}

function ModificarPregunta({pregunta,onEditar}:Props){
    const [mostrarModal, setMostrarModal] = useState(false);
    const [nuevoTexto, setNuevoTexto] = useState(pregunta.texto);
    const [opcionesSeleccionadas, setOpcionesSeleccionadas] = useState<Opcion[]>(pregunta.opciones);
    const [grupoSeleccionado, setGrupoSeleccionado] = useState<number>(pregunta.grupo_pregunta_id);
    const [mostrar, setMostrar] = useState(false);

    const modificarPregunta = () =>{
        fetch(`http://127.0.0.1:8000/preguntas/${pregunta.id}`,{
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                texto: nuevoTexto,
                opciones: opcionesSeleccionadas.map(op => op.id),
                grupo_pregunta_id: grupoSeleccionado
            }),
        })
        .then((res) => {
            if (res.ok){
                onEditar({ ...pregunta, texto: nuevoTexto, opciones: opcionesSeleccionadas, grupo_pregunta_id: grupoSeleccionado });
                setMostrarModal(false);
            } else {
                res.text().then((err) => alert(`No se puede modificar la pregunta: ${err}`));
            }  
        })
        .catch(() => alert("No se puede modificar la pregunta"));
    }

    
    function cambiarMostrar() {
        setMostrar(!mostrar);
        
        mostrar? setTextoMostrar("Mostrar") : setTextoMostrar("Ocultar")
    
    }

    return(
        <>
            <Button size="sm" className="bg-transparent border-secondary"
            onClick={() => setMostrarModal(true)}>
                <i className="fa-solid fa-pencil" style={{ fontSize: '18px', color: 'black' }}></i>
            </Button>
            <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Modificar pregunta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form.Group className="mb-4">
                        <Form.Label 
                            className="fw-semibold mb-2"
                            style={{ fontSize: "0.875rem", color: "#4b5563" }}
                        >
                            Texto de la pregunta
                        </Form.Label>
                        <Form.Control 
                            type="text" 
                            value={nuevoTexto} 
                            onChange={(e) => setNuevoTexto(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <ElegirGrupoPregunta 
                            selectedGrupo={grupoSeleccionado} 
                            onChangeGrupo={(id) => setGrupoSeleccionado(id)}
                        />
                    </Form.Group>

                    {pregunta.tipo === "cerrada" && (
                        <div  className="mb-3 d-flex justify-content-between align-items-center">
                            <h6>Gestión de opciones</h6>
                            <Button
                            className="show-options bg-transparent text-dark border-0 fw-semibold d-flex align-items-center gap-2"
                            onClick={cambiarMostrar}
                            >
                            <i className="fa-solid fa-gear text-dark" style={{ fontSize: "18px" }} />
                            </Button>
                        </div>
                    )}
                    {mostrar && pregunta.tipo === "cerrada" &&  (
                        <OpcionList 
                            opcionesSeleccionadas={opcionesSeleccionadas}
                            setOpcionesSeleccionadas={setOpcionesSeleccionadas}
                        />
                    )}

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setMostrarModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={modificarPregunta}>Guardar cambios</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModificarPregunta;