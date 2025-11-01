import { Card, Col, Container, Row } from "react-bootstrap";
import { GraficoRespondidos } from "../Graficos/GraficoRespondidos";
import { useEffect, useState } from "react";

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
                    
                    <Card className="shadow-none" style={{width: '75%'}}>
                        <div className="d-flex justify-content-center">
                            <GraficoRespondidos titulo='Todos' respondidos={totalesRespondidos} noRespondidos={totalesAsignadas - totalesRespondidos}/>
                        </div>
                        <hr />
                        <Card.Body>
                            <Row>
                                <Col>
                                    <p className="mb-0">
                                        <span className="fw-bold text-success" style={{fontSize: '24px'}}>{totalesRespondidos}</span> <br /> Respondidos
                                    </p>
                                </Col>

                                <Col>
                                    <p className="mb-0">
                                        <span className="fw-bold text-danger" style={{fontSize: '24px'}}>{totalesAsignadas - totalesRespondidos}</span> <br />Sin responder
                                    </p>
                                </Col>

                                <Col>
                                    <p className="mb-0">
                                        <span className="fw-bold" style={{fontSize: '24px'}}>{totalesAsignadas}</span> <br /> Total
                                    </p>
                                </Col>

                                </Row>
                        </Card.Body>

                    </Card>
                </Col>

                <Col xs={6} className="d-flex justify-content-center">
                    
                    <Card className="shadow-none" style={{width: '75%'}}>
                        <div className="d-flex justify-content-center">
                            <GraficoRespondidos titulo='Estudiantes' respondidos={estadisticas? estadisticas.Respondidas_Alumno : 0} noRespondidos={(estadisticas? (estadisticas.Asignadas_Alumno - estadisticas.Respondidas_Alumno) : 0) }/>
                        </div>
                        <hr />
                        <Card.Body>
                            <Row>
                                <Col>
                                    <p className="mb-0">
                                        <span className="fw-bold text-success" style={{fontSize: '24px'}}> {estadisticas? estadisticas.Respondidas_Alumno : 0} </span> <br /> Respondidos
                                    </p>
                                </Col>

                                <Col>
                                    <p className="mb-0">
                                        <span className="fw-bold text-danger" style={{fontSize: '24px'}}> {(estadisticas? (estadisticas.Asignadas_Alumno - estadisticas.Respondidas_Alumno) : 0) }</span> <br />Sin responder
                                    </p>
                                </Col>

                                <Col>
                                    <p className="mb-0">
                                        <span className="fw-bold" style={{fontSize: '24px'}}> {estadisticas? estadisticas.Asignadas_Alumno : 0} </span> <br /> Total
                                    </p>
                                </Col>

                                </Row>
                        </Card.Body>

                    </Card>
                </Col>

                

            </Row>
            <Row className="d-flex justify-content-center m-4">
                <Col xs={6} className="d-flex justify-content-center">
                    
                    <Card className="shadow-none" style={{width: '75%'}}>
                        <div className="d-flex justify-content-center">
                            <GraficoRespondidos titulo='Docentes' respondidos={estadisticas? estadisticas.Respondidas_Docente : 0} noRespondidos={(estadisticas? (estadisticas.Asignadas_Docente - estadisticas.Respondidas_Docente) : 0) }/>
                        </div>
                        <hr />
                        <Card.Body>
                            <Row>
                                <Col>
                                    <p className="mb-0">
                                        <span className="fw-bold text-success" style={{fontSize: '24px'}}> {estadisticas? estadisticas.Respondidas_Docente : 0} </span> <br /> Respondidos
                                    </p>
                                </Col>

                                <Col>
                                    <p className="mb-0">
                                        <span className="fw-bold text-danger" style={{fontSize: '24px'}}> {(estadisticas? (estadisticas.Asignadas_Docente - estadisticas.Respondidas_Docente) : 0) }</span> <br />Sin responder
                                    </p>
                                </Col>

                                <Col>
                                    <p className="mb-0">
                                        <span className="fw-bold" style={{fontSize: '24px'}}> {estadisticas? estadisticas.Asignadas_Docente : 0} </span> <br /> Total
                                    </p>
                                </Col>

                                </Row>
                        </Card.Body>

                    </Card>
                </Col>
                <Col xs={6} className="d-flex justify-content-center">
                    
                    <Card className="shadow-none" style={{width: '75%'}}>
                        <div className="d-flex justify-content-center">
                            <GraficoRespondidos titulo='Departamentos' respondidos={estadisticas? estadisticas.Respondidas_Departamento : 0} noRespondidos={(estadisticas? (estadisticas.Asignadas_Departamento - estadisticas.Respondidas_Departamento) : 0) }/>
                        </div>
                        <hr />
                        <Card.Body>
                            <Row>
                                <Col>
                                    <p className="mb-0">
                                        <span className="fw-bold text-success" style={{fontSize: '24px'}}> {estadisticas? estadisticas.Respondidas_Departamento : 0} </span> <br /> Respondidos
                                    </p>
                                </Col>

                                <Col>
                                    <p className="mb-0">
                                        <span className="fw-bold text-danger" style={{fontSize: '24px'}}> {(estadisticas? (estadisticas.Asignadas_Departamento - estadisticas.Respondidas_Departamento) : 0) }</span> <br />Sin responder
                                    </p>
                                </Col>

                                <Col>
                                    <p className="mb-0">
                                        <span className="fw-bold" style={{fontSize: '24px'}}> {estadisticas? estadisticas.Asignadas_Departamento : 0} </span> <br /> Total
                                    </p>
                                </Col>

                                </Row>
                        </Card.Body>

                    </Card>
                </Col>
            </Row>



        </Container>

    )


}