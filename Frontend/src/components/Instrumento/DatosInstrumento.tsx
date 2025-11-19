import {Table,  } from "react-bootstrap";
import type { InstrumentoDetail} from "../types";
import { capitalizarCadena, getDatosInstrumento } from "../Funciones";


function obtenerFilas(datosInstrumento: any){

    let filas = []

    if (datosInstrumento){

        for (const [clave, valor] of Object.entries(datosInstrumento)){
                
                filas.push(
                    <td>
                    <p className="mb-0 text-center">
                        <span className='fw-bold'> {capitalizarCadena(clave)}</span> {String(valor)}
                    </p>
                </td>
            )
        }
    }

    return filas

}


export function DatosInstrumentoDocente({instrumento} : {instrumento : InstrumentoDetail}){

    const datosInstrumento = getDatosInstrumento(instrumento)
    const filas = obtenerFilas(datosInstrumento)


    return( 
        <div className="mb-3">

            <Table striped bordered className="rounded-3 overflow-hidden mb-4" style={{tableLayout: "fixed"}}>
                <thead>
                    <tr className="text-center">
                        <th colSpan={filas.length} style={{fontSize:"18px", backgroundColor:"#816767ff", color:"white"}}> Información general </th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        {filas.map((fila) =>  fila )}
                    </tr>
                </tbody>
            </Table>


        </div>
        

    )


} 