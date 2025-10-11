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