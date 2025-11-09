import { useEffect, useState } from "react";
import { Badge, Button, Container, ListGroup, ListGroupItem, Row, Stack } from "react-bootstrap";
import { EnumTipoPregunta } from "../types";
import { useParams } from "react-router-dom";
import { capitalizarCadena } from "../Funciones";

export interface Respuestas {
    id: number;
    pregunta_id: number;
    opcion_id: number | null;
    texto_respuesta: string | null;
    pregunta: { tipo: string; texto: string };
    opcion: { texto: string } | null;
}

export interface RespuestasFormularios {
    respuestas_formulario: {
        id: number;
        fecha_envio: string;
        instrumento_id: number;
        usuario_id: number;
        respuestas: Respuestas[];
        materia: { id: string; nombre: string };
    };
}

export function RespuestasFormulario() {
    const { id } = useParams<{ id: string }>();
    const url_base = `http://127.0.0.1:8000/RespuestasFormulario/${id}`;

    const [respuestasFormulario, setRespuestasFormulario] = useState<RespuestasFormularios>();
    const [respuestasMostradas, setRespuestasMostradas] = useState<Respuestas[]>([]);
    const [activo, setActivo] = useState<"1" | "2" | "3">("1");

    useEffect(() => {
        fetch(url_base)
            .then((res) => res.json())
            .then((data) => {
                setRespuestasFormulario(data);
                setRespuestasMostradas(data.respuestas_formulario?.respuestas ?? []);
            })
            .catch((error) => console.log(error));
    }, [url_base]);

 
    const todas = respuestasFormulario?.respuestas_formulario.respuestas ?? [];
    const abiertas = todas.filter((respuestas) => respuestas.pregunta.tipo === EnumTipoPregunta.abierta);
    const cerradas = todas.filter((respuestas) => respuestas.pregunta.tipo === EnumTipoPregunta.cerrada);
    const numeroPreguntas = todas.length;

    const estiloBotonActivo = { backgroundColor: "#0d6efd", border: "none", color: "#fff" };
    const estiloBotonInactivo = { backgroundColor: "#E8ECEF", border: "none", color: "#5A5B65" };

    return (
        <Container className="pb-5 w-50 mt-5">
            
            <div className="title p-4 pb-0 border rounded-3">
                <h2>Tus respuestas</h2>
                <hr />
                <div className="d-flex justify-content-between ms-2 me-2 mb-3">
                    <p className="ms-2 mb-1">
                        <span style={{ color: "grey", fontSize: "13px" }}>ASIGNATURA</span>
                        <br />
                        {capitalizarCadena(respuestasFormulario?.respuestas_formulario.materia?.nombre ?? "")}
                    </p>

                    <p className="ms-2 mb-0">
                        <span style={{ color: "grey", fontSize: "13px" }}>COMPLETADA</span>
                        <br />
                        {respuestasFormulario? new Date(respuestasFormulario.respuestas_formulario.fecha_envio).toLocaleDateString("es-AR",{ day: "numeric", month: "long", year: "numeric" }): ""}
                    </p>

                    <p className="ms-2 mb-0">
                        <span style={{ color: "grey", fontSize: "13px" }}>TOTAL RESPUESTAS</span>
                        <br />
                        {numeroPreguntas} preguntas
                    </p>
                </div>
            </div>

            
            <Stack className="pt-3 pb-3 mb-2 mt-2" direction="horizontal" gap={4}>
                <Button style={activo === "1" ? estiloBotonActivo : estiloBotonInactivo}onClick={() => {setRespuestasMostradas(todas); setActivo("1");}}> Todas ({numeroPreguntas}) </Button>
                
                <Button style={activo === "2" ? estiloBotonActivo : estiloBotonInactivo} onClick={() => {setRespuestasMostradas(abiertas); setActivo("2");}}> Abiertas ({abiertas.length})</Button>
                
                <Button style={activo === "3" ? estiloBotonActivo : estiloBotonInactivo} onClick={() => {setRespuestasMostradas(cerradas); setActivo("3");}}> Cerradas ({cerradas.length})</Button>
            </Stack>

            
            {respuestasMostradas.length > 0 && (
                <ListGroup className="d-flex gap-3">
                    
                    {respuestasMostradas.map((r, i) => (
                        <ListGroupItem key={r.id} className="mb-2 d-flex border rounded align-items-start gap-3 p-3">
                            <Badge bg="primary" className="rounded-circle" style={{width: "30px",height: "30px", fontSize: "1rem",display: "flex", alignItems: "center", justifyContent: "center",}}>
                                {i + 1}
                            </Badge>

                            <div className="container-fluid me-3">
                                <Badge className="p-2"style={{backgroundColor: r.pregunta.tipo === EnumTipoPregunta.abierta ? "#24c798" : "#6284bf" }}>
                                    {r.pregunta.tipo.toUpperCase()}
                                </Badge>

                                <h5 className="fw-semibold mb-2 mt-2">{r.pregunta.texto}</h5>

                                <Row className="mb-3 mt-2 ms-1 rounded p-3" style={{border: "1px solid #dee2e6", borderLeft: r.pregunta.tipo === EnumTipoPregunta.abierta? "5px solid #24c798" : "5px solid #6284bf",backgroundColor: "#fbfafe",}}>
                                    <p className="mb-0">
                                        <span style={{ color: "grey", fontSize: "12px" }}>TU RESPUESTA:</span>
                                        <br />
                                        {r.pregunta.tipo === EnumTipoPregunta.abierta? `"${r.texto_respuesta ?? ""}"` : `• ${r.opcion?.texto ?? ""}`}
                                    </p>
                                </Row>
                            </div>
                        </ListGroupItem>
                    ))}
                </ListGroup>
            )}
        </Container>
    );
}
