from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import select, update
from src.PlantillaFormulario import schemas, exceptions
from src.PlantillaFormulario.models import PlantillaFormulario
from src.Pregunta.models import Pregunta

def crear_plantilla_formulario(db: Session, plantilla_formulario: schemas.FormularioCreate):
    
    preguntas_validas = db.query(Pregunta).filter(Pregunta.id.in_([preg for preg in plantilla_formulario.preguntas if preg > 0])).all()
    
    _nuevo_plantilla_formulario = PlantillaFormulario(titulo = plantilla_formulario.titulo, rol_id = plantilla_formulario.rol)
    _nuevo_plantilla_formulario.preguntas = preguntas_validas

    db.add(_nuevo_plantilla_formulario)
    db.commit()
    db.refresh(_nuevo_plantilla_formulario)
    return _nuevo_plantilla_formulario

def listar_plantilla_formularios(db: Session) -> List[schemas.PlantillaFormulario]:
    return db.scalars(select(PlantillaFormulario)).all()

def obtener_plantilla_formulario(db: Session, formulario_id: int) -> schemas.PlantillaFormulario:
    db_plantilla_formulario = db.scalar(select(PlantillaFormulario).where(PlantillaFormulario.id == formulario_id))
    if db_plantilla_formulario is None:
        raise exceptions.FormularioNoEncontrado()
    return db_plantilla_formulario


