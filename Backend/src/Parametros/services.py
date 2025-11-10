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
    valores_a_actualizar = {
    "inicio_primer_dictado": parametros.inicio_primer_dictado,
    "cierre_primer_dictado": parametros.cierre_primer_dictado,
    "inicio_segundo_dictado": parametros.inicio_segundo_dictado,
    "cierre_segundo_dictado": parametros.cierre_segundo_dictado,
    "plantilla_estudiante": parametros.plantilla_estudiante,
    "plantilla_docente": parametros.plantilla_docente,
    "plantilla_departamento": parametros.plantilla_departamento,
    "disponibilidad_estudiante": parametros.disponibilidad_estudiante,
    "disponibilidad_docente": parametros.disponibilidad_docente,
    "disponibilidad_departamento": parametros.disponibilidad_departamento
    }
    db.execute(update(Parametros).values(**valores_a_actualizar))
    db.commit()
    db.refresh(db_parametros)

    # try:
    #     scheduler.reschedule_job("creacion_instr_1C", trigger="cron", month=db_parametros.cierre_primer_dictado.month, day= db_parametros.cierre_primer_dictado.day)
    # except JobLookupError:
    #     print("El proceso ya se ejecutó por lo que se planificará para el año proximo")
    
    # try:
    #     scheduler.reschedule_job("creacion_instr_2C", trigger="cron", month=db_parametros.cierre_segundo_dictado.month, day= db_parametros.cierre_segundo_dictado.day)
    # except JobLookupError:
    #     print("El proceso ya se ejecutó por lo que se planificará para el año proximo")

    return db_parametros


