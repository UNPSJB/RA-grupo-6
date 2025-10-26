
export type Opcion = {
    id: number;
    texto: string;
};

export type Pregunta = {
    id: number
    texto: string
    opciones: Opcion[]
    tipo: string | null
    grupo_pregunta_id: number
    rol_id: number
    estadistica: boolean
    puede_modificarse: boolean
    puede_eliminarse: boolean
    grupo_pregunta: GrupoPregunta
}

export const EnumTipoPregunta = Object.freeze({
    cerrada: "cerrada",
    abierta: "abierta"
})
export type TipoPregunta = typeof EnumTipoPregunta[keyof typeof EnumTipoPregunta];

export type GrupoPregunta = {
    id: number;
    letra: string;
    titulo: string;
}
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
export type Respuesta = {
    texto: string
    opcion: Opcion
    pregunta: Pregunta
}

export type Materia = {
    id: string
    nombre: string
}

export type Rol = {
    id: number  
    nombre: string
}


export type Usuario = {
    id: number
    nombre: string
    apellido: string
    legajo: number
    email: string
    rol: Rol
    respuestas_formulario: TypeRespuestasFormulario[]
}


export type TypeRespuestasFormulario = {
    id: number
    materia: Materia
    usuario: Usuario 
    fecha_envio: Date
    respuestas: Respuesta[]

}

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

export type PreguntaCerrada = {
  texto: string;
  opciones: number[];
  tipo: string;
  grupo_pregunta_id: number;
  rol_id: string;
  estadistica: boolean;
};

export type Formulario = {
  titulo: string;
  rol: string;
  preguntas: number[];
};

export type ErrorValidacion ={
  titulo?: string;
  rol?: string;
  preguntas?: string;
};

export type ErrorPreguntaCerrada = {
  texto?: string;
  grupo?: string;
  opciones?: string;
  rol?: string;
};

export type ErrorPreguntaAbierta = {
  texto?: string;
  grupo?: string;
  rol?: string;
};

export type PlantillaFormulario = {
  titulo: string;
  fecha_creacion: Date;
  preguntas: Pregunta[];
  rol: Rol
  instrumento: Instrumento[];

}


export type Instrumento = {
  instrumento_fuente: Instrumento | null;
  tipo: TipoInstrumento;
  respuestas_formulario: TypeRespuestasFormulario[];
  plantilla_formulario: PlantillaFormulario;
  fecha_inicio: Date;
  fecha_cierre: Date;

}

