import { useEffect, useState } from "react"
import {Button, Col, Container, Form, Row} from "react-bootstrap"
import type { Parametros, PlantillaFormulario, Rol} from "../types"

export function PlanificarPeriodos(){

    const [roles, setRoles] = useState<Rol[]>()
    const [fechaInicio, setFechaInicio] = useState<string>("");
    const [fechaCierre, setFechaCierre] = useState<string>("");
    const fechaHoy = new Date().toISOString().split("T")[0];
    const [plantillas, setPlantillas] = useState<PlantillaFormulario[]>()

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


    const urlParametros = (`http://127.0.0.1:8000/Parametros/`)
    const [parametros, setParametros] = useState<Parametros>()
    const [modificacionesParametros, setModificacionesParametros] = useState<Parametros>()
    useEffect(() => {

        fetch(urlParametros)
        .then(response => response.json())
        .then((data) => {setParametros(data); setModificacionesParametros(data)})
        .catch(error => console.log(error));

    }, []);

    return(
        <Container className="d-flex flex-column gap-5 pb-5"> 
            <Row>
                <h2>Parametrización de los dictados</h2>
                <p>Configure los dictados para su asignación automatica</p>
            </Row>
                
            <Row className="p-2" style={{ borderLeft: "3px solid blue" }}>
                    <h4 className="mb-4">Primer Dictado</h4>
                    <Col>
                        <div className="d-flex flex-column">
                            <Form.Label className="text-muted">Fecha de inicio: </Form.Label>
                            <input type="date" value={String(modificacionesParametros?.inicio_primer_dictado)} onChange={(e) => setFechaInicio(e.target.value)} className="border p-2 rounded-3" min={fechaHoy}/>
                        </div>
                    </Col>
                    <Col>
                        <div className="d-flex flex-column">
                            <Form.Label className="text-muted">Fecha de cierre: </Form.Label>
                            <input type="date" value={String(modificacionesParametros?.cierre_primer_dictado)} onChange={(e) => setFechaCierre(e.target.value)} className="border p-2 rounded-3" min={fechaInicio}/>
                        </div>
                    </Col>
            </Row>

            <Row className="p-2" style={{ borderLeft: "3px solid blue" }}>
                    <h4 className="mb-4">Segundo Dictado</h4>
                    <Col>
                        <div className="d-flex flex-column">
                            <Form.Label className="text-muted">Fecha de inicio: </Form.Label>
                            <input type="date" value={String(modificacionesParametros?.inicio_segundo_dictado)} onChange={(e) => setFechaInicio(e.target.value)} className="border p-2 rounded-3" min={fechaHoy}/>

                            
                        </div>
                    </Col>
                    <Col>
                        <div className="d-flex flex-column">
                            <Form.Label className="text-muted">Fecha de cierre: </Form.Label>
                            <input disabled={fechaInicio == ""} type="date" value={String(modificacionesParametros?.cierre_segundo_dictado)} onChange={(e) => setFechaCierre(e.target.value)} className="border p-2 rounded-3" min={fechaInicio}/>
                        </div>
                    </Col>
            </Row>

            <Row className="p-2" style={{ borderLeft: "3px solid blue" }}>
                <h4 className="mb-4">Plantillas</h4>
                <Col>
                    <Form.Label className="text-muted"> Plantilla del estudiante</Form.Label>
                    <Form.Select onChange={(e) => setRolSeleccionado(e.target.value)} value={rolSeleccionado}>
                        <option value="0" disabled>Seleccione una plantilla.. </option>
                        {roles?.map(rol =>  <option value={String(rol.id)} >{rol.nombre} </option>)}
                    </Form.Select>
                    
                </Col>
                <Col>
                    <Form.Label className="text-muted"> Plantilla del docente</Form.Label>
                    <Form.Select onChange={(e) => setRolSeleccionado(e.target.value)} value={rolSeleccionado}>
                        <option value="0" disabled>Seleccione una plantilla.. </option>
                        {roles?.map(rol =>  <option value={String(rol.id)} >{rol.nombre} </option>)}
                    </Form.Select>
                </Col>
                <Col>
                    <Form.Label className="text-muted"> Plantilla del departamento</Form.Label>
                    <Form.Select onChange={(e) => setRolSeleccionado(e.target.value)} value={rolSeleccionado}>
                        <option value="0" disabled>Seleccione una plantilla... </option>
                        {roles?.map(rol =>  <option value={String(rol.id)} >{rol.nombre} </option>)}
                    </Form.Select>
                </Col>
            </Row>

            <Row className="p-2" style={{ borderLeft: "3px solid blue" }}>
                <h4 className="mb-4"> Disponibilidad de Formularios</h4>
                <Col className="d-flex justify-content-center flex-column">
                        <Form.Label>Estudiante</Form.Label>
                        <Form.Control type="number" name="estudiante" value={modificacionesParametros?.disponibilidad_estudiante} min={0} placeholder="Cantidad de dias"
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value <= 30) {
                                    setModificacionesParametros({
                                        ...modificacionesParametros!,
                                        disponibilidad_estudiante: value,
                                    });
                                }
                            }}
                        />
                </Col>

                    <Col className="d-flex justify-content-center flex-column">
                        <Form.Label>Docente</Form.Label>
                        <Form.Control type="number" name="docente" value={modificacionesParametros?.disponibilidad_docente ?? ""} min={0} max={30} placeholder="Cantidad de dias"
                        
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value <= 30) {
                                    setModificacionesParametros({
                                        ...modificacionesParametros!,
                                        disponibilidad_docente: value,
                                    });
                                }
                            }}
                        />
                    </Col>

                    <Col className="d-flex justify-content-center flex-column">
                        <Form.Label>Departamento</Form.Label>
                        <Form.Control type="number" name="departamento" value={modificacionesParametros?.disponibilidad_departamento ?? ""} min={0} max={30} placeholder="Cantidad de dias"
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value <= 30) {
                                    setModificacionesParametros({
                                        ...modificacionesParametros!,
                                        disponibilidad_departamento: value,
                                    });
                                }
                            }}
                        />

                    </Col>
            </Row>

            <Row className="d-flex align-items-center justify-content-center">
                <Col xs={3}>
                    <Button  variant="success"><i className="fa-solid fa-floppy-disk"></i> Guardar configuración </Button>
                </Col>
                <Col xs={1}>
                    <Button  variant="outline-secondary" onClick={() => setModificacionesParametros(parametros)}> Limpiar</Button>
                </Col>
            </Row>

        </Container>

    )



} 