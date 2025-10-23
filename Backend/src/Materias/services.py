from typing import List
from sqlalchemy import select
from sqlalchemy.orm import Session
from src.Materias.models import Materia
from src.Materias import schemas


def listar_materias(db: Session) -> List[schemas.Materia]:
    return db.scalars(select(Materia)).all()

