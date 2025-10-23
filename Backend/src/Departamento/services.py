from typing import List
from sqlalchemy import select
from sqlalchemy.orm import Session
from src.Departamento.models import Departamento
from src.Departamento import schemas

def listar_departamentos(db: Session) -> List[schemas.Departamento]:
    return db.scalars(select(Departamento)).all()