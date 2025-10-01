from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List

from . import models, schemas
from src.database import get_db 
router = APIRouter(
    prefix="/informes-sinteticos",
    tags=["Informes Sintéticos"]
)

# Constante para el rol 
ROL_DOCENTE = "DOCENTE"

@router.get("/", response_model=List[schemas.InformeListSchema])
def listar_informes_de_docentes(db: Session = Depends(get_db)):
    """
    Obtiene una lista de todos los informes completados por usuarios con el rol 'DOCENTE'.
    Estos son los "Informes de Cátedra".
    """
    informes_completados = (
        db.query(models.RespuestaEncuesta)
        .join(models.Usuario)
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
    #mapeo del resultado al schema de la lista
    resultado = [
        schemas.InformeListSchema(
            id=informe.id,
            titulo_informe=informe.plantilla.titulo,
            docente_nombre=f"{informe.usuario.nombre} {informe.usuario.apellido}",
            fecha_completado=informe.fecha_completado
        ) for informe in informes_completados
    ]
    
    return resultado

@router.get("/{informe_id}", response_model=schemas.InformeDetailSchema)
def ver_detalle_de_informe(informe_id: int, db: Session = Depends(get_db)):
    """
    Visualiza el contenido completo de un informe específico, incluyendo
    cada pregunta y su respuesta.
    """
    informe = (
        db.query(models.RespuestaEncuesta)
        .filter(models.RespuestaEncuesta.id == informe_id)
        .options(
            joinedload(models.RespuestaEncuesta.usuario),
            joinedload(models.RespuestaEncuesta.plantilla),
            joinedload(models.RespuestaEncuesta.respuestas_individuales).joinedload(models.Respuesta.pregunta)
        )
        .first()
    )

    if not informe:
        raise HTTPException(status_code=404, detail="Informe no encontrado")

    #verificacion para que sea un informe de un docente
    if informe.plantilla.rol.nombre != ROL_DOCENTE:
        raise HTTPException(status_code=403, detail="Acceso no permitido a este tipo de informe")

    respuestas_mapeadas = [
        schemas.RespuestaDetalleSchema(
            pregunta=res.pregunta.texto,
            respuesta=res.texto_respuesta
        ) for res in informe.respuestas_individuales
    ]

    return schemas.InformeDetailSchema(
        id=informe.id,
        titulo_informe=informe.plantilla.titulo,
        docente_nombre=f"{informe.usuario.nombre} {informe.usuario.apellido}",
        fecha_completado=informe.fecha_completado,
        respuestas=respuestas_mapeadas
    )
