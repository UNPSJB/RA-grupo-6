from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import delete, select, update
from src.Pregunta.models import Pregunta, Opcion
from src.Pregunta import schemas, exceptions
from src.Opciones.models import Opcion

def crear_pregunta_abierta(db: Session, pregunta: schemas.PreguntaAbiertaCreate) -> Pregunta:
    _nueva_pregunta = Pregunta(texto=pregunta.texto, tipo="abierta")
    
    db.add(_nueva_pregunta)
    db.commit()
    db.refresh(_nueva_pregunta)
    return _nueva_pregunta

def crear_pregunta_cerrada(db: Session, pregunta: schemas.PreguntaCerradaCreate) -> Pregunta:
    if len(pregunta.opciones) == 0:
        raise exceptions.PreguntaSinOpciones()
    
    # Filtrar ids validos
    opciones_validas = db.query(Opcion).filter(Opcion.id.in_([op for op in pregunta.opciones if op > 0])).all()
   
    if len(opciones_validas) != len(pregunta.opciones):
        raise exceptions.PreguntaSinOpciones("Algunas opciones proporcionadas no son válidas.")


    _nueva = Pregunta(texto=pregunta.texto, tipo="cerrada")
    _nueva.opciones = opciones_validas
    
    db.add(_nueva)
    db.commit()
    db.refresh(_nueva)
    return _nueva

def listar_preguntas(db: Session) -> List[schemas.Pregunta]:
    return db.scalars(select(Pregunta)).all()

def obtner_pregunta(db: Session, pregunta_id: int) -> schemas.Pregunta:
    db_pregunta = db.scalar(select(Pregunta).where(Pregunta.id == pregunta_id))
    if db_pregunta is None:
        raise exceptions.PreguntaNoEncontrada()
    return db_pregunta

def modificar_pregunta(db: Session, pregunta_id: int, pregunta: schemas.PreguntaUpdate) -> Pregunta:
    db_pregunta = obtner_pregunta(db, pregunta_id)
    db.execute(update(Pregunta).where(Pregunta.id == pregunta_id).values(**pregunta.model_dump()))
    db.commit()
    db.refresh(db_pregunta)
    return db_pregunta  

def eliminar_pregunta(db: Session, pregunta_id: int) -> schemas.PreguntaDelete:
    db_pregunta = obtner_pregunta(db, pregunta_id)
    db.execute(delete(Pregunta).where(Pregunta.id == pregunta_id))
    db.commit()
    return db_pregunta

