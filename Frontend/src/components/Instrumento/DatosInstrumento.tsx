import {Table,  } from "react-bootstrap";
import type { InstrumentoDetail, Usuario} from "../types";
import { capitalizarCadena } from "../Funciones";
import { useEffect, useState } from "react";


export function DatosInstrumentoDocente({instrumento} : {instrumento : InstrumentoDetail}){

    const [docente, setDocente] = useState<Usuario>()
    const [inscriptos, setInscriptos] = useState(0)

    const [cantidadColumnas, setCantidadColumnas] = useState(0)

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/materias/get_docente/${instrumento.materia.id}`)
        .then(response => response.json())
        .then((data) => setDocente(data))
        .catch(error => console.log(error));

        fetch(`http://127.0.0.1:8000/Dictados/Inscriptos/${instrumento.materia.id}/${instrumento.id}`)
        .then(response => response.json())
        .then((data) => setInscriptos(data))
        .catch(error => console.log(error));

        if(instrumento.tipo == 'ENCUESTA_ESTUDIANTE'){
            setCantidadColumnas(3)

        }
        else{

            if (instrumento.tipo == 'INFORME_CATEDRA'){
                setCantidadColumnas(4)       
            }
            else{
                setCantidadColumnas(8)
            }
        }



    }, []);


    return( 
        <div className="mb-3">

            <Table striped bordered className="rounded-3 overflow-hidden mb-4" style={{tableLayout: "fixed"}}>
                <thead>
                    <tr className="text-center">
                        <th colSpan={cantidadColumnas} style={{fontSize:"18px", backgroundColor:"#816767ff", color:"white"}}> Información general </th>
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
                        :  instrumento.tipo === 'INFORME_CATEDRA'?
                        
                        <>
                            <td>
                                <p className="mb-0 text-center">
                                    <span className="fw-bold"> Ciclo Lectivo: </span> {(new Date(instrumento.dictado.fecha_inicio).getFullYear())}
                                </p>
                            </td>
                            
                            <td>
                                <p className="mb-0 text-center">
                                    <span className="fw-bold"> Departamento: </span> {instrumento.departamento.nombre}
                                </p>
                            </td>

                            <td>
                                <p className="mb-0 text-center">
                                    <span className="fw-bold"> Integrantes: </span> -
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
                        
                                                    
                            <td>
                                <p className="mb-0 text-center">
                                    <span className="fw-bold"> Comisiones teoricas: </span> - 
                                </p>
                            </td>

                            <td>
                                <p className="mb-0 text-center">
                                    <span className="fw-bold"> Comisiones prácticas: </span> - 
                                </p>
                            </td>
                        
                        </>
                        
                    }
                    </tr>
                </tbody>
            </Table>


        </div>
        

    )


} 