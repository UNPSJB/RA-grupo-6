from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import delete, select, update
from src.Opciones.models import Opcion
from src.Opciones import schemas, exceptions

def crear_opcion(db: Session, opcion: schemas.OpcionCreate) -> schemas.Opcion:
    _nueva_opcion = Opcion(**opcion.model_dump())
    db.add(_nueva_opcion)
    db.commit()
    db.refresh(_nueva_opcion)
    return _nueva_opcion

def listar_opciones(db: Session) -> List[schemas.Opcion]:
    return db.scalars(select(Opcion)).all()

def obtener_opcion(db: Session, opcion_id: int) -> schemas.Opcion:
    db_opcion = db.scalar(select(Opcion).where(Opcion.id == opcion_id))
    if db_opcion is None:
        raise exceptions.OpcionNoEncontrada()
    return db_opcion    

def modificar_opcion(db: Session, opcion_id: int, opcion: schemas.OpcionUpdate) -> schemas.Opcion:
    db_opcion = obtener_opcion(db, opcion_id)
    db.execute(update(Opcion).where(Opcion.id == opcion_id).values(**opcion.model_dump()))
    db.commit()
    db.refresh(db_opcion)
    return db_opcion

def eliminar_opcion(db: Session, opcion_id: int) -> schemas.OpcionDelete:
    db_opcion = obtener_opcion(db, opcion_id)

    if db_opcion.preguntas and len(db_opcion.preguntas) > 0:
        raise exceptions.OpcionNoEliminable()

    db.delete(db_opcion)
    db.commit()
    return db_opcion