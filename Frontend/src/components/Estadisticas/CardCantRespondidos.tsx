import { Card, Col, Row } from "react-bootstrap";
import { GraficoRespondidos } from "../Graficos/GraficoRespondidos";



export function CardCantRespondidos({titulo, totalesRespondidos, totalesAsignadas} : {titulo: string, totalesRespondidos:number, totalesAsignadas: number}){

    return(
            <Card className="shadow-none" style={{width: '75%'}}>
                <div className="d-flex justify-content-center">
                    <GraficoRespondidos titulo={titulo} respondidos={totalesRespondidos} noRespondidos={totalesAsignadas - totalesRespondidos}/>
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

    )

}