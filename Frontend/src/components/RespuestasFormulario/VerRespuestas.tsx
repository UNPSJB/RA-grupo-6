import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function VerRespuestas() {
    const { respuestasFormularioId } = useParams();
    const [respuestas, setRespuestas] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!respuestasFormularioId) {
            setError("Id de formulario no válido");
            return;
        }

        const fetchData = async () => {
            try {
                const res = await fetch(
                    `http://127.0.0.1:8000/respuestas/?formulario_id=${respuestasFormularioId}`
                );

                if (!res.ok) {
                    setError("No se pudieron obtener las respuestas");
                    return;
                }

                const data = await res.json();
                console.log("respuestasData", data);

                if (!Array.isArray(data)) {
                    setError("El servidor no devolvió una lista de respuestas");
                    return;
                }

                setRespuestas(data);
            } catch (err) {
                setError("Error al conectar con el servidor");
            }
        };

        fetchData();
    }, [respuestasFormularioId]);

    if (error) {
        return <p style={{ padding: "2rem", color: "red" }}>{error}</p>;
    }

    if (respuestas.length === 0) {
        return <p style={{ padding: "2rem" }}>No se encontraron respuestas para esta encuesta</p>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>Respuestas del formulario #{respuestasFormularioId}</h2>

            {respuestas.map((r) => (
                <div
                    key={r.id}
                    style={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        marginBottom: "10px",
                        borderRadius: "5px"
                    }}
                >
                    <p><strong>Pregunta:</strong> {r.pregunta?.texto}</p>

                    {r.opcion ? (
                        <p><strong>Respuesta:</strong> {r.opcion.texto}</p>
                    ) : (
                        <p><strong>Respuesta (abierta):</strong> {r.texto}</p>
                    )}
                </div>
            ))}
        </div>
    );
}
