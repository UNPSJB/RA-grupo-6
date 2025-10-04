import "./pregunta.css"
import Form from "react-bootstrap/Form";


type Props = {
    texto: string;
    setTexto: (v: string) => void;
};

function IngresarPregunta({texto, setTexto} : Props){

    return (

        <Form.Group className="mb-3 text-start">
            <Form.Label htmlFor="pregunta-cerrada" className="labelStyle fw-semibold"> Contenido de la pregunta </Form.Label>
            <Form.Control
                as="textarea"
                id="pregunta-cerrada"
                placeholder=" Escribí tu pregunta acá..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                className="input-pregunta"
            />
        </Form.Group>

    );
};

export default IngresarPregunta;
