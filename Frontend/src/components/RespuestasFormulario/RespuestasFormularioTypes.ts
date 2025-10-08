

export type Respuesta = {
    texto: string
    opcion_id: number
    pregunta_id: number
}

export type TypeRespuestasFormulario = {
    materia_id: number
    usuario_id: number
    fecha_envio: Date
    respuestas: Respuesta[]

}