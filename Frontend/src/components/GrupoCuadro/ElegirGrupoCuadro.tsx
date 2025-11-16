import { useEffect, useState } from "react";
import { Form, Button, ListGroup } from "react-bootstrap";
import CrearGrupoCuadro from "./GrupoCuadroCreate";
import type { GrupoCuadro } from "../types";

const url_base = '/grupos_cuadro/';

type Props = {
    seleccionarGrupo: number | null;
    cambiarGrupo: (id: number | null) => void;
    error?: string;
};

function ElegirGrupoCuadro ({seleccionarGrupo, cambiarGrupo, error}: Props){
    const [grupos, setGrupos] = useState<GrupoCuadro[]>([]);
    const [mostrarCrear, setMostrarCrear] = useState(false);
    const [textoMostrar, setTextoMostrar] = useState("Mostrar");

    useEffect(() =>{
        fetch(url_base)
            .then((res) => res.json())
            .then((data) => setGrupos(data))
            .catch((error) => console.log(error));
    }, []);

    const agregarGrupo = (nuevo: GrupoCuadro) =>{
        setGrupos((prev) => [...prev, nuevo]);
        setMostrarCrear(false);
    }

     const cambiarMostrar = () => {
        const nuevoMostrar = !mostrarCrear;
        setMostrarCrear(nuevoMostrar);
        setTextoMostrar(nuevoMostrar ? "Ocultar" : "Mostrar");
    };
    return(
        <Form.Group className="mb-3 text-start">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                    <Form.Label className="fw-semibold mb-1">Grupo Cuadro (opcional)</Form.Label>
                    <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
                        Solo para preguntas que forman parte de un cuadro con múltiples filas
                    </p>
                </div>
                <Button
                    className="bg-transparent text-dark border-0 fw-semibold d-flex align-items-center gap-2"
                    onClick={cambiarMostrar}
                >
                    <i className="fa-solid fa-gear text-dark" style={{ fontSize: "13px" }} />
                    {textoMostrar}
                </Button>
            </div>

            {error && <div className="text-danger mb-2" style={{ fontSize: "0.85rem" }}>{error}</div>}

            {mostrarCrear && (
                <>
                    <CrearGrupoCuadro onCrear={agregarGrupo} />

                    {grupos.length > 0 && (
                        <ListGroup variant="flush" className="border p-3 rounded">
                            <p className="text-muted mb-3" style={{ fontSize: "0.875rem" }}>
                                Selecciona un grupo cuadro o deja sin seleccionar:
                            </p>
                            <div>
                                <ListGroup.Item
                                    className={`d-flex align-items-center justify-content-between mb-2 border rounded p-2 ${
                                        seleccionarGrupo === null ? 'bg-light' : ''
                                    }`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => cambiarGrupo(null)}
                                >
                                    <Form.Check
                                        type="radio"
                                        id="grupo-ninguno"
                                        label="Sin grupo (pregunta normal)"
                                        checked={seleccionarGrupo === null}
                                        onChange={() => cambiarGrupo(null)}
                                    />
                                </ListGroup.Item>

                                {grupos.map((grupo) => (
                                    <ListGroup.Item
                                        key={grupo.id}
                                        className={`d-flex align-items-center justify-content-between mb-2 border rounded p-2 ${
                                            seleccionarGrupo === grupo.id ? 'bg-light' : ''
                                        }`}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => cambiarGrupo(grupo.id)}
                                    >
                                        <div className="flex-grow-1">
                                            <Form.Check
                                                type="radio"
                                                id={`grupo-${grupo.id}`}
                                                label={grupo.nombre}
                                                checked={seleccionarGrupo === grupo.id}
                                                onChange={() => cambiarGrupo(grupo.id)}
                                            />
                                            {grupo.descripcion && (
                                                <small className="text-muted d-block ms-4">
                                                    {grupo.descripcion}
                                                </small>
                                            )}
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </div>
                        </ListGroup>
                    )}
                </>
            )}
        </Form.Group>
    );

}

export default ElegirGrupoCuadro;