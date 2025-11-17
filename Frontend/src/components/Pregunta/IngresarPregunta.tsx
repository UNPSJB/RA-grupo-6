import "./pregunta.css"
import Form from "react-bootstrap/Form";


type Props = {
    texto: string;
    setTexto: (v: string) => void;
    error?: string;
    label: string
};

function IngresarPregunta({texto, setTexto, error, label} : Props){

    return (
        <Form.Group className="mb-3 text-start">
            <Form.Label htmlFor="pregunta-cerrada" className="labelStyle fw-semibold"> {label} </Form.Label>
            <Form.Control
                as="textarea"
                id="pregunta-cerrada"
                placeholder=" Escribí tu pregunta acá..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                className="input-pregunta"
                style={{ borderColor: error? "#dc3545" : "#dee2e6", borderWidth: "2px"
        }}
            />
            {error && <div className="form-text text-danger">{error}</div>}
        </Form.Group>

    );
};

export default IngresarPregunta;
