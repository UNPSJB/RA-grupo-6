import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import OpcionList from "../Opcion/OpcionList";
import type { Opcion, Pregunta } from "../types";
import ElegirGrupoPregunta  from "../GrupoPregunta/GrupoPregunta";
import ELegirRol from "../Rol/ElegirRol";

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
    const [TextoMostrar, setTextoMostrar] = useState("Mostrar");
    const [estadisticaSeleccionada, setEstadisticaSeleccionada] = useState<boolean>(pregunta.estadistica);
    const [rolSeleccionado, setRolSeleccionado] = useState<string>(pregunta.rol_id.toString());

    const modificarPregunta = () =>{
        fetch(`http://127.0.0.1:8000/preguntas/${pregunta.id}`,{
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                texto: nuevoTexto,
                opciones: opcionesSeleccionadas.map(op => op.id),
                grupo_pregunta_id: grupoSeleccionado,
                estadistica: estadisticaSeleccionada,
                rol: parseInt(rolSeleccionado)
            }),
        })
        .then((res) => {
            if (res.ok){
                onEditar({ ...pregunta, texto: nuevoTexto, opciones: opcionesSeleccionadas, grupo_pregunta_id: grupoSeleccionado, rol_id: parseInt(rolSeleccionado), estadistica: estadisticaSeleccionada });
                setMostrarModal(false);
            } else {
                res.text().then((err) => alert(`No se puede modificar la pregunta: ${err}`));
            }  
        })
        .catch(() => alert("No se puede modificar la pregunta"));
    }

    
    function cambiarMostrar() {
        const nuevoMostrar = !mostrar;
        setMostrar(nuevoMostrar);
        
        if (nuevoMostrar) {
            setTextoMostrar("Ocultar");
        } else {
            setTextoMostrar("Mostrar");
        }
    
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
                <div className="contenedor-scroll" style={{maxHeight: '500px', overflowY: 'auto',  padding: '1.25rem'}}>
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
                        <Form.Group className="mb-4">
                            <ELegirRol selectedRol={rolSeleccionado} onChangeRol={setRolSeleccionado}></ELegirRol>
                        </Form.Group>
                        {pregunta.tipo === "cerrada" && (
                            <>
                            
                            <Form.Group className="mb-3 text-start mt-3" >
                                <Form.Label className="fw-semibold mb-3">Estadisticas</Form.Label>
                                <div className="d-flex align-items-center justify-content-between border rounded p-2 px-3 shadow-sm">
                                <span className="fw-semibold">Incluir en estadísticas</span>
                                <Form.Check
                                    type="switch"
                                    id="pregunta-cerrada"
                                    checked={estadisticaSeleccionada}
                                    onChange={(e) => setEstadisticaSeleccionada(e.target.checked)}
                                />
                                </div>
                            </Form.Group>
                            <div  className="mb-2 d-flex justify-content-between align-items-center">
                                <h6>Gestión de opciones</h6>
                                <Button
                                className="show-options bg-transparent text-dark border-0 fw-semibold d-flex align-items-center gap-2"
                                onClick={cambiarMostrar}
                                >
                                <i className="fa-solid fa-gear text-dark" style={{ fontSize: "13px" }} />
                                {TextoMostrar}
                                </Button>
                            </div>
                            </>
                        )}
                        {mostrar && pregunta.tipo === "cerrada" &&  (
                            <OpcionList 
                            opcionesSeleccionadas={opcionesSeleccionadas}
                            setOpcionesSeleccionadas={setOpcionesSeleccionadas}
                            />
                        )}

                </div>
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