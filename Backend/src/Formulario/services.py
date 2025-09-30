from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import select, update
from src.Formulario import schemas, exceptions
from src.Formulario.models import Formulario
from src.Pregunta.models import Pregunta

def crear_formulario(db: Session, formulario: schemas.FormularioCreate):
    
    preguntas_validas = db.query(Pregunta).filter(Pregunta.id.in_([preg for preg in formulario.preguntas if preg > 0])).all()
    
    _nuevo_formulario = Formulario(titulo = formulario.titulo)
    _nuevo_formulario.preguntas = preguntas_validas

    db.add(_nuevo_formulario)
    db.commit()
    db.refresh(_nuevo_formulario)
    return _nuevo_formulario

def listar_formularios(db: Session) -> List[schemas.Formulario]:
    return db.scalars(select(Formulario)).all()

def obtener_formulario(db: Session, formulario_id: int) -> schemas.Formulario:
    db_formulario = db.scalar(select(Formulario).where(Formulario.id == formulario_id))
    if db_formulario is None:
        raise exceptions.FormularioNoEncontrado()
    return db_formulario


