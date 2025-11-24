import {Table} from "react-bootstrap";
import type { InstrumentoDetail} from "../types";
import { capitalizarCadena, separarPalabras} from "../Funciones";
import { useEffect, useState } from "react";


export function obtenerFilas(datosInstrumento: any){

    let filas = []

    if (datosInstrumento){

        for (const [clave, valor] of Object.entries(datosInstrumento)){
                
                filas.push(
                    <td key={clave}>
                    <p className='fw-bold mb-0 text-center'> {capitalizarCadena(separarPalabras(clave))} </p>
                    <p className="mb-0 text-center"> {String(valor)} </p>
                </td>
            )
        }
    }
    return filas

}


export function DatosInstrumento({instrumento} : {instrumento : InstrumentoDetail}){


    const [filas, setFilas] = useState<any[]>([])

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/instrumentos/ObtenerDatosInstrumento/${instrumento.id}`)
            .then(r => r.json())
            .then(data => {setFilas(obtenerFilas(data))}) 

    }, []);

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
                        {filas.map((fila : any) =>  fila )}
                    </tr>
                </tbody>
            </Table>

        </div>
        

    )


} 