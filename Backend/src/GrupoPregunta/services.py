from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import select
from src.GrupoPregunta.models import GrupoPregunta
from src.GrupoPregunta import schemas, exceptions

def listar_grupos_pregunta(db: Session) -> List[schemas.GrupoPregunta]:
    return db.scalars(select(GrupoPregunta)).all()

def obtener_grupo_pregunta(db: Session, grupo_pregunta_id: str) -> schemas.GrupoPregunta:
    db_grupo_pregunta = db.scalar(select(GrupoPregunta).where(GrupoPregunta.letra == grupo_pregunta_id))
    if db_grupo_pregunta is None:
        raise exceptions.GrupoPreguntaNoEncontrado()
    return db_grupo_pregunta