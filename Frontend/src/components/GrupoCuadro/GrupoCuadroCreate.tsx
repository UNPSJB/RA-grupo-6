import { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import type { GrupoCuadro } from "../types";

interface CrearGrupoCuadroProps{
    onCrear: (grupo: GrupoCuadro) => void;
}

function CrearGrupoCuadro({onCrear}: CrearGrupoCuadroProps){
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");

    const manejarCreacion = () =>{
        if(!nombre.trim()) return;

        fetch("http://127.0.0.1:8000/grupos_cuadro/",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                nombre: nombre, descripcion: descripcion.trim() || null,
                orden: 0
            }),
        })
            .then((res) => res.json())
            .then((data: GrupoCuadro) =>{
                onCrear(data);
                setNombre("");
                setDescripcion("");
            })
    }

    return(
        <div className="mb-3">
            <InputGroup className="mb-2">
                <Form.Control
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre del grupo (ej: Actividades Docentes)"
                />
            </InputGroup>
            <InputGroup>
                <Form.Control
                    type="text"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Descripción (opcional)"
                />
                <Button onClick={manejarCreacion} style={{ minWidth: "100px" }}>
                    <i className="fa-solid fa-check"></i>
                </Button>
            </InputGroup>
        </div>
    );
}

export default CrearGrupoCuadro;