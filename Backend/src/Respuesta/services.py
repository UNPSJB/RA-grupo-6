from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import delete, select, update
from src.Respuesta.models import Respuesta
from src.Respuesta import schemas, exceptions
from src.Pregunta.models import Pregunta

#-------------- RESPUESTAS -----------------

def crear_respuesta(db: Session, respuesta: schemas.RespuestaCreate) -> schemas.Respuesta:
    # Obtener la pregunta
    pregunta = db.scalar(select(Pregunta).where(Pregunta.id == respuesta.pregunta_id))
    if not pregunta:
        raise exceptions.PreguntaNoEncontrada()
    
    # Validar tipo de respuesta
    if pregunta.tipo == "abierta" and not respuesta.texto:
        raise exceptions.RespuestaInvalida("La pregunta es abierta, se requiere 'texto'")
    if pregunta.tipo == "cerrada" and not respuesta.opcion_id:
        raise exceptions.RespuestaInvalida("La pregunta es cerrada, se requiere 'opcion_id'")
    

    # Crear nueva respuesta
    nueva_respuesta = Respuesta(**respuesta.model_dump())
    db.add(nueva_respuesta)
    db.commit()
    db.refresh(nueva_respuesta)
    return nueva_respuesta

def listar_respuestas(db: Session) -> List[schemas.Respuesta]:
    return db.scalars(select(Respuesta)).all()

def obtner_respuesta(db: Session, respuesta_id: int) -> schemas.Respuesta:
    db_respuesta = db.scalar(select(Respuesta).where(Respuesta.id == respuesta_id))
    if db_respuesta is None:
        raise exceptions.RespuestaNoEncontrada()
    return db_respuesta

def modificar_respuesta(db: Session, respuesta_id: int, respuesta: schemas.RespuestaUpdate) -> schemas.Respuesta:
    db_respuesta = obtner_respuesta(db, respuesta_id)
    
    # Validar tipo de respuesta según la pregunta 
    if db_respuesta.pregunta.tipo == "abierta" and not respuesta.texto:
        raise exceptions.RespuestaInvalida("La pregunta es abierta, se requiere 'texto'")
    if db_respuesta.pregunta.tipo == "cerrada" and not respuesta.opcion_id:
        raise exceptions.RespuestaInvalida("La pregunta es cerrada, se requiere 'opcion_id'")

    db.execute(
        update(Respuesta)
        .where(Respuesta.id == respuesta_id)
        .values(**respuesta.model_dump())
    )
    db.commit()
    db.refresh(db_respuesta)
    return db_respuesta

def eliminar_respuesta(db: Session, respuesta_id: int) -> schemas.RespuestaDelete:
    db_respuesta = obtner_respuesta(db, respuesta_id)
    db.execute(delete(Respuesta).where(Respuesta.id == respuesta_id))
    db.commit()
    return db_respuesta
