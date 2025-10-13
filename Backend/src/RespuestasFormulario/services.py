from typing import List
from sqlalchemy import select
from sqlalchemy.orm import Session
from src.RespuestasFormulario import schemas, exceptions
from src.RespuestasFormulario.models import RespuestasFormulario

def crear_respuestas_formulario(db:Session, respuestas_formulario: schemas.RespuestasFormulario) -> schemas.RespuestasFormulario:
    _respuestas_formulario = RespuestasFormulario(**respuestas_formulario.model_dump())
    db.add(_respuestas_formulario)
    db.commit()
    db.refresh(_respuestas_formulario)
    return _respuestas_formulario

def obtener_respuestas_formulario(db: Session, respuestas_formulario_id: int) -> schemas.RespuestasFormulario:
    db_respuestas = db.scalar(select(RespuestasFormulario).where(RespuestasFormulario.id == respuestas_formulario_id))
    
    if db_respuestas is None:
        raise exceptions.RespuestasNoEncontradas()
    return db_respuestas

