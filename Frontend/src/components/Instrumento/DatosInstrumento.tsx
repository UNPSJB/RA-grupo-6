import {Table,  } from "react-bootstrap";
import type { InstrumentoDetail} from "../types";
import { capitalizarCadena} from "../Funciones";
import { useEffect, useState } from "react";


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

    const [datos, setDatos] = useState<string>("")

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/instrumentos/ObtenerDatosInstrumento/${instrumento.id}`)
            .then(r => r.json())
            .then(data => setDatos(data));

    }, []);

    const filas = obtenerFilas(JSON.parse(datos))


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