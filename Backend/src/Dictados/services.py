from datetime import date
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.Materias.models import Materia, EnumTipoDictado
from src.Dictados.models import Dictado, MateriaDictado
from src.Dictados import schemas,exceptions


def create_dictado(db: Session, dictado: schemas.DictadoCreate ) -> schemas.Dictado:

    #VER SI HAY QUE EVALUAR QUE TENGAN 15 SEMANAS DE DIFERENCIA.

    if (date.today() >= dictado.fecha_inicio):
        raise exceptions.DictadoPasado

    if (dictado.fecha_inicio >= dictado.fecha_cierre):
        raise exceptions.FechasInvalidas

    #Definicion de fechas de referencia
    ANIO_PERIODO_NUEVO = dictado.fecha_inicio.year
    INICIO_PRIMER_CUATRIMESTRE = date(ANIO_PERIODO_NUEVO, 3, 1)
    INICIO_SEGUNDO_CUATRIMESTRE = date(ANIO_PERIODO_NUEVO, 7, 1)
    FIN_SEGUNDO_CUATRIMESTRE = date(ANIO_PERIODO_NUEVO, 12, 31)

    if ((dictado.fecha_inicio >= INICIO_PRIMER_CUATRIMESTRE) & (dictado.fecha_cierre <= INICIO_SEGUNDO_CUATRIMESTRE)):
        db_dictado = db.scalars(select(Dictado).where((Dictado.fecha_inicio >= INICIO_PRIMER_CUATRIMESTRE) & (Dictado.fecha_cierre <= INICIO_SEGUNDO_CUATRIMESTRE))).first() 
        
        if(db_dictado is None):
            materias = db.scalars(select(Materia).where(Materia.dictado == EnumTipoDictado.PRIMER_CUATRIMESTRE)).all()    

        else:
            raise exceptions.PrimerDictadoAnualExiste

    elif((dictado.fecha_inicio >= INICIO_SEGUNDO_CUATRIMESTRE) & (dictado.fecha_cierre <= FIN_SEGUNDO_CUATRIMESTRE)):
        db_dictado = db.scalars(select(Dictado).where((Dictado.fecha_inicio >= INICIO_SEGUNDO_CUATRIMESTRE) & (Dictado.fecha_cierre <= FIN_SEGUNDO_CUATRIMESTRE))).first() 

        if(db_dictado is None):
            materias = db.scalars(select(Materia).where((Materia.dictado == EnumTipoDictado.SEGUNDO_CUATRIMESTRE) | (Materia.dictado == EnumTipoDictado.ANUAL))).all()    

        else:
            raise exceptions.SegundoDictadoAnualExiste
    else:
        raise exceptions.DictadoEnPeriodoInvalido

    nuevoDictado = Dictado(fecha_inicio=dictado.fecha_inicio, fecha_cierre=dictado.fecha_cierre)

    for m in materias:
        nuevoDictado.materias.append(m)
    db.add(nuevoDictado)
    db.commit()
    db.refresh(nuevoDictado)

    return nuevoDictado


def getUltimoDictado(db: Session):

    ultimo_dictado = db.query(Dictado).order_by(Dictado.fecha_cierre.desc()).first()

    if ultimo_dictado is None:
        raise exceptions.DictadoNoEncontrado

    return ultimo_dictado


def getMateriasUltimoDictado(db: Session):
    
    ultimo_dictado = getUltimoDictado(db)

    materias_dictados = db.scalars(select(MateriaDictado).where(MateriaDictado.dictado_id == ultimo_dictado.id)).all()

    materia_list = []
    for materia_dictado in materias_dictados:
        materia_list.append(materia_dictado.materia)

    return materia_list


def getInstrumentosUltDictado(db: Session):

    ultimo_dictado = getUltimoDictado(db)

    return ultimo_dictado.instrumentos
    

def getCantInstrumentosUltDic(db: Session):

    return len(getInstrumentosUltDictado(db))
