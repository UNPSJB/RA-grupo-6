import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

type Props = {
  preguntaId: Number;        
  onDeleted: (id: string) => void;
};

function EliminarPregunta({ preguntaId, onDeleted }: Props) {
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const eliminarPregunta = () => {
    fetch(`http://127.0.0.1:8000/preguntas/${preguntaId}`, {
      method: "DELETE",
    })
    .then((res) => {
      if (res.ok) onDeleted(String(preguntaId));
      else res.text().then(err => alert(`No se puede eliminar la pregunta: ${err}`));
    })
    .catch(() => alert("No se puede eliminar la pregunta"));
  };

  return (
    <>
        <Button size="sm" className="bg-transparent border-secondary" onClick={() => setMostrarConfirmacion(true)}>
            <i className="fa-solid fa-trash" style={{ fontSize: '18px', color: "rgba(163, 32, 52, 1)" }}></i>
        </Button>

        <Modal show={mostrarConfirmacion} onHide={() => setMostrarConfirmacion(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Confirmar eliminación</Modal.Title>
            </Modal.Header>
                <Modal.Body>¿Seguro que querés eliminar esta pregunta?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setMostrarConfirmacion(false)}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={eliminarPregunta}>
                    Eliminar
                </Button>
            </Modal.Footer>
        </Modal>
    </>
  );
}

export default EliminarPregunta;
