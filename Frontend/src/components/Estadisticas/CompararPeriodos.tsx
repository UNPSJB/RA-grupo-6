import { useState } from "react"
import { Accordion, Col, Container, Form, Row } from "react-bootstrap"



export function CompararPeriodos(){
    
    const [valor, setValor] = useState("")

    return(
        <Container>
            <Row className="p-3 d-flex justify-content-around">
                <Col xs={4} className="border rounded border-black text-center p-3">
                    <h4 className="border-bottom border-black p-3">Primer instrumento</h4>
                    <Form.Select onChange={(e) => setValor(e.target.value)}>
                        <option defaultChecked value="" >Seleccione un instrumento... </option>
                        <option value="H1" >Instrumento 1</option>
                        <option value="h2">Instrumento 1</option>
                        <option value="h3">Instrumento 2</option>
                        <option value="h3">Instrumento 3</option>
                    </Form.Select>
                </Col>

                <Col xs={4} className="border rounded border-black text-center p-3">
                    <h4  className="border-bottom border-black p-3">Segundo instrumento</h4>
                    <Form.Select disabled={!valor}>
                        <option >Seleccione un instrumento... </option>
                        <option value="" >Instrumento 1</option>
                        <option value="">Instrumento 1</option>
                        <option value="">Instrumento 2</option>
                        <option value="">Instrumento 3</option>
                    </Form.Select>
                </Col>
            </Row>
            
            <Accordion className="m-5" defaultActiveKey={"0"}>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        % Respondidos
                    </Accordion.Header>

                    <Accordion.Body>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deserunt, facilis officia sapiente quos, maiores obcaecati id excepturi sunt, nostrum rem nesciunt fugit. Provident voluptas reiciendis alias veniam, quia corporis! Quam.
                    </Accordion.Body>
                </Accordion.Item>



            </Accordion>

        </Container>
    )

}