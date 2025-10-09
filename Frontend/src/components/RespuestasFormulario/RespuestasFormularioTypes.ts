import type { Opcion } from "../Opcion/OpcionTypes"
import type { Pregunta } from "../Pregunta/PreguntaTypes"


export type Respuesta = {
    texto: string
    opcion: Opcion
    pregunta: Pregunta
}

export type Materia = {
    nombre: String
}

export type Rol = {
    nombre: String
}


export type Usuario = {
    nombre: String
    apellido: String
    legajo: number
    email: String
    rol: Rol
}


export type TypeRespuestasFormulario = {
    materia: Materia | null
    usuario: Usuario | null
    fecha_envio: Date
    respuestas: Respuesta[]

}