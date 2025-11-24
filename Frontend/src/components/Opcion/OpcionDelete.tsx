import { CButton } from "@coreui/react";

type Props = {
    opcionId: number;
    onDeleted: (id:number) => void;
};  

function EliminarOpcion ({opcionId, onDeleted}: Props){
    const eliminarOpcion = () =>{
        fetch(`http://127.0.0.1:8000/opciones/${opcionId}`, {
        method: "DELETE",
        })
        .then((res) => {
            if (res.ok) onDeleted(opcionId);
        })
        .catch((err) => window.alert("No se puede eliminar la opcion"));
    };
    return(
    <CButton size="sm" variant="outline-primary" onClick={eliminarOpcion}>
        <i className="fas fa-xmark"></i>
    </CButton>
    );
};

export default EliminarOpcion;