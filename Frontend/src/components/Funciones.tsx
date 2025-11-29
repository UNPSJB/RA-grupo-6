import { TipoRespuesta } from "./types";
import {z} from 'zod';

export function capitalizarCadena(cadena: string): string {
    cadena = cadena.toLocaleLowerCase()

    let cadenaCapitalizada = ""

    cadena.split(" ").forEach(subcadena => {
        cadenaCapitalizada = cadenaCapitalizada + " " + subcadena.charAt(0).toUpperCase() + subcadena.slice(1);
    });

    return cadenaCapitalizada
}

export function separarPalabras(cadena: string) : string {

    let nuevaCadena = ""

    for(let i = 0; i < cadena.length; i++){
        if ((cadena[i].charCodeAt(0) >= 65) && (cadena[i].charCodeAt(0)  <= 90)){
            nuevaCadena = nuevaCadena + " " + cadena[i]
        }
        else{
            nuevaCadena = nuevaCadena + cadena[i]
        }
    }
    return nuevaCadena
}



export function esTipoRespuestaValido(valor:string, jsonTipoDato: string){

    const valorTipoDato = JSON.parse(jsonTipoDato)
    const schemaEntero = z.coerce.number().int()
    const schemaDecimal = z.coerce.number()
    const schemaCadena = z.coerce.string()

    let esValido : boolean = true;

    if (valorTipoDato.tipo != TipoRespuesta.TEXTO && valor.trim() === "") return (!esValido);

    let resultado : any = 0 
    try{
        switch (valorTipoDato.tipo){

            case (TipoRespuesta.ENTERO):
                resultado = schemaEntero.parse(valor);
                break;
            
            case (TipoRespuesta.DECIMAL):
                resultado = schemaDecimal.parse(valor);
                break;

            case (TipoRespuesta.TEXTO):
                resultado = schemaCadena.parse(valor);
                break;

            case (TipoRespuesta.RANGO_ENTERO):
                resultado = schemaEntero.parse(valor);
                break;

            case (TipoRespuesta.RANGO_DECIMAL):
                resultado = schemaDecimal.parse(valor);
                break;

            default:
                esValido = false;
        }
    }
    catch(error){
        if (error instanceof z.ZodError){
            esValido = false
        }
    }

    if ((valorTipoDato.tipo == TipoRespuesta.RANGO_ENTERO) || (valorTipoDato.tipo == TipoRespuesta.RANGO_DECIMAL)){
        if((Number(valorTipoDato.valor_minimo) > resultado) || (resultado > Number(valorTipoDato.valor_maximo) ) ){
            esValido = false;
        }
    }

    return esValido
}


export function getFecha(fecha : Date){

    const dia = fecha.getUTCDate()
    const mes = fecha.getUTCMonth()
    const anio =  fecha.getUTCFullYear()

    return (`${dia}/${mes}/${anio}`)
}

export function parsearStringFecha(fechaStr: string): Date {
    const [anio, mes, dia] = fechaStr.split("-").map(Number);
    return new Date(anio, mes - 1, dia); // <-- interpreta como fecha local SIN UTC
}

export function formatearFecha(date: Date): string {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, "0");
    const d = String(date.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}