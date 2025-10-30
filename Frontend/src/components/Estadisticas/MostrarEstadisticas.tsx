import { Col, Container, Row } from "react-bootstrap";
import { GraficoRespondidos } from "../Graficos/GraficoRespondidos";



export function MostrarEstadisticas(){



    return(

        <Container className="text-center ">
            <h2 className="m-4"> Tasa de respuestas totales</h2>
            <div className="d-flex gap-5 flex-column">
                <Row className="d-flex justify-content-center m-4">
                    <Col xs={4} className="d-flex justify-content-center">
                        <GraficoRespondidos titulo='Todos' respondidos={10} noRespondidos={20}/>
                    </Col>
                    <Col xs={4} className="d-flex justify-content-center">
                        <GraficoRespondidos titulo='Estudiantes' respondidos={20} noRespondidos={15}/>
                    </Col>
                </Row>

                <Row className="d-flex justify-content-center m-4">
                    <Col xs={4} className="d-flex justify-content-center">
                        <GraficoRespondidos titulo='Docentes' respondidos={3} noRespondidos={21}/>
                    </Col>
                    <Col xs={4} className="d-flex justify-content-center">
                        <GraficoRespondidos titulo='Departamentos' respondidos={50} noRespondidos={7}/>
                    </Col>
                </Row>
            </div>


        </Container>

    )


}