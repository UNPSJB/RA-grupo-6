import array
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import select
from src.PeriodoVinculado.models import PeriodoVinculado
from src.Instrumento.schemas import TasaRespuesta
from src.Instrumento.models import Instrumento

def esPeriodoActual(periodoVinculado : PeriodoVinculado, instrumento: Instrumento):

    if((periodoVinculado.fecha_desde is None) or (periodoVinculado.fecha_hasta is None) ):
        return False


    esAnterior = ((periodoVinculado.fecha_desde < instrumento.fecha_inicio) and (periodoVinculado.fecha_hasta < instrumento.fecha_cierre))


    return esAnterior and (periodoVinculado.fecha_desde.year == instrumento.fecha_inicio.year) #Comparar si son del mismo año.


def obtenerTasaRespuestas(db: Session, instrumento_id: int ) -> TasaRespuesta:
    db_instrumento = db.scalar(select(Instrumento).where((Instrumento.id == instrumento_id) ))
    
    respondidos = len(db_instrumento.respuestas_formulario)

    periodos_vinculados = db_instrumento.materia.periodos_vinculados

    cant_respuestas = 0

    for periodo_vinculado in periodos_vinculados:
        
        if(esPeriodoActual(periodo_vinculado, db_instrumento)):
            cant_respuestas = cant_respuestas + 1
    
    tasa_respuestas = TasaRespuesta(no_respondieron= cant_respuestas - respondidos, respondidos= respondidos)
    
    return tasa_respuestas



def getTasaRespuestasInstrumentos(db: Session, instrumentos: List[Instrumento]) -> TasaRespuesta:

    respondidos = 0
    asignados = 0

    for instrumento in instrumentos:
        respondidos = respondidos + len(instrumento.respuestas_formulario)

        periodos_vinculados = instrumento.materia.periodos_vinculados

        for periodo_vinculado in periodos_vinculados:
            
            if(esPeriodoActual(periodo_vinculado, instrumento)):
                asignados = asignados + 1
        
        tasa_respuestas = TasaRespuesta(no_respondieron= asignados - respondidos, respondidos= respondidos)
    
        if(tasa_respuestas.respondidos + tasa_respuestas.no_respondieron) == 0 :
            return 0

    return tasa_respuestas.respondidos /  (tasa_respuestas.respondidos + tasa_respuestas.no_respondieron)


def getCompletitud(db:Session, instrumentos: List[Instrumento]):

    respondidas = 0
    cantEncuestados = 0

    if (len(instrumentos) == 0):
        return
    
    preguntas = len(instrumentos[0].plantilla_formulario.preguntas)

    for instrumento in instrumentos:
        for respuestasFormulario in instrumento.respuestas_formulario:
            respondidas = respondidas + len(respuestasFormulario.respuestas)
            cantEncuestados = cantEncuestados + 1

    if ((preguntas == 0) or (cantEncuestados == 0)):
        return 0

    return respondidas / (preguntas * cantEncuestados)


def getInstrumentosConPlantilla(db:Session, plantilla_id:int) -> list[Instrumento]:

    return db.scalars(select(Instrumento).where(Instrumento.plantilla_formulario == plantilla_id))

