from datetime import date
from sqlalchemy import select, update
from sqlalchemy.orm import Session

from src.Parametros.models import Parametros

def getParametros(db: Session) :
    return db.scalar(select(Parametros))

def actualizar_parametros(db: Session, parametros:Parametros):
    db_parametros = getParametros(db)
    db.execute(update(Session).values(**parametros.model_dump()))
    db.commit()
    db.refresh(db_parametros)
    return db_parametros




