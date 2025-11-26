from datetime import date, timedelta
from typing import List
from fastapi.background import P
from pytest import param
import array
from typing import List
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, or_, select
from src.Usuarios.models import Usuario
from src.Materias.services import get_Docente
from src.RespuestasFormulario.models import RespuestasFormulario
from src.Dictados.models import Dictado
from src.Departamento.models import Departamento
from src.Materias.models import Materia
from src.Instrumento import schemas
from src.Roles.models import Rol
from src.PeriodoVinculado.models import PeriodoVinculado
from src.Instrumento.schemas import TasaRespuesta
from src.Instrumento.models import Instrumento, TipoInstrumento
from src.Parametros import services
from src.Instrumento import exceptions
from src.UsuarioDepartamento.models import UsuarioDepartamento


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



def crearInstrumentos(db:Session, dictado: Dictado) -> bool:
    parametros = services.getParametros(db)

    departamentos = []
    
    for materia in dictado.materias_dictados:

        nuevoInstrumentoAlumno = Instrumento( 
            plantilla_formulario= parametros.plantilla_estudiante, 
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

        


def crearInstrumentos(db:Session, dictado: Dictado) -> bool:
    parametros = services.getParametros(db)

    departamentos = []
    
    for materia in dictado.materias_dictados:

        nuevoInstrumentoAlumno = Instrumento( 
            plantilla_formulario= parametros.plantilla_estudiante, 
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

        


def getTasaRespuestasInstrumentos(db: Session, instrumentos: List[Instrumento], rol_id: int) -> TasaRespuesta:

    rol = db.scalar(select(Rol).where(Rol.id == rol_id))
    
    #Inicializacion variables
    respondidos = 0
    asignados = 0

    if ("departamento" in rol.nombre.lower()):
        for instrumento in instrumentos:
            respondidos = respondidos + len(instrumento.respuestas_formulario)
            departamento = instrumento.materia.departamento
            
            for usuario in departamento.usuarios_info:
                if (usuario.fecha_hasta is None):
                    respondidos = respondidos + 1

    else:
        for instrumento in instrumentos:
            respondidos = respondidos + len(instrumento.respuestas_formulario)
            periodos_vinculados = instrumento.materia.periodos_vinculados

            for periodo_vinculado in periodos_vinculados:
                if periodo_vinculado.usuario.rol.id == rol.id:
                    asignados = asignados + 1
            
    tasa_respuestas = TasaRespuesta(no_respondieron= asignados - respondidos, respondidos= respondidos)

    if asignados == 0:
        return 0

    return (tasa_respuestas.respondidos /  (tasa_respuestas.respondidos + tasa_respuestas.no_respondieron))



def getTasaRespuestasInstrumentosDocente(db: Session, docente_id: int) -> List[dict]:

    # docente = db.scalar(select(Usuario).where(Usuario.id == docente_id))

    periodos_vinculados = db.scalars(select(PeriodoVinculado).where(PeriodoVinculado.usuario_id == docente_id)).all()

    estadisticas_materias = []

    for periodo in periodos_vinculados:
        
        estadistica_materia = {}

        instrumento = db.query(Instrumento).where(Instrumento.materia_id == periodo.materia_id).order_by(Instrumento.fecha_cierre.desc()).first()
        
        tasa = obtenerTasaRespuestas(db, instrumento.id)

        estadistica_materia['Instrumento_id'] = instrumento.id
        estadistica_materia['Materia'] = instrumento.materia.nombre
        estadistica_materia['Respondidos'] = tasa.respondidos
        estadistica_materia['Asignados'] = 0
        asignados = []
        
        for (periodoMateria) in periodo.materia.periodos_vinculados:
            if ((periodoMateria.fecha_desde <= instrumento.dictado.fecha_inicio) and (periodoMateria.fecha_hasta == instrumento.dictado.fecha_cierre)):
                asignados.append(periodoMateria)

            estudiantes = list(filter(lambda x: x.usuario.rol.nombre.lower() == "estudiante", asignados)) 
        
        estadistica_materia['Asignados'] = len(estudiantes)
        
        estadisticas_materias.append(estadistica_materia)
        
    return estadisticas_materias



def getCompletitud(db:Session, instrumentos: List[Instrumento]):

    respondidas = 0
    cantEncuestados = 0

    if (len(instrumentos) == 0):
        return 0
    
    preguntas = len(instrumentos[0].plantilla_formulario.preguntas)

    for instrumento in instrumentos:
        for respuestasFormulario in instrumento.respuestas_formulario:
            respondidas = respondidas + len(respuestasFormulario.respuestas)
            cantEncuestados = cantEncuestados + 1

    if ((preguntas == 0) or (cantEncuestados == 0)):
        return 0

    return (respondidas / (preguntas * cantEncuestados))


def getInstrumentosConPlantilla(db:Session, plantilla_id:int) -> list[Instrumento]:

    return db.scalars(select(Instrumento).where(Instrumento.plantilla_formulario == plantilla_id))


def getDatosInstrumento(db:Session, instrumento_id: int) -> dict :

    db_instrumento = db.scalar(select(Instrumento).where(Instrumento.id == instrumento_id))

    docente = get_Docente(db_instrumento.materia_id, db)
    # inscriptos = get_inscriptos(db, db_instrumento.materia_id, db_instrumento.id)
    inscriptos = 0
    datos = {}

    if (db_instrumento.plantilla_formulario.rol.nombre.lower() == "estudiante"):
        
        datos['sede'] = db_instrumento.departamento.sede
        datos['carrera'] = db_instrumento.materia.carrera.nombre
        datos['asignatura'] = db_instrumento.materia.nombre

    elif (db_instrumento.plantilla_formulario.rol.nombre.lower() == "docente"):   
        datos['sede'] = db_instrumento.departamento.sede
        datos['cicloLectivo'] = db_instrumento.dictado.fecha_inicio.year
        datos['asignatura'] = db_instrumento.materia.nombre
        datos['codAsignatura'] = db_instrumento.materia.id
        datos['docente'] = (docente.nombre + " " + docente.apellido).capitalize()
        datos['inscriptos'] = inscriptos
        datos['comisionesTeoricas'] = "-",
        datos['comisionesPracticas'] = "-"
    else:  
        datos['sede'] = db_instrumento.departamento.sede
        datos['cicloLectivo'] = db_instrumento.dictado.fecha_inicio.year
        datos['departamento'] = db_instrumento.departamento.nombre
        datos['integrantes'] = "-"
    
    return datos


def getDatosInstrumentoSintetico(db:Session, instrumento_id: int) -> dict:
    
    instrumento_actual = db.scalar(select(Instrumento).where(Instrumento.id == instrumento_id))

    if instrumento_actual.tipo == TipoInstrumento.INFORME_SINTETICO:

        if not instrumento_actual.dictado_id or not instrumento_actual.departamento_id:
            return None

        instrumentos_catedra = db.scalars(
            select(Instrumento)
            .join(Materia, Instrumento.materia_id == Materia.id)
            .where(Instrumento.dictado_id == instrumento_actual.dictado_id, 
                   Instrumento.tipo == TipoInstrumento.INFORME_CATEDRA,
                   Materia.departamento_id == instrumento_actual.departamento_id)
        ).all()

        if not instrumentos_catedra:
            return None
        
        datos = []


        for instrumento_catedra in instrumentos_catedra:
            inscriptos = 0
            instrumento = {}
            instrumento['codAsignatura'] = instrumento_catedra.materia.id
            instrumento['asignatura'] = instrumento_catedra.materia.nombre
            instrumento['inscriptos'] = inscriptos
            instrumento['comisionesTeoricas'] = "-",
            instrumento['comisionesPracticas'] = "-"

            datos.append(instrumento)

    return datos


def obtener_instrumentos_por_tipo_usuario(db: Session, tipo: str, usuario_id: int, mostrar_respondidos: bool):
    from sqlalchemy import select, and_
    from sqlalchemy.orm import joinedload
    
    instrumentos = db.scalars(
        select(Instrumento)
        .where(Instrumento.tipo == tipo)
        .options(
            joinedload(Instrumento.materia),
            joinedload(Instrumento.plantilla_formulario)
        )
    ).all()
    
    instrumentos_con_info = []
    
    for instrumento in instrumentos: # Verificar si el user tiene RespuestasFormulario para el instrumento
        respuestas_form = db.scalar(
            select(RespuestasFormulario)
            .where(
                and_(
                    RespuestasFormulario.instrumento_id == instrumento.id,
                    RespuestasFormulario.usuario_id == usuario_id
                )
            )
        )
        
        respondido = respuestas_form is not None
        
        # Filtrar mostrar_respondidos
        if (mostrar_respondidos and respondido) or (not mostrar_respondidos and not respondido):
            instrumentos_con_info.append({
                "id": instrumento.id,
                "tipo": instrumento.tipo,
                "fecha_inicio": instrumento.fecha_inicio,
                "fecha_cierre": instrumento.fecha_cierre,
                "materia": {
                    "id": instrumento.materia.id,
                    "nombre": instrumento.materia.nombre
                },
                "plantilla_formulario": {
                    "id": instrumento.plantilla_formulario.id,
                    "titulo": instrumento.plantilla_formulario.titulo
                } if instrumento.plantilla_formulario else None,
                "respondido": respondido,
                "respuestas_formulario_id": respuestas_form.id if respuestas_form else None,
                "fecha_envio": respuestas_form.fecha_envio if respuestas_form else None
            })
    
    return instrumentos_con_info

##
#Obtiene informes de cátedra respondidos por un usuario 
def obtener_informes_catedra_por_usuario(db: Session, usuario_id: int):
    from sqlalchemy import select, and_
    from sqlalchemy.orm import joinedload
    
    # Buscar respuestas formulario para instrumentos INFORME_CATEDRA
    respuestas_form = db.scalars(
        select(RespuestasFormulario)
        .join(Instrumento)
        .options(
            joinedload(RespuestasFormulario.instrumento)
            .joinedload(Instrumento.materia),
            joinedload(RespuestasFormulario.instrumento)
            .joinedload(Instrumento.plantilla_formulario)
        )
        .where(and_(
            RespuestasFormulario.usuario_id == usuario_id,
            Instrumento.tipo == TipoInstrumento.INFORME_CATEDRA
        ))
    ).all()
    
    return [
        {
            "id": rf.id,
            "fecha_envio": rf.fecha_envio,
            "instrumento_id": rf.instrumento_id,
            "instrumento": {
                "id": rf.instrumento.id,
                "nombre": rf.instrumento.plantilla_formulario.titulo,
                "tipo": rf.instrumento.tipo,
                "fecha_inicio": rf.instrumento.fecha_inicio,
                "fecha_cierre": rf.instrumento.fecha_cierre
            },
            "materia": {
                "id": rf.instrumento.materia.id,
                "nombre": rf.instrumento.materia.nombre
            },
            "plantilla_formulario_id": rf.instrumento.plantilla_formulario_id,
            "respondido": True
        }
        for rf in respuestas_form
    ]

def obtener_instrumentos_no_respondidos(db: Session, tipo: str, usuario_id: int, mostrar_respondidos: bool):
    usuario = db.scalar(select(Usuario).where(Usuario.id == usuario_id))
    if not usuario:
        return []
    
    hoy = date.today()
    rol_nombre = usuario.rol.nombre.lower() if usuario.rol else ""
    es_departamento = "departamento" in rol_nombre

    if es_departamento:
        informes = (
            select(Instrumento)
            .join(Materia, Instrumento.materia_id == Materia.id)
            .join(UsuarioDepartamento, UsuarioDepartamento.departamento_id == Materia.departamento_id)
            .where(
                and_(
                    Instrumento.tipo == tipo,
                    UsuarioDepartamento.usuario_id == usuario_id,
                    UsuarioDepartamento.fecha_hasta.is_(None),
                    Instrumento.fecha_inicio <= hoy
                )
            )
        )
    else:
        condiciones = [
            Instrumento.tipo == tipo,
            PeriodoVinculado.usuario_id == usuario_id,
            Instrumento.fecha_inicio <= hoy
        ]

        # REGLAS ESPECIFICAS POR ROL
        if "docente" in rol_nombre or "profesor" in rol_nombre:
            condiciones.append(PeriodoVinculado.fecha_hasta.is_(None))
        else:
            condiciones.append(
                or_(
                    PeriodoVinculado.fecha_hasta >= hoy,
                    PeriodoVinculado.fecha_hasta.is_(None)
                )
            )

        informes = (
            select(Instrumento)
            .join(PeriodoVinculado, Instrumento.materia_id == PeriodoVinculado.materia_id) 
            .where(and_(*condiciones))
        )

    informes = informes.distinct().options(
        joinedload(Instrumento.materia),
        joinedload(Instrumento.plantilla_formulario)
    )

    instrumentos = db.scalars(informes).all()

    instrumentos_con_info = []
    
    for instrumento in instrumentos:
        respuestas_form = db.scalar(
            select(RespuestasFormulario)
            .where(
                and_(
                    RespuestasFormulario.instrumento_id == instrumento.id,
                    RespuestasFormulario.usuario_id == usuario_id
                )
            )
        )
        
        respondido = respuestas_form is not None
        
        if (not mostrar_respondidos and not respondido) or (mostrar_respondidos):
            instrumentos_con_info.append({
                "id": instrumento.id,
                "tipo": instrumento.tipo,
                "fecha_inicio": instrumento.fecha_inicio,
                "fecha_cierre": instrumento.fecha_cierre,
                "materia": {
                    "id": instrumento.materia.id,
                    "nombre": instrumento.materia.nombre
                },
                "plantilla_formulario": {
                    "id": instrumento.plantilla_formulario.id,
                    "titulo": instrumento.plantilla_formulario.titulo
                } if instrumento.plantilla_formulario else None,
                "respondido": respondido,
                "respuestas_formulario_id": respuestas_form.id if respuestas_form else None,
                "fecha_envio": respuestas_form.fecha_envio if respuestas_form else None
            })
    
    return instrumentos_con_info