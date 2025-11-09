from datetime import date
from sqlalchemy import select, update
from sqlalchemy.orm import Session

from src.Parametros.models import Parametros

#Fechas

def actualizar_inicio_primer_dictado(db: Session, fecha:date):
    parametros = db.scalar(select(Parametros))
    parametros.inicio_primer_dictado = fecha
    db.commit()

    return parametros

def actualizar_inicio_segundo_dictado(db: Session, fecha:date):
    parametros = db.scalar(select(Parametros))
    parametros.inicio_segundo_dictado = fecha
    db.commit()

    return parametros

def actualizar_cierre_primer_dictado(db: Session, fecha:date):
    parametros = db.scalar(select(Parametros))
    parametros.cierre_primer_dictado = fecha
    db.commit()

    return parametros

def actualizar_cierre_segundo_dictado(db: Session, fecha:date):
    parametros = db.scalar(select(Parametros))
    parametros.cierre_segundo_dictado = fecha
    db.commit()

    return parametros

#Plantillas

def actualizar_plantilla_estudiante(db: Session, plantilla_id:id):
    parametros = db.scalar(select(Parametros))
    parametros.plantilla_estudiante = plantilla_id
    db.commit()

    return parametros

def actualizar_plantilla_docente(db: Session, plantilla_id:id):
    parametros = db.scalar(select(Parametros))
    parametros.plantilla_docente = plantilla_id
    db.commit()

    return parametros

def actualizar_plantilla_departamento(db: Session, plantilla_id:id):
    parametros = db.scalar(select(Parametros))
    parametros.plantilla_departamento = plantilla_id
    db.commit()

    return parametros


# Disponibilidad

def actualizar_disponibilidad_estudiante(db: Session, disponibilidad:id):
    parametros = db.scalar(select(Parametros))
    parametros.disponibilidad_estudiante = disponibilidad
    db.commit()

    return parametros

def actualizar_disponibilidad_docente(db: Session, disponibilidad:id):
    parametros = db.scalar(select(Parametros))
    parametros.disponibilidad_docente = disponibilidad
    db.commit()

    return parametros

def actualizar_disponibilidad_departamento(db: Session, disponibilidad:id):
    parametros = db.scalar(select(Parametros))
    parametros.disponibilidad_departamento = disponibilidad
    db.commit()

    return parametros




