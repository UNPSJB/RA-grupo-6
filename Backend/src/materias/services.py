from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.materias.models import Materia
from src.materias import schemas, exceptions


def listar_materias(db: Session) -> List[schemas.Materia]:
    return db.scalars(select(Materia)).all()

