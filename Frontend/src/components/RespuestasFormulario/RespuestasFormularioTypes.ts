import type { Opcion } from "../Opcion/OpcionTypes"
import type { Pregunta } from "../Pregunta/PreguntaTypes"


export type Respuesta = {
    texto: string
    opcion: Opcion
    pregunta: Pregunta
}

export type Materia = {
    nombre: string
}

export type Rol = {
    nombre: string
}


export type Usuario = {
    nombre: string
    apellido: string
    legajo: number
    email: string
    rol: Rol
}


export type TypeRespuestasFormulario = {
    materia: Materia
    usuario: Usuario 
    fecha_envio: Date
    respuestas: Respuesta[]

}