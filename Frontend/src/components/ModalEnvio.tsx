import { useState } from "react";
import { Modal, Button } from "react-bootstrap";

interface ModalExitoProps {
  onEnviar: () => boolean | Promise<boolean>; 
  onExito?: () => void;
  desactivado: boolean;
  textoBoton?: string;
  variante?: string;
  className?: string;
}

function ModalExito({ onEnviar, onExito, desactivado, textoBoton, variante, className }: ModalExitoProps) {
    const [mostrar, setMostrar] = useState(false);

    const [enviando, setEnviando] = useState(false);

    const mostrarModal = async () => {
        setEnviando(true);
        try {
            const exito = await onEnviar();
            if (exito) {
                setMostrar(true);
                setTimeout(() => {
                    setMostrar(false);
                    if (onExito) onExito();
                }, 1500);
            }
        } catch {
            alert("Ocurrió un error al ejecutar la acción");
        } finally {
            setEnviando(false);
        }
    };

    return (
        <>
            <Button variant={variante} className={className} disabled={desactivado || enviando} onClick={mostrarModal} style={{flex:1}}>
                <i className="fa-solid fa-check me-2"></i>{textoBoton}
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

export default ModalExito;