import { Col, Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { CardCantRespondidos } from "./CardCantRespondidos";

export interface EstadisticasDictado {
    Respondidas_Alumno: number;
    Asignadas_Alumno: number;
    Respondidas_Docente: number;
    Asignadas_Docente: number;
    Respondidas_Departamento: number;
    Asignadas_Departamento: number;
}


export function MostrarEstadisticas(){

    const url_base = "http://127.0.0.1:8000/Dictados/CantidadRespuestas" 

    const [estadisticas, setEstadisticas] = useState<EstadisticasDictado>()

    useEffect(() => {
        fetch(url_base)
            .then(response => response.json())
            .then((data) => setEstadisticas(data))
            .catch(error => console.log(error));
    }, []);

    const totalesRespondidos = estadisticas? (estadisticas.Respondidas_Alumno + estadisticas.Respondidas_Docente + estadisticas.Respondidas_Departamento) : 0
    const totalesAsignadas = estadisticas? (estadisticas.Asignadas_Alumno + estadisticas.Asignadas_Docente + estadisticas.Asignadas_Departamento) : 0

    return(

        <Container className="text-center ">
            <h2 className="m-4"> Tasa de respuestas totales</h2>

            <Row className="d-flex justify-content-center m-4">

                <Col xs={6} className="d-flex justify-content-center">
                    <CardCantRespondidos titulo={"Todos"} totalesAsignadas={totalesAsignadas}  totalesRespondidos={totalesRespondidos}/>
                </Col>

                <Col xs={6} className="d-flex justify-content-center">
                    <CardCantRespondidos titulo={"Estudiantes"} totalesAsignadas={estadisticas? estadisticas.Asignadas_Alumno :0}  totalesRespondidos={estadisticas? estadisticas.Respondidas_Alumno :0}/>
                </Col>
            </Row>

            <Row className="d-flex justify-content-center m-4">
                <Col xs={6} className="d-flex justify-content-center">
                    <CardCantRespondidos titulo={"Docentes"} totalesAsignadas={estadisticas? estadisticas.Asignadas_Docente :0}  totalesRespondidos={estadisticas? estadisticas.Respondidas_Docente :0}/>
                </Col>
                <Col xs={6} className="d-flex justify-content-center">
                    
                    <CardCantRespondidos titulo={"Departamentos"} totalesAsignadas={estadisticas? estadisticas.Asignadas_Departamento :0}  totalesRespondidos={estadisticas? estadisticas.Respondidas_Departamento :0}/>
                </Col>
            </Row>
        
        </Container>


    )


}