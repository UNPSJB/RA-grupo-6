from sqlalchemy.orm import Session
from sqlalchemy import select
from src.PeriodoVinculado.models import PeriodoVinculado
from src.Instrumento.schemas import TasaRespuesta
from src.Instrumento.models import Instrumento

def esPeriodoActual(periodoVinculado : PeriodoVinculado, instrumento: Instrumento):

    esAnterior = ((periodoVinculado.fecha_desde < instrumento.fecha_inicio) and (periodoVinculado.fecha_hasta < instrumento.fecha_cierre))


    return esAnterior and (periodoVinculado.fecha_desde.year == instrumento.fecha_inicio.year) #Comparar si son del mismo año.


def obtenerTasaRespuestas(db: Session, instrumento_id: int) -> TasaRespuesta:
    db_instrumento = db.scalar(select(Instrumento).where((Instrumento.id == instrumento_id) ))
    
    respondidos = len(db_instrumento.respuestas_formulario)

    periodos_vinculados = db_instrumento.materia.periodos_vinculados

    cant_respuestas = 0

    for periodo_vinculado in periodos_vinculados:
        
        if(esPeriodoActual(periodo_vinculado, db_instrumento)):
            cant_respuestas = cant_respuestas + 1
    
    tasa_respuestas = TasaRespuesta(no_respondieron= cant_respuestas - respondidos, respondidos= respondidos)
    
    return tasa_respuestas


def getInstrumentosConPlantilla(db:Session, plantilla_id:int) -> list[Instrumento]:

    return db.scalars(select(Instrumento).where(Instrumento.plantilla_formulario == plantilla_id))

