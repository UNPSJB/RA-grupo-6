import { useState } from "react"
import { Button, Col, Container, Form, Row } from "react-bootstrap"


const roles = ["Estudiante", "Docente", "Departamento"]


export function PlanificarPeriodos(){

    const [mostrar, setMostrar] = useState(false)
    const [icono, setIcono] = useState(<i className="fa-solid fa-circle-plus"></i>)


    function manejarClick(){
        setMostrar(!mostrar)

        if(mostrar){
            setIcono(<i className="fa-solid fa-circle-plus"></i>)
        }
        else{
            setIcono(<i className="fa-solid fa-circle-minus"></i>)
        }

    }

    return(
        <Container className="d-flex flex-column gap-4"> 
            <Row className="border rounded-4 p-3">
                <Col xs={10}>
                    <h2>Planificación de periodos</h2>
                </Col>
                <Col xs={2}>
                    <Button onClick={() => manejarClick()}>{icono} Nuevo periodo</Button>
                </Col>
            </Row>

            {mostrar &&

            <Row className="border rounded-4 p-3">
                <h4>Planificar un periodo</h4>
                
                <Form.Select>
                    <option disabled>Seleccione un rol... </option>
                    {roles.map(rol => 
                    <option value="">{rol}</option>
                    )
                }
                </Form.Select>

            </Row>
            }

            <Row className="border rounded-4 p-3">
                <h4>Periodos próximos</h4>
            </Row>



        </Container>

    )



} 