from typing import List, Optional
from sqlalchemy.orm import Session, joinedload

from src.Encuesta import models


# Constante para el rol que nos interesa
ROL_DOCENTE = "DOCENTE"

def get_informes_completados_docentes(db: Session) -> List[models.RespuestaEncuesta]:
    """
    Servicio que obtiene de la base de datos todos los informes de cátedra
    (aquellos completados por docentes).
    Devuelve una lista de objetos del modelo SQLAlchemy.
    """
    return (
        db.query(models.RespuestaEncuesta)
        .join(models.PlantillaEncuesta)
        .join(models.Rol)
        .filter(models.Rol.nombre == ROL_DOCENTE)
        .filter(models.RespuestaEncuesta.estado == "COMPLETADO")
        .options(
            joinedload(models.RespuestaEncuesta.usuario),
            joinedload(models.RespuestaEncuesta.plantilla)
        )
        .all()
    )

def get_informe_por_id(db: Session, informe_id: int) -> Optional[models.RespuestaEncuesta]:
    """
    Servicio que obtiene un informe específico por su ID, precargando toda
    la información necesaria para la vista de detalle.
    Devuelve un único objeto del modelo SQLAlchemy o None si no se encuentra.
    """
    return (
        db.query(models.RespuestaEncuesta)
        .filter(models.RespuestaEncuesta.id == informe_id)
        .options(
            joinedload(models.RespuestaEncuesta.usuario),
            joinedload(models.RespuestaEncuesta.plantilla).joinedload(models.PlantillaEncuesta.rol),
            joinedload(models.RespuestaEncuesta.respuestas_individuales).joinedload(models.Respuesta.pregunta)
        )
        .first()
    )