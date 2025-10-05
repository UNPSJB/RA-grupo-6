import type { Opcion } from "../Opcion/OpcionTypes"

export type Pregunta = {
    id: number
    texto: String
    opciones: Opcion[]
    tipo: String | null
}

export const EnumTipoPregunta = Object.freeze({
    cerrada: "Cerrada",
    abierta: "Abierta"
})

export type RespuestaCerrada = {
    pregunta_id: Number
    opcion_id: Number
}