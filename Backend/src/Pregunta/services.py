from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import delete, select, update
from src.Pregunta.models import Pregunta, Opcion
from src.Pregunta import schemas, exceptions

def crear_pregunta_abierta(db: Session, pregunta: schemas.PreguntaAbiertaCreate) -> schemas.Pregunta:
    pass

def crear_pregunta_cerrada(db: Session, pregunta: schemas.PreguntaCerradaCreate) -> Pregunta:
    if not pregunta.opciones or len(pregunta.opciones) == 0 or pregunta.opciones == 0:
        raise exceptions.PreguntaSinOpciones()
    
    # Filtrar ids validos
    opciones_validas = db.query(Opcion).filter(Opcion.id.in_([op for op in pregunta.opciones if op > 0])).all()
   
    if not opciones_validas:
        raise exceptions.PreguntaSinOpciones("No se proporcionó ninguna opción válida.")


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

#-------------- OPCIONES -----------------

def crear_opcion(db: Session, opcion: schemas.OpcionCreate) -> schemas.Opcion:
    _nueva_opcion = Opcion(**opcion.model_dump())
    db.add(_nueva_opcion)
    db.commit()
    db.refresh(_nueva_opcion)
    return _nueva_opcion

def listar_opciones(db: Session) -> List[schemas.Opcion]:
    return db.scalars(select(Opcion)).all()

def obtner_opcion(db: Session, opcion_id: int) -> schemas.Opcion:
    db_opcion = db.scalar(select(Opcion).where(Opcion.id == opcion_id))
    if db_opcion is None:
        raise exceptions.OpcionNoEncontrada()
    return db_opcion    

def modificar_opcion(db: Session, opcion_id: int, opcion: schemas.OpcionUpdate) -> schemas.Opcion:
    db_opcion = obtner_opcion(db, opcion_id)
    db.execute(update(Opcion).where(Opcion.id == opcion_id).values(**opcion.model_dump()))
    db.commit()
    db.refresh(db_opcion)
    return db_opcion

def eliminar_opcion(db: Session, opcion_id: int) -> schemas.OpcionDelete:
    db_opcion = obtner_opcion(db, opcion_id)
    db.execute(delete(Opcion).where(Opcion.id == opcion_id))
    db.commit()
    return db_opcion

