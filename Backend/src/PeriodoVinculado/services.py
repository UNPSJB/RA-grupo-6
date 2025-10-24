from typing import List
from sqlalchemy import select
from sqlalchemy.orm import Session
from src.PeriodoVinculado.models import PeriodoVinculado
from src.PeriodoVinculado import schemas


def listar_periodos(db: Session) -> List[schemas.PeriodoVinculado]:
    return db.scalars(select(PeriodoVinculado)).all()

