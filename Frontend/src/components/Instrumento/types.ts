import type { Materia } from "../types";

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

export type DetalleInformeCatedraCompleto = {
  id: number;
  materia: string;
  titulo_formulario: string;
  fecha_completado: string;
  estadisticas: EstadisticaPregunta[];
  respuestas_abiertas_agrupadas: GrupoRespuestasAbiertas[];
};

export type GrupoPreguntasAbiertas = {
  grupo: string;
  titulo_grupo: string;
  preguntas: PreguntaConRespuestas[];
};


export type DetalleEncuestaCompleto = {
  id: number;
  titulo_formulario: string;
  estadisticas: EstadisticaPregunta[];
  respuestas_abiertas_agrupadas: GrupoPreguntasAbiertas[];
};

// Las respuestas del administrativo
export type RespuestaSintesis = {
  pregunta_texto: string| null;
  respuesta_texto: string | null;
};

export type DetalleInformeCompleto = {
  id: number;
  titulo_formulario: string;
  fecha_completado: string;
  estadisticas: EstadisticaPregunta[];
  respuestas_abiertas_agrupadas: GrupoRespuestasAbiertas[];
};

export type ResumenInformeAcademico = {
  id: number; 
  titulo_formulario: string;
  docente_nombre: string;
  respuestas_abiertas_agrupadas: GrupoRespuestasAbiertas[];
};

export type DetalleInformeSinteticoCompleto = {
  id: number;
  titulo_formulario: string;
  departamento: string;
  fecha_completado: string;
  autor_administrativo: string; 
  respuestas_sintesis_agrupadas: GrupoRespuestasSintesis[];
  estadisticas: EstadisticaPregunta[];
  informes_academicos_base: ResumenInformeAcademico[];
};

export type InformeSinteticoList = {
  id: number;
  titulo_formulario: string;
  autor_nombre: string;
  fecha_completado: string;
};

export type GrupoRespuestasSintesis = {
  grupo: string;
  titulo_grupo: string;
  respuestas: {
    pregunta_texto: string;
    respuesta_texto: string | null;
  }[];
};

export type DetalleInformeProps = {
  informe: instrumentoList; 
  onVolver: () => void;
};

export type ListaInstrumentosProps = {
  instrumentos: instrumentoList[]; 
  tipo: TipoInstrumento;
  onSeleccionar: (instrumento: instrumentoList) => void; 
};

