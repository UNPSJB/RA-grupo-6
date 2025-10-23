import { useEffect, useState } from "react";
import type { GrupoPregunta } from "../types";
import { Form } from "react-bootstrap";


type GrupoPreguntaProps = {
    selectedGrupo: number;
    onChangeGrupo: (grupo: number) => void;
    error?: string;
};

function ElegirGrupoPregunta({ selectedGrupo, onChangeGrupo, error }: GrupoPreguntaProps){

    const [gruposPregunta, setGruposPregunta] = useState<GrupoPregunta[]>([])

    useEffect(() => {
        fetch("http://127.0.0.1:8000/GrupoPregunta/")
        .then(response => response.json())
        .then((data) => setGruposPregunta(data))
        .catch(error => console.log(error));
    }, []);

    return(
        <>
            <Form.Group className="mb-3 text-start">
                
                <Form.Label htmlFor="pregunta-cerrada" className="labelStyle fw-semibold"> Grupo de pregunta </Form.Label>
                <Form.Select
                    id="select-grupo-pregunta"
                    value={selectedGrupo}
                    onChange={(e) => onChangeGrupo(parseInt(e.target.value))}
                    className="border-2"
                    required
                    style={{ borderColor: error ? "#dc3545" : "#dee2e6" }}
                    >
                    <option value={0}>Seleccione un grupo de pregunta...</option>
                    {gruposPregunta.map((grupo_pregunta) => (
                        <option key={grupo_pregunta.id} value={grupo_pregunta.id}>
                            {grupo_pregunta.letra}
                        </option>
                    ))}
                </Form.Select>
                {error && <div className="form-text text-danger">{error}</div>}
            </Form.Group>
        </>

    )
}

export default ElegirGrupoPregunta;