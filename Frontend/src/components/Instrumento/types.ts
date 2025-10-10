
export type TipoInstrumento = 
  | 'ENCUESTA_ESTUDIANTE' 
  | 'INFORME_CATEDRA' 
  | 'INFORME_SINTETICO';

export type InstrumentoBase = {
  id: number;
  tipo: TipoInstrumento;
};
export type instrumentoList = InstrumentoBase & {
  fecha_inicio: string;
  fecha_cierre: string;
  materia: {
    id: string;
    nombre: string;
  };
  plantilla_formulario: {
    id: number;
    titulo: string;
  };
};

export type InstrumentoDetail = InstrumentoBase & {
  titulo_formulario: string;
  fecha_completado: string;
  respuestas: RespuestaDetalle[];
};

export type RespuestaDetalle = {
  pregunta_texto: string;
  respuesta_texto: string | null;
  opcion_seleccionada: string | null;
};


// tipos para las Estadísticas ---

export type EstadisticaOpcion = {
  texto_opcion: string;
  cantidad: number;
};

export type EstadisticaPregunta = {
  pregunta_id: number;
  pregunta_texto: string;
  opciones: EstadisticaOpcion[];
};