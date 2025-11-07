import { useState } from "react"
import { Badge, Button, Col, Container, Form, Row } from "react-bootstrap"

const roles = ["Estudiante", "Docente", "Departamento"]


export function PlanificarPeriodos(){

    const [mostrar, setMostrar] = useState(false)

    return(
        <Container className="d-flex flex-column gap-4"> 
            <Row className="border rounded-4 p-3 shadow mt-3">
                <Col xs={10}>
                    <h2>Planificación de periodos</h2>
                </Col>
                {!mostrar &&
                <Col className="d-flex justify-content-end" xs={2} >
                    <Button onClick={() => setMostrar(true)} > <i className="fa-solid fa-plus"></i> {mostrar?  " Cancelar": " Nuevo periodo" }  </Button>
                </Col>
                }
            </Row>

            {mostrar &&

            <div className="d-flex flex-column gap-3 border rounded-4 p-4 ">

                <Row >
                    <Col xs={11}>
                        <h4>Crear un nuevo periodo</h4>
                    </Col>
                    <Col xs={1} className="d-flex justify-content-end ">
                        <Button onClick={() => setMostrar(false)} variant="link"><i className="fa-solid fa-xmark" style={{color:"grey", fontSize:"24px"}}></i></Button>
                    </Col>
                </Row>


                <Row className="d-flex gap-3">
                    <Col className="d-flex flex-column gap-3">
                        <div>

                        <Form.Label className="text-muted">Dirigido a</Form.Label>
                        <Form.Select>
                            <option disabled>Seleccione un rol... </option>
                            {roles.map(rol =>  <option value="">{rol} </option>)}
                        </Form.Select>
                        </div>

                        <div>

                            <Form.Label className="text-muted">Fecha de inicio: </Form.Label>
                            <Form.Select>
                                <option disabled>Seleccione un rol... </option>
                                {roles.map(rol =>  <option value="">{rol} </option>)}
                            </Form.Select>
                        </div>
                    </Col>

                    <Col className="d-flex flex-column gap-3">
                    <div>
                        <Form.Label className="text-muted">Plantilla: </Form.Label>
                        <Form.Select>
                            <option disabled>Seleccione un rol... </option>
                            {roles.map(rol =>  <option value="">{rol} </option>)}
                        </Form.Select>
                    </div>
                    <div>

                        <Form.Label className="text-muted">Fecha de cierre: </Form.Label>
                        <Form.Select>
                            <option disabled>Seleccione un rol... </option>
                            {roles.map(rol =>  <option value="">{rol} </option>)}
                        </Form.Select>
                    </div>

                    </Col>

                </Row>


                <Row className="d-flex justify-content-end">
                    <Col className="d-flex justify-content-end gap-4" >
                        <Button variant="outline-secondary" onClick={() => setMostrar(false)}>
                            Cancelar
                        </Button>

                        <Button variant="success">
                            <i className="fa-regular fa-floppy-disk"></i> <span style={{fontWeight:600}}> Guardar </span>
                        </Button>
                    </Col>

                </Row>

            </div>

            }

            <h4><i className="fa-regular fa-clock"></i> Periodos próximos</h4>
            <Row className="border rounded-4 p-3">
                <Col className="text-center">
                    <Badge className="p-2" > Estudiantes </Badge>
                </Col>    
                <Col className="text-center" >
                    <Badge className="p-2" > Docentes </Badge>
                </Col>    
                <Col className="text-center">
                    <Badge className="p-2"> Departamentos </Badge>
                </Col>    
                
            </Row>

            <h4><i className="fa-regular fa-calendar"></i> Periodos planificados</h4>
            <Row className="border rounded-4 p-3 ">
                <h5 className="text-muted">No hay periodos planificados</h5>
                <p className="text-muted">Los periodos planificados aparecerán acá </p>
            </Row>
        </Container>

    )



} 