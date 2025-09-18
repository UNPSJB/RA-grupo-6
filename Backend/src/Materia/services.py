from sqlalchemy.orm import Session
from sqlalchemy import List
from . import models, schemas

def get_materias(db: Session) -> List[schemas.Materia]:
    return db.query(models.Materia).all()