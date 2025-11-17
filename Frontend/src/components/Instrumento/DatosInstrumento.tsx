import {Col, Form, Row, Table,  } from "react-bootstrap";
import type { InstrumentoDetail, Usuario} from "../types";
import { capitalizarCadena } from "../Funciones";
import { useEffect, useState } from "react";





export function DatosInstrumentoDocente({instrumento} : {instrumento : InstrumentoDetail}){

    const [docente, setDocente] = useState<Usuario>()
    const [inscriptos, setInscriptos] = useState(0)
    const [comisionesTeoricas, setComisionesTeoricas] = useState("")
    const [comisionesPracticas, setComisionesPracticas] = useState("")

    // function inicializarProps(props : DatosInstrumentoDocenteProps,  instrumento: InstrumentoDetail){
    //     props.asignatura = capitalizarCadena(instrumento.materia.nombre)
    //     props.codAsignatura = instrumento.materia.id
    //     props.docente = capitalizarCadena(docente? (docente?.nombre + docente?.apellido) : "-")
    //     props.inscriptos = inscriptos
    //     props.cicloLectivo = (new Date(instrumento.dictado.fecha_inicio).getFullYear())
    //     props.sede = instrumento.departamento.sede
    // }

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/materias/get_docente/${instrumento.materia.id}`)
        .then(response => response.json())
        .then((data) => setDocente(data))
        .catch(error => console.log(error));

        fetch(`http://127.0.0.1:8000/Dictados/Inscriptos/${instrumento.materia.id}/${instrumento.id}`)
        .then(response => response.json())
        .then((data) => setInscriptos(data))
        .catch(error => console.log(error));

        // inicializarProps(props, instrumento)

    }, []);

    return( 
        <div className="mb-3">

            <Table striped bordered className="rounded-3 overflow-hidden mb-4" style={{tableLayout: "fixed"}}>
                <thead>
                    <tr className="text-center">
                        <th colSpan={5} style={{fontSize:"18px", backgroundColor:"#816767ff", color:"white"}}> DATOS </th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>
                            <p className="mb-0 text-center">
                                <span className='fw-bold'> Sede:</span> {capitalizarCadena(instrumento.departamento.sede)}
                            </p>
                        </td>

                        {instrumento.tipo === 'ENCUESTA_ESTUDIANTE'?  
                            <>
                                <td>
                                    <p className="mb-0 text-center">
                                        <span className="fw-bold"> Asignatura: </span> {capitalizarCadena(instrumento.materia.nombre)}
                                    </p>
                                </td>

                                <td>
                                    <p className="mb-0 text-center">
                                        <span className="fw-bold"> Carrera: </span> {capitalizarCadena(instrumento.materia.carrera.nombre)}
                                    </p>
                                </td>
                            </>
                        : 

                        <>
                            <td>
                                <p className="mb-0 text-center">
                                    <span className="fw-bold"> Ciclo Lectivo: </span> {(new Date(instrumento.dictado.fecha_inicio).getFullYear())}
                                </p>
                            </td>
                            <td>
                                <p className="mb-0 text-center">
                                    <span className="fw-bold"> Actividad Curricular: </span> {capitalizarCadena(instrumento.materia.nombre)} ({instrumento.materia.id})
                                </p>
                            </td>
                            <td>
                                <p className="mb-0 text-center">
                                    <span className="fw-bold"> Docente: </span> {docente && capitalizarCadena((docente?.nombre + " "+ docente?.apellido))}
                                </p>
                            </td>
                            
                            <td>
                                <p className="mb-0 text-center">
                                    <span className="fw-bold"> Inscriptos: </span> {inscriptos} 
                                </p>
                            </td>
                        </>
                        
                    }
                    </tr>
                </tbody>
            </Table>

            <Row>
                <Col>
                    <Form.Group className="mb-3 text-center">
                        <Form.Label htmlFor="comisiones-teoricas" className="labelStyle fw-semibold"> Comisiones teoricas </Form.Label>
                        <Form.Control
                            as="input"
                            type="number"
                            min={1}
                            id="comisiones-teoricas"
                            placeholder="Número de comisiones teóricas..."
                            required
                            value={comisionesTeoricas}
                            onChange={(e) => Number(e.target.value) > 0? setComisionesTeoricas(e.target.value) : setComisionesTeoricas("")}
                            style={{borderRadius:"10px", marginTop:"8px",}}
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3 text-center">
                        <Form.Label htmlFor="comisiones-practicas" className="labelStyle fw-semibold"> Comisiones prácticas </Form.Label>
                        <Form.Control
                            as="input"
                            type="number"
                            min={1}
                            id="comisiones-practicas"
                            placeholder="Número de comisiones prácticas..."
                            required
                            value={comisionesPracticas}
                            onChange={(e) => Number(e.target.value) > 0? setComisionesPracticas(e.target.value) : setComisionesPracticas("")}
                            style={{borderRadius:"10px", marginTop:"8px",}}
                        />
                    </Form.Group>
                </Col>
            </Row>


        </div>
        

    )


} 