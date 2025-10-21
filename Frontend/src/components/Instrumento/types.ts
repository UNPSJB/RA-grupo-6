
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
  docente?: Docente;
};

export type Docente = {
  id: number;
  nombre: string;
  apellido: string;
};

export type InstrumentoDetail = InstrumentoBase & {
  titulo_formulario: string;
  fecha_completado: string;
  respuestas: RespuestaDetalle[];
  docente?: Docente;
};

export type RespuestaDetalle = {
  pregunta_texto: string;
  respuesta_texto: string | null;
  opcion_seleccionada: string | null;
  grupo?: string;
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

export type PreguntaConRespuestas = {
  pregunta_texto: string;
  // lista con todas las respuestas de texto para esta pregunta
  respuestas_abiertas: (string | null)[]; 
};

export type EncuestaAgregadaDetail = InstrumentoBase & {
  titulo_formulario: string;
  respuestas_agregadas: PreguntaConRespuestas[];
};



export type RespuestaAbierta = {
  pregunta_texto: string;
  respuesta_texto: string;
};

export type GrupoRespuestasAbiertas = {
  grupo: string;
  titulo_grupo: string;
  respuestas: RespuestaAbierta[];
};

export type DetalleInformeCompleto = {
  id: number;
  titulo_formulario: string;
  fecha_completado: string;
  estadisticas: EstadisticaPregunta[];
  respuestas_abiertas_agrupadas: GrupoRespuestasAbiertas[];
};
