import { Card, Col, Container, Row } from "react-bootstrap";
import { GraficoRespondidos } from "../Graficos/GraficoRespondidos";



export function MostrarEstadisticas(){



    return(

        <Container className="text-center ">
            <h2 className="m-4"> Tasa de respuestas totales</h2>

            <Row className="d-flex justify-content-center m-4">
                <Col xs={6} className="d-flex justify-content-center">
                    
                    <Card className="shadow-none" style={{width: '75%'}}>
                        <div className="d-flex justify-content-center">
                            <GraficoRespondidos titulo='Todos' respondidos={10} noRespondidos={20}/>
                        </div>
                        <hr />
                        <Card.Body>
                            <Row>
                                <Col>
                                    <p className="mb-0">
                                        <span className="fw-bold text-success" style={{fontSize: '24px'}}>10</span> <br /> Respondidos
                                    </p>
                                </Col>

                                <Col>
                                    <p className="mb-0">
                                        <span className="fw-bold text-danger" style={{fontSize: '24px'}}>20</span> <br />Sin responder
                                    </p>
                                </Col>

                                <Col>
                                    <p className="mb-0">
                                        <span className="fw-bold" style={{fontSize: '24px'}}>30</span> <br /> Total
                                    </p>
                                </Col>

                                </Row>
                        </Card.Body>

                    </Card>
                </Col>

                
                <Col xs={6} className="d-flex justify-content-center">
                    
                    <Card className="shadow-none" style={{width: '75%'}}>
                        <div className="d-flex justify-content-center">
                            <GraficoRespondidos titulo='Estudiantes' respondidos={10} noRespondidos={20}/>
                        </div>
                        <hr />
                        <Card.Body>
                            <Row>
                                <Col>
                                    <p className="mb-0">
                                        <span className="fw-bold text-success" style={{fontSize: '24px'}}>10</span> <br /> Respondidos
                                    </p>
                                </Col>

                                <Col>
                                    <p className="mb-0">
                                        <span className="fw-bold text-danger" style={{fontSize: '24px'}}>20</span> <br />Sin responder
                                    </p>
                                </Col>

                                <Col>
                                    <p className="mb-0">
                                        <span className="fw-bold" style={{fontSize: '24px'}}>30</span> <br /> Total
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
                            <GraficoRespondidos titulo='Docentes' respondidos={10} noRespondidos={20}/>
                        </div>
                        <hr />
                        <Card.Body>
                            <Row>
                                <Col>
                                    <p className="mb-0">
                                        <span className="fw-bold text-success" style={{fontSize: '24px'}}>10</span> <br /> Respondidos
                                    </p>
                                </Col>

                                <Col>
                                    <p className="mb-0">
                                        <span className="fw-bold text-danger" style={{fontSize: '24px'}}>20</span> <br />Sin responder
                                    </p>
                                </Col>

                                <Col>
                                    <p className="mb-0">
                                        <span className="fw-bold" style={{fontSize: '24px'}}>30</span> <br /> Total
                                    </p>
                                </Col>

                                </Row>
                        </Card.Body>

                    </Card>
                </Col>

                                <Col xs={6} className="d-flex justify-content-center">
                    
                    <Card className="shadow-none" style={{width: '75%'}}>
                        <div className="d-flex justify-content-center">
                            <GraficoRespondidos titulo='Departamentos' respondidos={10} noRespondidos={20}/>
                        </div>
                        <hr />
                        <Card.Body>
                            <Row>
                                <Col>
                                    <p className="mb-0">
                                        <span className="fw-bold text-success" style={{fontSize: '24px'}}>10</span> <br /> Respondidos
                                    </p>
                                </Col>

                                <Col>
                                    <p className="mb-0">
                                        <span className="fw-bold text-danger" style={{fontSize: '24px'}}>20</span> <br />Sin responder
                                    </p>
                                </Col>

                                <Col>
                                    <p className="mb-0">
                                        <span className="fw-bold" style={{fontSize: '24px'}}>30</span> <br /> Total
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