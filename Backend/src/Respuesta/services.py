from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import delete, select, update
from src.Instrumento.models import Instrumento
from src.RespuestasFormulario.models import RespuestasFormulario
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
        raise exceptions.RespuestaInvalida()
    if pregunta.tipo == "cerrada" and not respuesta.opcion_id:
        raise exceptions.RespuestaInvalida()
    if pregunta.multiple_respuestas and not respuesta.instancia_respuesta:
        raise exceptions.RespuestaInvalida()
    

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

def obtener_respuesta_fuente(db: Session, pregunta_id: int, instrumento_actual_id: int) -> dict:
    pregunta = db.scalar(select(Pregunta).where(Pregunta.id == pregunta_id))
    
    if not pregunta or not pregunta.pregunta_fuente_id:
        return {"respuestas": [], "multiple": pregunta.multiple_respuestas if pregunta else False}
    
    instrumento_actual = db.scalar(select(Instrumento).where(Instrumento.id == instrumento_actual_id))

    
    if not instrumento_actual or not instrumento_actual.instrumento_fuente_id:
        return {"respuestas": [], "multiple": pregunta.multiple_respuestas}
    

    respuestas_fuente = db.scalars(
        select(Respuesta)
        .join(RespuestasFormulario)
        .where(
            Respuesta.pregunta_id == pregunta.pregunta_fuente_id,
            RespuestasFormulario.instrumento_id == instrumento_actual.instrumento_fuente_id
        )
        .order_by(Respuesta.instancia_respuesta)
    ).all()
    
    respuestas_procesadas = []
    for respuesta in respuestas_fuente:
        texto = respuesta.texto or (respuesta.opcion.texto if respuesta.opcion else None)
        if texto:
            respuestas_procesadas.append({
                "texto": texto,
                "instancia": respuesta.instancia_respuesta,
                "opcion_id": respuesta.opcion_id
            })
    
    return {
        "respuestas": respuestas_procesadas,
        "multiple": pregunta.multiple_respuestas
    }