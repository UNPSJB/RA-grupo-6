import { useState } from "react";
import type { Opcion } from "./OpcionTypes";

import {Form, Button, InputGroup} from "react-bootstrap";

interface CrearOpcionProps {
    onCrear: (opcion: Opcion) => void; 
}

function CrearOpcion({onCrear}: CrearOpcionProps){

    const [texto, setTexto] = useState("");

    const handleCreate = () => {
        if (!texto.trim()) return;

        fetch("http://127.0.0.1:8000/opciones/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto }),
        })
        .then((res) => res.json())
        .then((data: Opcion) => {
            onCrear(data);
            setTexto("");
        });
    };

    return(
        <InputGroup className="mb-4">
            <Form.Control
                type="text"
                name='create-option'
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Nueva opción..."
                />
            <Button onClick={handleCreate} style={{ minWidth: '100px' }}> <i className="fa-solid fa-check"></i> </Button>
        </InputGroup>
    );
};

export default CrearOpcion;