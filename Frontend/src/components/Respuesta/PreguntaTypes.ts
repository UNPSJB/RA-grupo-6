import type { Opcion } from "../Opcion/OpcionTypes"

export type TipoPregunta = {
    id: number
    texto: String
    opciones: Opcion[]
    tipo: String | null
}

export const EnumTipoPregunta = Object.freeze({
    cerrada: "Cerrada",
    abierta: "Abierta"
})