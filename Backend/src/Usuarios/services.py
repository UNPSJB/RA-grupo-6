from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.Usuarios.models import Usuario
from src.Usuarios import schemas
from src.Usuarios.exceptions import Usuario_No_Encontrado

def leer_usuario(db: Session, usuario_id: int) -> schemas.Usuario:

    db_usuario = db.scalar(select(Usuario).where(Usuario.id == usuario_id))

    if (db_usuario == None):
        raise Usuario_No_Encontrado()

    return db_usuario

def leer_respuestas_usuario(db: Session, usuario_id: int):

    usuario = db.scalar(select(Usuario).where(Usuario.id == usuario_id))

    respuestas_usuario = usuario.respuestas_formulario

    respuestas = []
    for respuesta_formulario in respuestas_usuario:
        materia = respuesta_formulario.instrumento.materia

        respuestas_usuario = []
        for resp in respuesta_formulario.respuestas:
            
            respuestas_usuario.append({
                "id": resp.id,
                "pregunta_id": resp.pregunta_id,
                "opcion_id": resp.opcion_id,
                "texto_respuesta": resp.texto
            })

        respuestas.append({
            "respuesta_formulario": {
                "id": respuesta_formulario.id,
                "fecha_envio": respuesta_formulario.fecha_envio,
                "instrumento_id": respuesta_formulario.instrumento_id,
                "usuario_id": respuesta_formulario.usuario_id,
                "respuestas": respuestas_usuario
            },
            "materia": {
                "id": materia.id,
                "nombre" : materia.nombre
            }
        })

    return respuestas