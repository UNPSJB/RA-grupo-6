
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Form from "react-bootstrap/Form"

type Rol = {
    id: number
    nombre: String
}

function ELegirRol(){

    const [roles, setRoles] = useState<Rol[]>([])

    const url_base = 'http://127.0.0.1:8000/roles/'

    useEffect(() => {
        fetch(url_base)
        .then(response => response.json())
        .then((data) => setRoles(data))
        .catch(error => console.log(error));
    }, []);


    return(
        <>

        <Form.Select className="w-25" id="select-roles" defaultValue={""}>
        
            <option value="" disabled> Seleccione un rol... </option>

            {roles.map((rol) => 
            
                <option value={rol.id}> {rol.nombre} </option>
        
            )}
        
        </Form.Select>

        </>
        
    )
}



export default ELegirRol;