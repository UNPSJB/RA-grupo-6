from datetime import date
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload
from typing import Dict, Any 

from src.PeriodoVinculado.schemas import PeriodoVinculado
from src.Materias.models import Materia, EnumTipoDictado
from src.Dictados.models import Dictado, MateriaDictado
from src.Dictados import schemas,exceptions

from collections import defaultdict

from src.PeriodoVinculado.models import PeriodoVinculado
from src.Instrumento.models import TipoInstrumento, Instrumento
from src.Carrera.models import Carrera
from src.Parametros import services


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

#Obtine los porcentajes de los promedios que tuvieron los docentes en las encuestas de los alumnos en el ultimo cuatrimestre
def getPromedioDocentes(db: Session):
    instrumentos = getInstrumentosUltDictado(db)
    dictado = getUltimoDictado(db)

    promedios = []
    for instrumento in instrumentos:

        rol_usuario_encuestado = instrumento.plantilla_formulario.rol.nombre.strip().lower()
        estadisticas = {
            "Respondidas_Alumno": 0,
            "Asignadas_Alumno": 0
        }

        match rol_usuario_encuestado:
            case "estudiante":
                estadisticas["Respondidas_Alumno"] += len(instrumento.respuestas_formulario)

                asignados = list(filter(lambda x: esAsignado(x, dictado), instrumento.materia.periodos_vinculados))
                estudiantes = list(filter(lambda x: x.usuario.rol.nombre.lower() == "estudiante", asignados))
                estadisticas["Asignadas_Alumno"] += len(estudiantes)

                # Obtener docente actual
                periodos = instrumento.materia.periodos_vinculados

                for periodo in periodos:
                    if periodo.fecha_hasta is None:
                        
                        docente_nombre = periodo.usuario.nombre
                        docente_apellido = periodo.usuario.apellido


                respuestas_formularios = instrumento.respuestas_formulario

                # Agrupar valores por letra y título
                grupos_valores = {}
                for respuesta_formulario in respuestas_formularios:
                    for respuesta in respuesta_formulario.respuestas:
                        if respuesta.pregunta.tipo == "cerrada":
                            letra = respuesta.pregunta.grupo_pregunta.letra

                            if letra != "A":
                                titulo = respuesta.pregunta.grupo_pregunta.titulo
                                texto_opcion = respuesta.opcion.texto.strip()

                                valor = None
                                match texto_opcion:
                                    case "Malo, No satisfactorio":
                                        valor = 1
                                    case "Regular, Poco satisfactorio":
                                        valor = 2
                                    case "Bueno, Satisfactorio":
                                        valor = 3
                                    case "Muy Bueno, Muy Satisfactorio":
                                        valor = 4

                                if valor is not None:
                                    if letra not in grupos_valores:
                                        grupos_valores[letra] = {"titulo": titulo, "valores": []}
                                    grupos_valores[letra]["valores"].append(valor)

                # Calcular promedios por grupo 
                promedios_por_grupo = []
                for letra, data in grupos_valores.items():
                    valores = data["valores"]
                    promedio = round(sum(valores) / len(valores), 2) if valores else 0
                    promedios_por_grupo.append({
                        "letra": letra,
                        "titulo": data["titulo"],  
                        "promedio": promedio
                    })

                
                total = 0
                cantidad = 0

                for data in grupos_valores.values():
                    valores = data["valores"]
                    total += sum(valores)
                    cantidad += len(valores)

                promedio_general = round(total / cantidad, 2) if cantidad > 0 else 0

                promedios.append({
                    "id": instrumento.materia.id,
                    "nombre": instrumento.materia.nombre,
                    "docente_apellido": docente_apellido,
                    "docente_nombre": docente_nombre,
                    "promedios_por_grupo": promedios_por_grupo,
                    "promedio_general": promedio_general,
                    "tasa_de_respuesta": estadisticas,
                    "cuatrimestre": dictado.fecha_inicio.year
                })

    return promedios

def getEstadisticasPorCarrera(db: Session, departamento_id: int = None) -> Dict[str, Any]:
    """Obtiene estadísticas de TODOS los instrumentos ENCUESTA_ESTUDIANTE agrupados por carrera"""
    return _calcular_estadisticas_todos_instrumentos(db, agrupar_por='carrera', departamento_id=departamento_id)

