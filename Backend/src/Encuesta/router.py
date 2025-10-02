

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

  # Importamos los servicios
from src.Encuesta import schemas, services
from src.database import get_db 

router = APIRouter(
    prefix="/informes-sinteticos",
    tags=["Informes Sintéticos"]
)

@router.get("/", response_model=List[schemas.InformeListSchema])
def listar_informes_de_docentes(db: Session = Depends(get_db)):
    """
    Obtiene una lista de todos los informes completados por docentes (Informes de Cátedra).
    La lógica de la base de datos está en la capa de servicios.
    """
    informes_db = services.get_informes_completados_docentes(db)
    
    resultado = [
        schemas.InformeListSchema(
            id=informe.id,
            titulo_informe=informe.plantilla.titulo,
            docente_nombre=f"{informe.usuario.nombre} {informe.usuario.apellido}",
            fecha_completado=informe.fecha_completado
        ) for informe in informes_db
    ]
    
    return resultado

@router.get("/{informe_id}", response_model=schemas.InformeDetailSchema)
def ver_detalle_de_informe(informe_id: int, db: Session = Depends(get_db)):
    """
    Visualiza el contenido completo de un informe específico.
    """
    informe = services.get_informe_por_id(db, informe_id)

    if not informe:
        raise HTTPException(status_code=404, detail="Informe no encontrado")

    if informe.plantilla.rol.nombre != services.ROL_DOCENTE:
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