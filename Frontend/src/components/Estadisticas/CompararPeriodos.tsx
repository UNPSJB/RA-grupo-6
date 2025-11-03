import { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap"

type EstadisticasPlantilla = {
    Titulo: string;
    CantPreguntas: number;
    CantObligatorias: number;
    Grupos: number;       
    TasaRespuestas: number;     
    Completitud: number;        
}

export function CompararPlantillas(){

    const url_base = "http://127.0.0.1:8000/formularios/EstadisticasFormularios/" 

    const [estadisticas, setEstadisticas] = useState<EstadisticasPlantilla[]>([]);

    useEffect(() => {
        fetch(url_base)
            .then(response => response.json())
            .then((data) => setEstadisticas(data))
            .catch(error => console.log(error));
    }, []);


    return(
        <Container >
            <h2>Comparación de estadisticas</h2>

            <Row className="d-flex gap-4">
                <Col className="border rounded p-3">
                    <p className="mb-0 text-muted fw-bold">Total de plantillas</p>
                    <p>4</p>
                </Col>

                <Col className="border rounded p-3">
                    <p className="mb-0 text-muted fw-bold">Mejor plantilla</p>
                    <p>Plantilla 1</p>
                </Col>

                <Col className="border rounded p-3">
                    <p className="mb-0 text-muted fw-bold">Tasa promedio de respuestas</p>
                    <p> 80% </p>
                </Col>
            </Row>

            <br />
            <br />

            <div className="p-3 border rounded">
                <h3 className="m-3">Metricas por plantilla</h3>
                <Table>
                <thead>
                    <tr className="text-center">
                    <th>Plantilla</th>
                    <th>Preguntas</th>
                    <th>Obligatorias</th>
                    <th>Secciones</th>
                    <th>Tasa respuestas</th>
                    <th>Completitud</th>
                    {/* <th>Tiempo</th> */}
                    </tr>
                </thead>
                <tbody>
                    {estadisticas &&  estadisticas.map((plantilla, indice) => (
                        <tr key={indice}>
                        <td className="text-center"> {plantilla.Titulo}</td>
                        <td className="text-center"> {plantilla.CantPreguntas}</td>
                        <td className="text-center"> {plantilla.CantObligatorias}</td>
                        <td className="text-center"> {plantilla.Grupos}</td>
                        <td className="text-center"> {plantilla.TasaRespuestas}</td>
                        <td className="text-center"> {plantilla.Completitud}</td>
                        </tr>
                    ))}
                </tbody>
                </Table>

            </div>



        </Container>
    )

}