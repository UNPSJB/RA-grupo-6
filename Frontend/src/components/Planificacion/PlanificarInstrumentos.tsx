import { useEffect, useState } from "react"
import {Button, Card, Col, Container, Form, Nav, Row, Tab} from "react-bootstrap"
import type { Planificacion, PlantillaFormulario, Rol} from "../types"

export function PlanificarPeriodos(){

    const [mostrar, setMostrar] = useState(false)
    const [roles, setRoles] = useState<Rol[]>()
    const [fechaInicio, setFechaInicio] = useState<string>("");
    const [fechaCierre, setFechaCierre] = useState<string>("");
    const fechaHoy = new Date().toISOString().split("T")[0];
    const [plantillas, setPlantillas] = useState<PlantillaFormulario[]>()
    const [plantillaSeleccionada, setPlantillaSeleccionada] = useState("")
    const [rolSeleccionado, setRolSeleccionado] = useState<string>("0")

    const url_roles = "http://127.0.0.1:8000/roles/"
    useEffect(() => {
        fetch(url_roles)
        .then(response => response.json())
        .then((data) => setRoles(data))
        .catch(error => console.log(error));
    }, []);

    const url_plantillas = `http://127.0.0.1:8000/formularios/rol/${rolSeleccionado}`
    useEffect(() => {
        if(rolSeleccionado != "0"){

            fetch(url_plantillas)
            .then(response => response.json())
            .then((data) => setPlantillas(data))
            .catch(error => console.log(error));
        }

    }, [rolSeleccionado]);
    
    const urlPlanificaciones = (`http://127.0.0.1:8000/Planificaciones/get_proximos_periodos`)
    const [proximosPeriodos, setProximosPeriodos] = useState<Planificacion[]>([])
    
    useEffect(() => {

        fetch(urlPlanificaciones)
        .then(response => response.json())
        .then((data) => setProximosPeriodos(data))
        .catch(error => console.log(error));

    }, [urlPlanificaciones]);


    function crearPlanificacion(){

        const nuevaPlanificacion = {
            fecha_inicio: fechaInicio,
            fecha_cierre: fechaCierre,
            plantilla_formulario_id: Number(plantillaSeleccionada)
        }

        fetch("http://127.0.0.1:8000/Planificaciones/",{
            method: "POST",
            headers:{ "Content-Type": "application/json" },
            body: JSON.stringify(nuevaPlanificacion),
        }).then(() =>{
            setFechaInicio("");
            setFechaCierre("");
            setRolSeleccionado("0");
            setPlantillaSeleccionada("");
        });
    }

    function diasEntreFechas(fecha1: Date, fecha2:Date){
        
        var msFecha1 = fecha1.getTime()
        var msFecha2 = fecha2.getTime()

        return Math.round(((msFecha2 - msFecha1) / (1000 * 60 * 60 * 24)))
    }


    return(
        <Container className="d-flex flex-column gap-4"> 
            <Row className="border rounded-4 p-3 shadow mt-3">
                <Col xs={10}>
                    <h3>Planificación de periodos</h3>
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
                
                <Row className="pt-3 ps-3 pe-3">

                        <Form.Label className="text-muted"> Plantilla del estudiante</Form.Label>
                        <Form.Select onChange={(e) => setRolSeleccionado(e.target.value)} value={rolSeleccionado}>
                            <option value="0" disabled>Seleccione un rol... </option>
                            {roles?.map(rol =>  <option value={String(rol.id)} >{rol.nombre} </option>)}
                        </Form.Select>
                </Row>

                <Row className="pt-3 ps-3 pe-3">

                        <Form.Label className="text-muted"> Plantilla del estudiante</Form.Label>
                        <Form.Select onChange={(e) => setRolSeleccionado(e.target.value)} value={rolSeleccionado}>
                            <option value="0" disabled>Seleccione un rol... </option>
                            {roles?.map(rol =>  <option value={String(rol.id)} >{rol.nombre} </option>)}
                        </Form.Select>
                </Row>

                <Row className="pt-3 ps-3 pe-3">

                        <Form.Label className="text-muted"> Plantilla del estudiante</Form.Label>
                        <Form.Select onChange={(e) => setRolSeleccionado(e.target.value)} value={rolSeleccionado}>
                            <option value="0" disabled>Seleccione un rol... </option>
                            {roles?.map(rol =>  <option value={String(rol.id)} >{rol.nombre} </option>)}
                        </Form.Select>
                </Row>

                <Row className="p-2">

                    <Col>
                        <div className="d-flex flex-column">
                            <Form.Label className="text-muted">Fecha de inicio: </Form.Label>
                            <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="border p-2 rounded-3" min={fechaHoy}/>
                        </div>
                    </Col>
                    <Col>
                        <div className="d-flex flex-column">
                            <Form.Label className="text-muted">Fecha de cierre: </Form.Label>
                            <input disabled={fechaInicio == ""} type="date" value={fechaCierre} onChange={(e) => setFechaCierre(e.target.value)} className="border p-2 rounded-3" min={fechaInicio}/>
                        </div>
                    </Col>
                </Row>

                {/* <Row className="d-flex gap-3">
                    <Col className="d-flex flex-column gap-3">
                        <div>
                            <Form.Label className="text-muted">Dirigido a</Form.Label>
                            <Form.Select onChange={(e) => setRolSeleccionado(e.target.value)} value={rolSeleccionado}>
                                <option value="0" disabled>Seleccione un rol... </option>
                                {roles?.map(rol =>  <option value={String(rol.id)} >{rol.nombre} </option>)}
                            </Form.Select>
                        </div>

                        <div className="d-flex flex-column">
                            <Form.Label className="text-muted">Fecha de inicio: </Form.Label>
                            <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="border p-2 rounded-3" min={fechaHoy}/>
                        </div>
                    </Col>

                    <Col className="d-flex flex-column gap-3">
                        <div>
                            <Form.Label className="text-muted">Plantilla: </Form.Label>
                            <Form.Select disabled={rolSeleccionado== "0"} value={plantillaSeleccionada} onChange={(e) => setPlantillaSeleccionada(e.target.value)}>
                                <option disabled value={""}>Seleccione una plantilla... </option>
                                {plantillas?.map(plantilla =>  <option value={plantilla.id}>{plantilla.titulo} </option>)}
                            </Form.Select>
                        </div>
                        
                        <div className="d-flex flex-column">
                            <Form.Label className="text-muted">Fecha de cierre: </Form.Label>
                            <input disabled={fechaInicio == ""} type="date" value={fechaCierre} onChange={(e) => setFechaCierre(e.target.value)} className="border p-2 rounded-3" min={fechaInicio}/>
                        </div>

                    </Col>

                </Row> */}


                <Row className="d-flex justify-content-end">
                    <Col className="d-flex justify-content-end gap-4" >
                        <Button variant="outline-secondary" onClick={() => setMostrar(false)}>
                            Cancelar
                        </Button>

                        <Button variant="success">
                            <i className="fa-regular fa-floppy-disk"></i> <span style={{fontWeight:600}} onClick={() => crearPlanificacion()}> Guardar </span>
                        </Button>
                    </Col>

                </Row>

            </div>

            }

            <div className="border rounded-4 p-3">
                <h4><i className="fa-regular fa-calendar"></i> Periodos planificados</h4>
            </div>

            {/* <div className="border rounded-4 p-3 ">

                <Tab.Container >

                    <Row className="d-flex justify-content-between border-bottom align-items-center ">
                        <Col xs="auto">
                            <h4><i className="fa-regular fa-calendar"></i> Periodos planificados</h4>
                        </Col>
                        <Col xs="auto">
                            <Nav variant="tabs" >
                                <Nav.Item>
                                    <Nav.Link> Todos </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link> Estudiante </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link> Docente </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link> Departamento </Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                    </Row>

                    <Tab.Content className="p-3" >
                        <Tab.Pane eventKey={0} >  </Tab.Pane>
                        <Tab.Pane eventKey={1} > Estudiante </Tab.Pane>
                        <Tab.Pane eventKey={2} > Docente </Tab.Pane>
                        <Tab.Pane eventKey={3} > Departamento </Tab.Pane>

                        <div className="d-flex">

                        {proximosPeriodos? proximosPeriodos.map((proximoPeriodo) => 
                            
                            <Card className="shadow-sm ">

                                <p>{proximoPeriodo.plantilla_formulario.titulo}</p>
                                <p><span className="fw-bold" style={{color:"#141212ff"}}>Inicio:</span> {String(proximoPeriodo.fecha_inicio)}</p>
                                <p><span className="fw-bold" style={{color:"#141212ff"}}>Cierre:</span> {String(proximoPeriodo.fecha_cierre)}</p>
                                <p className="fw-bold mb-0" style={{color:"#1969ffff"}}> Comienza en {diasEntreFechas(new Date(proximoPeriodo.fecha_inicio), new Date())} dias</p>
                            </Card>
                                
                        )
                        :
                            <div className="text-center">    
                                <i style={{opacity: 0.5 }} className="fas fa-inbox fa-3x text-muted mb-3"></i>
                                <p className="text-muted">No hay periodos planificados</p>
                                <p className="text-muted">Los periodos planificados aparecerán acá</p>
                            </div>

                        }
                        </div>

                    </Tab.Content>
                </Tab.Container>
            </div> */}
                
        </Container>

    )



} 