import {Table } from "react-bootstrap";
import type { InstrumentoDetail} from "../types";
import { capitalizarCadena } from "../Funciones";


export function DatosInstrumento({instrumento} : {instrumento : InstrumentoDetail}){

    return( 
        <div >

            <Table striped bordered className="rounded-3 overflow-hidden mb-4" style={{tableLayout: "fixed"}}>
                <thead>
                    <tr className="text-center">
                        <th colSpan={3} style={{fontSize:"18px", backgroundColor:"#816767ff", color:"white"}}> DATOS </th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>
                            <p className="mb-0 text-center">
                                <span className='fw-bold'> Sede:</span> {instrumento.departamento.sede}
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
                        // instrumento.tipo === 'INFORME_CATEDRA'? 
                            

                        <>

                            
                            <td>
                                <p className="mb-0 text-center">
                                    <span className="fw-bold"> Ciclo Lectivo: </span> {instrumento.materia.dictado.fecha_inicio.getFullYear()}
                                </p>
                            </td>
                            <td>
                                <p className="mb-0 text-center">
                                    <span className="fw-bold"> Actividad Curricular: </span> ({instrumento.materia.id}) {capitalizarCadena(instrumento.materia.nombre)}
                                </p>
                            </td>
                            {/* <td>
                                <p className="mb-0 text-center">
                                    <span className="fw-bold"> Docente: </span> {instrumento.docente?.nombre && capitalizarCadena(instrumento.docente?.nombre)}
                                </p>
                            </td> */}



                        </>
                        // :
                        
                        }
                    </tr>
                </tbody>
            </Table>







        </div>
        

    )


} 