from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from src.Informes.schemas import InformeSinteticoDetailSchema, InformeSinteticoListSchema, RespuestaDetalleSchema
from src.Informes.services import ROL_DOCENTE, listar_informes_sinteticos, obtener_informe_sintetico_por_id
from src.database import get_db

router = APIRouter(
    prefix="/informes-sinteticos",
    tags=["Informes Sintéticos"]
)

@router.get("/", response_model=List[InformeSinteticoListSchema])
def listar_informes_sinteticos_api(db: Session = Depends(get_db)):
    """
    Endpoint para listar todos los informes sintéticos completados por el Departamento.
    """
    informes_db = listar_informes_sinteticos(db)
    
    return [
        InformeSinteticoListSchema(
            id=informe.id,
            titulo_formulario=informe.plantilla.titulo,
            autor_nombre=f"{informe.usuario.nombre} {informe.usuario.apellido}",
            fecha_completado=informe.fecha_completado
        ) for informe in informes_db
    ]

@router.get("/{informe_id}", response_model=InformeSinteticoDetailSchema)
def ver_informe_sintetico_detalle_api(informe_id: int, db: Session = Depends(get_db)):
    """
    Endpoint para ver el contenido detallado de un informe sintético específico.
    """
    informe_db = obtener_informe_sintetico_por_id(db, informe_id)

    if not informe_db or informe_db.usuario.rol.nombre != ROL_DOCENTE:
        raise HTTPException(status_code=404, detail="Informe sintético no encontrado")
    
    respuestas_detalladas = [
        RespuestaDetalleSchema(
            pregunta_texto=res.pregunta.texto,
            respuesta_texto=res.texto_respuesta,
            opcion_seleccionada=res.opcion.texto if res.opcion else None
        ) for res in informe_db.respuestas_individuales
    ]
    
    return InformeSinteticoDetailSchema(
        id=informe_db.id,
        titulo_formulario=informe_db.plantilla.titulo,
        autor_nombre=f"{informe_db.usuario.nombre} {informe_db.usuario.apellido}",
        fecha_completado=informe_db.fecha_completado,
        respuestas=respuestas_detalladas
    )