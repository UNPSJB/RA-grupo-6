from datetime import date
from typing import TYPE_CHECKING
from sqlalchemy import select, update
from sqlalchemy.orm import Session
from src.Parametros.models import Parametros
from apscheduler.jobstores.base import JobLookupError

if TYPE_CHECKING: 
    from src.Email.tasks import scheduler


def getParametros(db: Session) :
    return db.scalar(select(Parametros))

def actualizar_parametros(db: Session, parametros:Parametros):
    db_parametros = getParametros(db)
    db.execute(update(Session).values(**parametros.model_dump()))
    db.commit()
    db.refresh(db_parametros)

    try:
        scheduler.reschedule_job("creacion_instr_1C", trigger="cron", month=db_parametros.cierre_primer_dictado.month, day= db_parametros.cierre_primer_dictado.day)
    except JobLookupError:
        print("El proceso ya se ejecutó por lo que se planificará para el año proximo")
    
    try:
        scheduler.reschedule_job("creacion_instr_2C", trigger="cron", month=db_parametros.cierre_segundo_dictado.month, day= db_parametros.cierre_segundo_dictado.day)
    except JobLookupError:
        print("El proceso ya se ejecutó por lo que se planificará para el año proximo")

    return db_parametros




