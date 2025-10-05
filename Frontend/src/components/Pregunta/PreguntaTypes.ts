import type { Opcion } from "../Opcion/OpcionTypes";

export type Pregunta = {
  id: number;
  texto: string;
  tipo: string;
  opciones: Opcion[];
};