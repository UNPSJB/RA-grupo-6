from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import delete, select, update
from src.GrupoCuadro.models import GrupoCuadro
from src.GrupoCuadro import schemas

def crear_grupo_cuadro(db: Session, grupo_cuadro: schemas.GrupoCuadroCreate) -> schemas.GrupoCuadro:
    _nuevo_grupo_cuadro = GrupoCuadro(**grupo_cuadro.model_dump())
    db.add(_nuevo_grupo_cuadro)
    db.commit()
    db.refresh(_nuevo_grupo_cuadro)
    return _nuevo_grupo_cuadro

def listar_grupo_cuadro(db: Session) -> List[schemas.GrupoCuadro]:
    return db.scalars(select(GrupoCuadro)).all()