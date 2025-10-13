import { useState } from "react";
import { Modal, Button } from "react-bootstrap";

interface ModalExitoProps {
  onEnviar: () => Promise<boolean>; 
  onExito?: () => void;
}

export default function ModalExito({ onEnviar, onExito }: ModalExitoProps) {
    const [mostrar, setMostrar] = useState(false);

    const mostrarModal = () => {
        onEnviar()
        .then((exito) => {
            if (exito) {
                setMostrar(true);
                setTimeout(() => {
                    setMostrar(false);
                    if (onExito) onExito(); 
                }, 1500);
            } else {
                alert("Error al enviar el formulario");
            }
        })
        .catch(() => alert("Error al conectar con el servidor"));
    };

    return (
        <>
            <Button variant="success" className="w-100" onClick={mostrarModal}>
                Enviar Formulario
            </Button>

            <Modal show={mostrar}>
                <Modal.Header className="bg-success text-white">
                    <Modal.Title>¡Éxito!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Formulario enviado!
                </Modal.Body>
            </Modal>
        </>
    );
}
