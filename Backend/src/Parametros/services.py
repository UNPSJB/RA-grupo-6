from datetime import date
from typing import TYPE_CHECKING
from sqlalchemy import select, update
from sqlalchemy.orm import Session
from src.Parametros.models import Parametros
from apscheduler.jobstores.base import JobLookupError

def getParametros(db: Session) :
    return db.scalar(select(Parametros))

def actualizar_parametros(db: Session, parametros:Parametros):
    from src.Email.tasks import scheduler
    
    db_parametros = getParametros(db)
    
    db_parametros.inicio_primer_dictado = parametros.inicio_primer_dictado
    db_parametros.cierre_primer_dictado = parametros.cierre_primer_dictado
    db_parametros.inicio_segundo_dictado = parametros.inicio_segundo_dictado
    db_parametros.cierre_segundo_dictado = parametros.cierre_segundo_dictado
    
    db_parametros.plantilla_estudiante_basico = parametros.plantilla_estudiante_basico
    db_parametros.plantilla_estudiante_superior = parametros.plantilla_estudiante_superior
    db_parametros.plantilla_docente = parametros.plantilla_docente
    db_parametros.plantilla_departamento = parametros.plantilla_departamento
    
    db_parametros.disponibilidad_estudiante = parametros.disponibilidad_estudiante
    db_parametros.disponibilidad_docente = parametros.disponibilidad_docente
    db_parametros.disponibilidad_departamento = parametros.disponibilidad_departamento
    
    db.commit()
    db.refresh(db_parametros)

    try:
        scheduler.reschedule_job("creacion_instr_1C", trigger="cron", 
                               year=db_parametros.cierre_primer_dictado.year,
                               month=db_parametros.cierre_primer_dictado.month, 
                               day=db_parametros.cierre_primer_dictado.day)
    except JobLookupError:
        pass 
    
    try:
        scheduler.reschedule_job("creacion_instr_2C", trigger="cron", 
                               year=db_parametros.cierre_segundo_dictado.year,
                               month=db_parametros.cierre_segundo_dictado.month, 
                               day=db_parametros.cierre_segundo_dictado.day)
    except JobLookupError:
        pass

    return db_parametros


