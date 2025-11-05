from datetime import date
from sqlalchemy import null, select
from sqlalchemy.orm import Session

from src.Departamento.models import Departamento
from src.PeriodoVinculado.schemas import PeriodoVinculado
from src.Usuarios.models import Usuario
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
    

def esAsignado(periodo_vinculado : PeriodoVinculado, dictado: Dictado):
    
    if ((periodo_vinculado.fecha_desde <= dictado.fecha_inicio) and (periodo_vinculado.fecha_hasta == dictado.fecha_cierre)):
        return True

    return False

#Obtiene la cantidad de respuestas de los instrumentos del ultimo dictado. 
def getCantRespInstUltDic(db: Session):

    instrumentos = getInstrumentosUltDictado(db)
    dictado = getUltimoDictado(db)

    estadisticas = {}
    estadisticas['Respondidas_Alumno'] = 0
    estadisticas['Asignadas_Alumno'] = 0
    estadisticas['Respondidas_Docente'] = 0
    estadisticas['Asignadas_Docente'] = 0
    estadisticas['Respondidas_Departamento'] = 0
    estadisticas['Asignadas_Departamento'] = 0
    
    #Obtengo el numero de respuestas por cada rol.
    for instrumento in instrumentos:

        rol_usuario_encuestado = instrumento.plantilla_formulario.rol.nombre.strip().lower()

        match(rol_usuario_encuestado):
            case ("estudiante"):
                estadisticas['Respondidas_Alumno'] = estadisticas['Respondidas_Alumno'] + len(instrumento.respuestas_formulario)

                asignados = list(filter(lambda x: esAsignado(x, dictado), instrumento.materia.periodos_vinculados))
                estudiantes = list(filter(lambda x: x.usuario.rol.nombre.lower() == "estudiante", asignados)) 
                estadisticas['Asignadas_Alumno'] = estadisticas['Asignadas_Alumno'] + len(estudiantes) 

            case ("docente"):
                
                estadisticas['Respondidas_Docente'] = estadisticas['Respondidas_Docente'] + len(instrumento.respuestas_formulario)

                docentes = list(filter(lambda x: x.fecha_hasta is None, instrumento.materia.periodos_vinculados))
                estadisticas['Asignadas_Docente'] = estadisticas['Asignadas_Docente'] + len(docentes) 
            
            case ("departamento"):
                estadisticas['Respondidas_Departamento'] = estadisticas['Respondidas_Departamento'] + len(instrumento.respuestas_formulario)

                departamentos_historicos = list(filter(lambda x: x.usuario.rol.nombre.strip().lower() == "departamento" ,instrumento.materia.departamento.usuarios_info))
                departamentos_actuales = list(filter(lambda x: x.fecha_hasta is None, departamentos_historicos))

                estadisticas['Asignadas_Departamento'] = estadisticas['Asignadas_Departamento'] + len(departamentos_actuales) 

    return estadisticas
