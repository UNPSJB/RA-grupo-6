import type { Opcion } from "../Opcion/OpcionTypes";

export type Pregunta = {
  id: number;
  texto: string;
  tipo: string;
  opciones: Opcion[];
};

export type GrupoPregunta = {
  id: number;
  letra: string;
  titulo: string;

}

export const EnumTipoPregunta = Object.freeze({
    cerrada: "Cerrada",
    abierta: "Abierta"
})
export type TipoPregunta = typeof EnumTipoPregunta[keyof typeof EnumTipoPregunta];