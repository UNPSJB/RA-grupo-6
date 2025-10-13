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

export type RespuestaBase = {
    pregunta_id: number
}

export type RespuestaCerrada = RespuestaBase & {
    opcion_id: number
}

export type RespuestaAbierta = RespuestaBase & {
    texto: string
}

export type RespuestaEnvio = RespuestaCerrada | RespuestaAbierta