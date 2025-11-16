import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap"
import type { PlantillaFormulario } from "../types";

type EstadisticasPlantilla = {
    Titulo: string;
    CantPreguntas: number;
    CantObligatorias: number;
    Grupos: number;       
    TasaRespuestas: number;     
    Completitud: number;        
}

export function CompararPlantillas(){

    const [rol, setRol] = useState(1)
    const url_base = `/formularios/EstadisticasFormularios/rol_${rol}` 
    const url_base_mejor_plantilla= `/formularios/MejorPlantilla/rol_${rol}`
    const url_tasa_respuesta= `/formularios/TasaRespuestasPlantillas/rol_${rol}`

    const [estadisticas, setEstadisticas] = useState<EstadisticasPlantilla[]>([]);
    const [mejorPlantilla, setMejorPlantilla] = useState<PlantillaFormulario>()
    const [tasaRespuestas, setTasaRespuestas] = useState()


    const [activo, setActivo] = useState("1")
    const estiloBotonActivo = {backgroundColor: "#0d6efd", border: "none", color:"#ffffffff"}
    const estiloBotonInactivo = {backgroundColor: "#E8ECEF", border: "none", color:"#5A5B65"}

    useEffect(() => {
        fetch(url_base)
            .then(response => response.json())
            .then((data) => setEstadisticas(data))
            .catch(error => console.log(error));

        fetch(url_base_mejor_plantilla)
            .then(response => response.json())
            .then((data) => setMejorPlantilla(data))
            .catch(error => console.log(error));

        fetch(url_tasa_respuesta)
            .then(response => response.json())
            .then((data) => setTasaRespuestas(data))
            .catch(error => console.log(error));

    }, [rol]);

    return(
        <Container >
            <Row className="d-flex align-items-center pb-3 border-bottom mb-5 mt-3">
                <Col className="d-flex justify-content-start">
                    <h2>Comparación de estadisticas</h2>
                </Col>
                <Col className="d-flex justify-content-end gap-4">
                    <Button style={activo === "1"? estiloBotonActivo : estiloBotonInactivo } onClick={() => {setRol(1); setActivo("1")}}> Estudiantes </Button>

                    <Button style={activo === "2"? estiloBotonActivo : estiloBotonInactivo } onClick={() => {setRol(2); setActivo("2")}}> Docentes </Button>
                    
                    <Button style={activo === "3"? estiloBotonActivo : estiloBotonInactivo } onClick={() => {setRol(3); setActivo("3")}}> Departamento </Button>
                </Col>
            </Row>

            <div className="p-4 mb-4 shadow rounded-4">

                <h4 className="border-bottom ps-3 pb-3">Resumen General</h4>

                <Row className="gap-4 p-3">
                    <Col className="p-4 text-center border rounded" style={{borderTopColor : "", }}>
                        {/* <i className="fa-solid fa-file-lines" style={{color: "grey", fontSize: "2rem", marginBottom: "10px"}}> </i> */}
                        <i className="fa-regular fa-file-lines" style={{color: "#339CFF", fontSize: "2rem", marginBottom: "10px"}}></i>
                        <p className="mb-0 text-muted fw-bold">Total de plantillas</p>
                        <p className="mb-0">{estadisticas.length}</p>
                    </Col>

                    <Col className="p-4 text-center border rounded">
                        <i className="fa-solid fa-star" style={{color: "#FECF2F", fontSize: "2rem", marginBottom: "10px"}}></i>
                        <p className="mb-0 text-muted fw-bold">Mejor plantilla</p>
                        <p className="mb-0">{mejorPlantilla? mejorPlantilla.titulo : "-"}</p>
                    </Col>

                    <Col className="p-4 text-center border rounded">
                        <i className="fa-solid fa-chart-simple" style={{color: "#3f9c56ff", fontSize: "2rem", marginBottom: "10px"}}></i>
                        {/* <i className="fa-solid fa-file-circle-check" ></i> */}
                        <p className="mb-0 text-muted fw-bold">Tasa promedio de respuestas</p>
                        <p className="mb-0"> {(tasaRespuestas? tasaRespuestas * 100 : 0)? (tasaRespuestas? tasaRespuestas * 100 : 0).toFixed(2) : "-"} %</p>
                    </Col>
                </Row>
            </div>

            <div className="p-3 border rounded shadow rounded-4">
                <h4 className="m-3 pb-4 border-bottom">Metricas por plantilla</h4>
                <Table>
                    <thead>
                        <tr className="text-center">
                        <th> <i className="fa-solid fa-clipboard-list text-muted"></i> Plantilla</th>
                        <th > <i className="fa-regular fa-circle-question text-muted"></i> <br /> Preguntas</th>
                        <th> <i className="fa-solid fa-circle-exclamation text-muted"></i> <br />Obligatorias</th>
                        <th> <i className="fa-solid fa-layer-group text-muted"></i> <br /> Secciones</th>
                        <th> <i className="fa-light fa-percent text-muted"> </i> <br />  Tasa respuestas</th>
                        <th> <i className="fa-regular fa-circle-check text-muted"></i> <br /> Completitud</th>
                        </tr>
                    </thead>
                    <tbody>
                        {estadisticas.length > 0? estadisticas.map((plantilla, indice) => (
                            <tr key={indice}>
                            <td className="text-center"> {plantilla.Titulo}</td>
                            <td className="text-center"> {plantilla.CantPreguntas}</td>
                            <td className="text-center"> {plantilla.CantObligatorias}</td>
                            <td className="text-center"> {plantilla.Grupos}</td>
                            <td className="text-center"> {(plantilla.TasaRespuestas * 100)?  (plantilla.TasaRespuestas * 100).toFixed(2) : "-"}  % </td>
                            <td className="text-center"> {(plantilla.Completitud * 100)? (plantilla.Completitud * 100).toFixed(2) : "-"} %</td>
                            </tr>
                        ))
                        :
                            <>
                                <tr key={0}>
                                <td className="text-center"> - </td>
                                    <td className="text-center"> - </td>
                                    <td className="text-center"> - </td>
                                    <td className="text-center"> - </td>
                                    <td className="text-center"> - % </td>
                                    <td className="text-center"> - %</td>
                                </tr>
                            </>
                        }
                    </tbody>
                </Table>
            </div>

        </Container>
    )

}