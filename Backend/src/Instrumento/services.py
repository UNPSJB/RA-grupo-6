from datetime import timedelta
from typing import List
from pytest import param
from sqlalchemy.orm import Session
from sqlalchemy import select
from src.Dictados.models import Dictado
from src.Departamento.models import Departamento
from src.Materias.models import Materia
from src.Instrumento import schemas
from src.PeriodoVinculado.models import PeriodoVinculado
from src.Instrumento.schemas import TasaRespuesta
from src.Instrumento.models import Instrumento, TipoInstrumento
from src.Parametros import services

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



def crearInstrumentos(db:Session, dictado: Dictado) -> bool:
    parametros = services.getParametros(db)

    departamentos = []
    
    for materia in dictado.materias_dictados:

        nuevoInstrumentoAlumno = Instrumento( 
            plantilla_formulario_id= parametros.plantilla_estudiante, 
            fecha_inicio= dictado.fecha_cierre, 
            fecha_cierre= dictado.fecha_cierre + timedelta(parametros.disponibilidad_estudiante),
            tipo = TipoInstrumento.ENCUESTA_ESTUDIANTE,
            materia_id = materia.id,
            dictado_id = dictado.id 
            )

        db.add(nuevoInstrumentoAlumno)
        db.commit()

        nuevoInstrumentoDocente = Instrumento( 
            plantilla_formulario_id= parametros.plantilla_docente,
            fecha_inicio= nuevoInstrumentoAlumno.fecha_cierre + timedelta(1), 
            fecha_cierre= nuevoInstrumentoAlumno.fecha_cierre + timedelta(parametros.disponibilidad_docente + 1),
            tipo = TipoInstrumento.INFORME_CATEDRA,
            materia_id = materia.id,
            dictado_id = dictado.id
            )
        
        db.add(nuevoInstrumentoDocente)
        db.commit()

        if not(materia.departamento_id in departamentos):
            departamentos.append(materia.departamento_id)
            nuevoInstrumentoDepartamento = Instrumento( 
                plantilla_formulario_id= parametros.plantilla_departamento,
                fecha_inicio= nuevoInstrumentoDocente.fecha_cierre + timedelta(1), 
                fecha_cierre= nuevoInstrumentoDocente.fecha_cierre + timedelta(parametros.disponibilidad_departamento + 1),
                tipo = TipoInstrumento.INFORME_SINTETICO,
                materia_id = materia.id,
                dictado_id = dictado.id
            )
            
            db.add(nuevoInstrumentoDepartamento)
            db.commit()

        

