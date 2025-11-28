import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form"
import type { Rol } from "../types";

type ELegirRolProps = {
    selectedRol: string;
    onChangeRol: (rol: string) => void;
    error?: string;
};

const ROLES_PERMITIDOS = ["estudiante", "docente", "departamento"];

function ELegirRol({ selectedRol, onChangeRol, error }: ELegirRolProps){

    const [roles, setRoles] = useState<Rol[]>([])

    const url_base = 'http://127.0.0.1:8000/roles/'

    useEffect(() => {
        fetch(url_base)
        .then(response => response.json())
        .then((data: Rol[]) => {
            const rolesFiltrados = data.filter(rol => 
                ROLES_PERMITIDOS.includes(rol.nombre.toLowerCase())
            );
            setRoles(rolesFiltrados);
        })
        .catch(error => console.log(error));
    }, []);

    return(
    <div>
        <h5 className="mb-3 fw-semibold " style={{ fontSize: "0.95rem" }}>
        Dirigido a
        </h5>
        <Form.Select
            id="select-roles"
            value={selectedRol}
            onChange={(e) => onChangeRol(e.target.value)}
            className="border-2"
            style={{ 
                borderColor: error? "#dc3545" : "#dee2e6", borderWidth: "2px"
            }}
        >
            <option value="">Seleccione un rol...</option>
            {roles.map((rol) => (
                <option key={rol.id} value={rol.id}>
                    {rol.nombre}
                </option>
            ))}
        </Form.Select>

        {error && (
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.25rem',
                color: '#dc3545',
                fontSize: '0.875rem',
                marginTop: '0.25rem'
            }}>
                {error}
            </div>
        )}
    </div>
    )
}

export default ELegirRol;