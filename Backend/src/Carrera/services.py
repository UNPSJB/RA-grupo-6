from typing import List
from sqlalchemy import select
from sqlalchemy.orm import Session
from src.Carrera.models import Carrera
from src.Carrera import schemas

def listar_carreras(db: Session) -> List[schemas.Carrera]:
    return db.scalars(select(Carrera)).all()