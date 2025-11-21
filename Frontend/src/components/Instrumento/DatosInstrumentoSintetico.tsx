import {Table} from "react-bootstrap";
import type { InstrumentoDetail} from "../types";
import { capitalizarCadena} from "../Funciones";
import { useEffect, useState } from "react";


function obtenerFilas(datosInstrumento: any){
    const celdas = []

    if (datosInstrumento){
        for (const [clave, valor] of Object.entries(datosInstrumento)){
            celdas.push(
                <td key={clave}>
                    <p className="mb-0 text-center">
                        <span className='fw-bold'>{capitalizarCadena(clave)}</span> {String(valor)}
                    </p>
                </td>
            )
        }
    }

    return celdas
}


export function DatosInstrumentoSintetico({instrumento} : {instrumento : InstrumentoDetail}){


    const [filas, setFilas] = useState<any[][]>([])

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/instrumentos/ObtenerDatosInstrumentoSintetico/${instrumento.id}`)
            .then(r => r.json())
            .then(data => {if (Array.isArray(data)){
                setFilas(data.map(obj => obtenerFilas(obj)))
            }}) 

    }, []);

    return( 
        <div className="mb-3">
            <Table striped bordered className="rounded-3 overflow-hidden mb-4" style={{tableLayout: "fixed"}}>
                <thead>
                    <tr className="text-center">
                        <th colSpan={filas?.[0]?.length ?? 1} style={{fontSize:"18px", backgroundColor:"#816767ff", color:"white"}}>
                            Información general
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {filas.map((fila, i) => (
                        <tr key={i}>
                            {fila}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
        

    )


} 