def getEstadisticasPorMateria(db: Session, carrera_id: int) -> Dict[str, Any]:
    """Obtiene estadísticas de TODOS los instrumentos ENCUESTA_ESTUDIANTE para materias de una carrera específica"""
    estadisticas = _calcular_estadisticas_todos_instrumentos(db, agrupar_por='materia')
    return {k: v for k, v in estadisticas.items() if v.get('carrera_id') == carrera_id}

def getEstadisticasPorAnio(db: Session, departamento_id: int = None) -> Dict[str, Any]:
    """Obtiene estadísticas de TODOS los instrumentos ENCUESTA_ESTUDIANTE agrupados por año"""
    return _calcular_estadisticas_todos_instrumentos(db, agrupar_por='anio', departamento_id=departamento_id)

def getEstadisticasDetalladas(db: Session, departamento_id: int = None) -> Dict[str, Any]:
    """Obtiene estadísticas detalladas de TODOS los instrumentos para filtros avanzados"""
    return _calcular_estadisticas_todos_instrumentos(db, agrupar_por='detallado', departamento_id=departamento_id)

def _calcular_estadisticas_todos_instrumentos(db: Session, agrupar_por: str, departamento_id: int = None) -> Dict[str, Any]:
    """
    Calcula estadísticas para TODOS los instrumentos ENCUESTA_ESTUDIANTE históricos
    """
    # Query base para instrumentos con todas las relaciones necesarias
    query = db.query(Instrumento).filter(
        Instrumento.tipo == TipoInstrumento.ENCUESTA_ESTUDIANTE
    ).options(
        joinedload(Instrumento.materia).joinedload(Materia.carrera).joinedload(Carrera.departamento),
        joinedload(Instrumento.respuestas_formulario)
    )
    
    # Filtrar por departamento si se especifica
    if departamento_id is not None:
        query = query.join(Materia).join(Carrera).filter(Carrera.departamento_id == departamento_id)
    
    instrumentos = query.all()
    
    if not instrumentos:
        return {}
    
    # Estructuras para agrupamiento
    stats_por_carrera = defaultdict(lambda: {
        'asignados': 0, 
        'respondidos': 0, 
        'no_respondidos': 0, 
        'carrera_nombre': '', 
        'departamento_id': None,
        'departamento_nombre': ''
    })
    
    stats_por_anio = defaultdict(lambda: {
        'asignados': 0, 
        'respondidos': 0, 
        'no_respondidos': 0, 
        'anio': 0
    })
    
    stats_por_materia = defaultdict(lambda: {
        'asignados': 0, 
        'respondidos': 0, 
        'no_respondidos': 0, 
        'materia_nombre': '', 
        'carrera_id': 0, 
        'carrera_nombre': '', 
        'departamento_id': None,
        'departamento_nombre': ''
    })
    
    stats_detalladas = []
    
    for instrumento in instrumentos:
        if not instrumento.materia or not instrumento.materia.carrera:
            continue
            
        materia = instrumento.materia
        carrera = materia.carrera
        departamento = carrera.departamento
        
        # Calcular para este instrumento específico
        asignados = _obtener_estudiantes_asignados(db, materia, instrumento)
        respondidos = len(instrumento.respuestas_formulario)
        no_respondidos = max(0, asignados - respondidos)
        anio = instrumento.fecha_cierre.year
        
        # Acumular en agrupamientos
        # Por carrera
        stats_por_carrera[carrera.id]['asignados'] += asignados
        stats_por_carrera[carrera.id]['respondidos'] += respondidos
        stats_por_carrera[carrera.id]['no_respondidos'] += no_respondidos
        stats_por_carrera[carrera.id]['carrera_nombre'] = carrera.nombre
        stats_por_carrera[carrera.id]['departamento_id'] = departamento.id if departamento else None
        stats_por_carrera[carrera.id]['departamento_nombre'] = departamento.nombre if departamento else ''
        
        # Por año
        stats_por_anio[anio]['asignados'] += asignados
        stats_por_anio[anio]['respondidos'] += respondidos
        stats_por_anio[anio]['no_respondidos'] += no_respondidos
        stats_por_anio[anio]['anio'] = anio
        
        # Por materia
        stats_por_materia[materia.id]['asignados'] += asignados
        stats_por_materia[materia.id]['respondidos'] += respondidos
        stats_por_materia[materia.id]['no_respondidos'] += no_respondidos
        stats_por_materia[materia.id]['materia_nombre'] = materia.nombre
        stats_por_materia[materia.id]['carrera_id'] = carrera.id
        stats_por_materia[materia.id]['carrera_nombre'] = carrera.nombre
        stats_por_materia[materia.id]['departamento_id'] = departamento.id if departamento else None
        stats_por_materia[materia.id]['departamento_nombre'] = departamento.nombre if departamento else ''
        
        # Datos detallados para filtros
        stats_detalladas.append({
            'instrumento_id': instrumento.id,
            'materia_id': materia.id,
            'materia_nombre': materia.nombre,
            'carrera_id': carrera.id,
            'carrera_nombre': carrera.nombre,
            'departamento_id': departamento.id if departamento else None,
            'departamento_nombre': departamento.nombre if departamento else 'Sin departamento',
            'anio': anio,
            'fecha_inicio': instrumento.fecha_inicio.isoformat(),
            'fecha_cierre': instrumento.fecha_cierre.isoformat(),
            'asignados': asignados,
            'respondidos': respondidos,
            'no_respondidos': no_respondidos
        })
    
    # Retornar según el tipo de agrupamiento solicitado
    if agrupar_por == 'carrera':
        return dict(stats_por_carrera)
    elif agrupar_por == 'anio':
        return dict(stats_por_anio)
    elif agrupar_por == 'materia':
        return dict(stats_por_materia)
    elif agrupar_por == 'detallado':
        return {'detallado': stats_detalladas}
    
    return {}

