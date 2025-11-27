from sqlalchemy import select, or_, func, distinct
from sqlalchemy.orm import Session
from datetime import date

from src.Usuarios.models import Usuario
from src.UsuarioDepartamento.models import UsuarioDepartamento
from src.PeriodoVinculado.models import PeriodoVinculado
from src.Instrumento.models import Instrumento, TipoInstrumento
from src.RespuestasFormulario.models import RespuestasFormulario
from src.Materias.models import Materia
from src.Carrera.models import Carrera

def get_home_estadisticas(db: Session, usuario_id: int):
    usuario = db.scalar(select(Usuario).where(Usuario.id == usuario_id))
    if not usuario:
        return None

    rol_nombre = usuario.rol.nombre.lower()
    hoy = date.today()

    estadisticas = {
        "nombre_completo": f"{usuario.nombre} {usuario.apellido}",
        "rol": usuario.rol.nombre,
    }

    if "estudiante" in rol_nombre or "alumno" in rol_nombre:
        estadisticas["materias_inscriptas"] = db.scalar(
            select(func.count(distinct(PeriodoVinculado.materia_id)))
            .where(
                PeriodoVinculado.usuario_id == usuario_id,
                or_(PeriodoVinculado.fecha_hasta >= hoy, PeriodoVinculado.fecha_hasta.is_(None))
            )
        )

        ids_materias = db.scalars(
            select(PeriodoVinculado.materia_id)
            .where(PeriodoVinculado.usuario_id == usuario_id, or_(PeriodoVinculado.fecha_hasta >= hoy, PeriodoVinculado.fecha_hasta.is_(None)))
        ).all()

        total_encuestas = 0
        respondidas = 0
        
        if ids_materias:
            total_encuestas = db.scalar(
                select(func.count(Instrumento.id))
                .where(
                    Instrumento.tipo == TipoInstrumento.ENCUESTA_ESTUDIANTE,
                    Instrumento.materia_id.in_(ids_materias),
                    Instrumento.fecha_inicio <= hoy
                )
            )
            respondidas = db.scalar(
                select(func.count(RespuestasFormulario.id))
                .join(Instrumento)
                .where(
                    RespuestasFormulario.usuario_id == usuario_id,
                    Instrumento.tipo == TipoInstrumento.ENCUESTA_ESTUDIANTE
                )
            )
        
        estadisticas["encuestas_completadas"] = respondidas
        estadisticas["encuestas_pendientes"] = max(0, total_encuestas - respondidas)

    elif "docente" in rol_nombre or "profesor" in rol_nombre:
        estadisticas["materias_dictadas"] = db.scalar(
            select(func.count(distinct(PeriodoVinculado.materia_id)))
            .where(
                PeriodoVinculado.usuario_id == usuario_id,
                PeriodoVinculado.fecha_hasta.is_(None)
            )
        )

        ids_materias = db.scalars(
            select(PeriodoVinculado.materia_id)
            .where(PeriodoVinculado.usuario_id == usuario_id, PeriodoVinculado.fecha_hasta.is_(None))
        ).all()

        total_informes = 0
        respondidos = 0

        if ids_materias:
            total_informes = db.scalar(
                select(func.count(Instrumento.id))
                .where(
                    Instrumento.tipo == TipoInstrumento.INFORME_CATEDRA,
                    Instrumento.materia_id.in_(ids_materias),
                    Instrumento.fecha_inicio <= hoy
                )
            )
            respondidos = db.scalar(
                select(func.count(RespuestasFormulario.id))
                .join(Instrumento)
                .where(
                    RespuestasFormulario.usuario_id == usuario_id,
                    Instrumento.tipo == TipoInstrumento.INFORME_CATEDRA
                )
            )

        estadisticas["informes_completados"] = respondidos
        estadisticas["informes_pendientes"] = max(0, total_informes - respondidos)

    elif "departamento" in rol_nombre:
        depto_id = db.scalar(
            select(UsuarioDepartamento.departamento_id)
            .where(UsuarioDepartamento.usuario_id == usuario_id, UsuarioDepartamento.fecha_hasta.is_(None))
        )
        
        estadisticas["materias_departamento"] = 0
        estadisticas["docentes_departamento"] = 0
        
        if depto_id:
             estadisticas["materias_departamento"] = db.scalar(select(func.count(Materia.id)).where(Materia.departamento_id == depto_id))
             
             estadisticas["docentes_departamento"] = db.scalar(
                 select(func.count(distinct(PeriodoVinculado.usuario_id)))
                 .join(Materia)
                 .where(
                     Materia.departamento_id == depto_id,
                     PeriodoVinculado.fecha_hasta.is_(None)
                 )
             )

        estadisticas["informes_sinteticos"] = db.scalar(
            select(func.count(RespuestasFormulario.id))
            .where(RespuestasFormulario.usuario_id == usuario_id)
        )

    else:
        estadisticas["total_estudiantes"] = db.scalar(
            select(func.count(distinct(PeriodoVinculado.usuario_id)))
            .join(Usuario)
            .where(Usuario.rol_id == 1, or_(PeriodoVinculado.fecha_hasta >= hoy, PeriodoVinculado.fecha_hasta.is_(None)))
        )

        estadisticas["total_docentes"] = db.scalar(
            select(func.count(distinct(PeriodoVinculado.usuario_id)))
            .join(Usuario)
            .where(Usuario.rol_id == 2, PeriodoVinculado.fecha_hasta.is_(None))
        )

        estadisticas["total_carreras"] = db.scalar(select(func.count(Carrera.id)))

    return estadisticas