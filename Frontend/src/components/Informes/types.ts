// En un archivo como src/Informes/types.ts

export type RespuestaDetalle = {
  pregunta_texto: string;
  respuesta_texto: string | null;
  opcion_seleccionada: string | null;
};

export type InformeSinteticoList = {
  id: number;
  titulo_formulario: string;
  autor_nombre: string;
  fecha_completado: string; 
};

export type InformeSinteticoDetail = InformeSinteticoList & {
  respuestas: RespuestaDetalle[];
};