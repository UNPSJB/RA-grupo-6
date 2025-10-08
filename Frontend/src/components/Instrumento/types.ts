import type { ReactNode } from "react";

export type RespuestaDetalle = {
  pregunta_texto: string;
  respuesta_texto: string | null;
  opcion_seleccionada: string | null;
};

export type InstrumentoList = {
  fecha_cierre: string | number | Date;
  tipo: ReactNode;
  fecha_inicio: string | number | Date;
  id: number;
  titulo_formulario: string;
  fecha_completado: string; 
};

export type InstrumentoDetail = InstrumentoList & {
  respuestas: RespuestaDetalle[];
};