def _obtener_estudiantes_asignados(db: Session, materia: Materia, instrumento: Instrumento) -> int:
    """Obtiene estudiantes asignados a la materia durante el período del instrumento"""
    try:
        count = db.query(PeriodoVinculado).filter(
            PeriodoVinculado.materia_id == materia.id,
            PeriodoVinculado.fecha_desde <= instrumento.fecha_cierre,
            (PeriodoVinculado.fecha_hasta >= instrumento.fecha_inicio) | (PeriodoVinculado.fecha_hasta.is_(None))
        ).count()
        return count
    except Exception as e:
        print(f"Error calculando estudiantes asignados para materia {materia.id}: {e}")
        return 0



def CrearDictadosAnuales(db:Session) -> schemas.Dictado:
    parametros = services.getParametros(db)

    #Definicion de fechas de referencia
    ANIO_DICTADO_NUEVO = date.today().year
    INICIO_PRIMER_CUATRIMESTRE = date(ANIO_DICTADO_NUEVO, 3, 1)
    INICIO_SEGUNDO_CUATRIMESTRE = date(ANIO_DICTADO_NUEVO, 7, 1)
    FIN_SEGUNDO_CUATRIMESTRE = date(ANIO_DICTADO_NUEVO, 12, 31)

    dictados_creados = []

    #PRIMER DICTADO
    dictado_prim_cuatri =  db.scalars(select(Dictado).where((Dictado.fecha_inicio >= INICIO_PRIMER_CUATRIMESTRE) & (Dictado.fecha_cierre <= INICIO_SEGUNDO_CUATRIMESTRE))).first() 

    if (dictado_prim_cuatri is None):
        materias = db.scalars(select(Materia).where(Materia.dictado == EnumTipoDictado.PRIMER_CUATRIMESTRE)).all()  
        nuevoDictado = Dictado(fecha_inicio=parametros.inicio_primer_dictado, fecha_cierre=parametros.cierre_primer_dictado)
        
        db.add(nuevoDictado)
        db.commit()
        db.refresh(nuevoDictado)

        dictados_creados.append(nuevoDictado)

        for materia in materias:

            materiaDictado = MateriaDictado(materia_id = materia.id, dictado_id=nuevoDictado.id) 

            db.add(materiaDictado)
            db.commit()


    #SEGUNDO DICTADO
    dictado_seg_cuatri =  db.scalars(select(Dictado).where((Dictado.fecha_inicio >= INICIO_SEGUNDO_CUATRIMESTRE) & (Dictado.fecha_cierre <= FIN_SEGUNDO_CUATRIMESTRE))).first() 

    if (dictado_seg_cuatri is None):
        materias = db.scalars(select(Materia).where(Materia.dictado == EnumTipoDictado.SEGUNDO_CUATRIMESTRE)).all()  

        nuevoDictado = Dictado(fecha_inicio=parametros.inicio_segundo_dictado, fecha_cierre=parametros.cierre_segundo_dictado)
    
        db.add(nuevoDictado)
        db.commit()
        db.refresh(nuevoDictado)

        dictados_creados.append(nuevoDictado)

        for materia in materias:

            materiaDictado = MateriaDictado(materia_id = materia.id, dictado_id=nuevoDictado.id) 

            db.add(materiaDictado)
            db.commit()
            
    return nuevoDictado
