
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form"

type Rol = {
    id: number;
    nombre: string;
}
type ELegirRolProps = {
    selectedRol: string;
    onChangeRol: (rol: string) => void;
};

function ELegirRol({ selectedRol, onChangeRol }: ELegirRolProps){

    const [roles, setRoles] = useState<Rol[]>([])

    const url_base = 'http://127.0.0.1:8000/roles/'

    useEffect(() => {
        fetch(url_base)
        .then(response => response.json())
        .then((data) => setRoles(data))
        .catch(error => console.log(error));
    }, []);

    return(
    <div>
        <h5 className="mb-3 fw-semibold text-secondary" style={{ fontSize: "0.95rem" }}>
        Dirigido a
        </h5>
        <Form.Select
        id="select-roles"
        value={selectedRol}
        onChange={(e) => onChangeRol(e.target.value)}
        className="border-2"
        style={{ 
            borderColor: "#dee2e6",
            padding: "0.75rem" 
        }}
        >
        <option value="">Seleccione un rol...</option>
        {roles.map((rol) => (
            <option key={rol.id} value={rol.id}>
            {rol.nombre}
            </option>
        ))}
        </Form.Select>
    </div>
    )
}

export default ELegirRol;