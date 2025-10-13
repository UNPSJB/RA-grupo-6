import { useState } from "react";
import { Modal, Button } from "react-bootstrap";

export default function ModalExito() {
    const [mostrar, setMostrar] = useState(false);

    const mostrarModal = () => {
        setMostrar(true);

        setTimeout(() => {
        setMostrar(false);
        }, 1000);
    };

    return (
        <div className="p-3 text-center">
        <Button variant="success" onClick={mostrarModal}>
            Enviar Formulario
        </Button>

        <Modal show={mostrar} >
            <Modal.Header className="bg-success text-white">
            <Modal.Title>¡Éxito!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Formulario enviado!
            </Modal.Body>
        </Modal>
        </div>
    );
    }
