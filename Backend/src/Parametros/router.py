from datetime import date
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.Parametros import services, schemas

router = APIRouter(prefix="/Parametros", tags=["Parametros"])

#Fechas
@router.put("/inicio_primer_dictado/{fecha_inicio}", response_model=schemas.Parametros)
def actualizar_inicio_primer_dictado(fecha_inicio: date, db: Session = Depends(get_db)) -> schemas.Parametros:
    return services.actualizar_inicio_primer_dictado(db, fecha_inicio)

@router.put("/inicio_segundo_dictado/{fecha_inicio}", response_model=schemas.Parametros)
def actualizar_inicio_segundo_dictado(fecha_inicio: date, db: Session = Depends(get_db)) -> schemas.Parametros:
    return services.actualizar_inicio_segundo_dictado(db, fecha_inicio)

@router.put("/cierre_primer_dictado/{fecha_cierre}", response_model=schemas.Parametros)
def actualizar_cierre_primer_dictado(fecha_cierre: date, db: Session = Depends(get_db)) -> schemas.Parametros:
    return services.actualizar_cierre_primer_dictado(db, fecha_cierre)

@router.put("/cierre_segundo_dictado/{fecha_cierre}", response_model=schemas.Parametros)
def actualizar_cierre_segundo_dictado(fecha_cierre: date, db: Session = Depends(get_db)) -> schemas.Parametros:
    return services.actualizar_cierre_segundo_dictado(db, fecha_cierre)

#Plantillas
@router.put("/plantilla_estudiante/{plantilla_id}", response_model=schemas.Parametros)
def actualizar_plantilla_estudiante(plantilla_id: int, db: Session = Depends(get_db)) -> schemas.Parametros:
    return services.actualizar_plantilla_estudiante(db, plantilla_id)

@router.put("/plantilla_docente/{plantilla_id}", response_model=schemas.Parametros)
def actualizar_plantilla_docente(plantilla_id: int, db: Session = Depends(get_db)) -> schemas.Parametros:
    return services.actualizar_plantilla_docente(db, plantilla_id)

@router.put("/plantilla_departamento/{plantilla_id}", response_model=schemas.Parametros)
def actualizar_plantilla_departamento(plantilla_id: int, db: Session = Depends(get_db)) -> schemas.Parametros:
    return services.actualizar_plantilla_departamento(db, plantilla_id)

#Disponibilidad
@router.put("/disponibilidad_estudiante/{dias}", response_model=schemas.Parametros)
def actualizar_disponibilidad_estudiante(dias: int, db: Session = Depends(get_db)) -> schemas.Parametros:
    return services.actualizar_disponibilidad_estudiante(db, dias)

@router.put("/disponibilidad_docente/{dias}", response_model=schemas.Parametros)
def actualizar_disponibilidad_docente(dias: int, db: Session = Depends(get_db)) -> schemas.Parametros:
    return services.actualizar_disponibilidad_docente(db, dias)

@router.put("/disponibilidad_departamento/{dias}", response_model=schemas.Parametros)
def actualizar_disponibilidad_departamento(dias: int, db: Session = Depends(get_db)) -> schemas.Parametros:
    return services.actualizar_disponibilidad_departamento(db, dias)
