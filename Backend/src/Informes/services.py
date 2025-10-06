# En tu archivo de servicios (ej: src/Informes/services.py)

from sqlalchemy.orm import Session, joinedload
from typing import TYPE_CHECKING, List, Optional

from src.RespuestasFormulario.models import RespuestasFormulario
from src.Roles.models import Rol
from src.PlantillaFormulario.models import PlantillaFormulario
from src import models
from src.Usuarios.models import Usuario
from src.Respuesta.models import Respuesta
ROL_DOCENTE = "Docente" 
    
    
    
    
    
def listar_informes_sinteticos(db: Session) -> List[RespuestasFormulario]:
    """
    Obtiene de la DB todas las entregas de formularios cuyas plantillas
    fueron designadas para el rol de 'DOCENTE'.
    """
    return (
        db.query(RespuestasFormulario)
        # Hacemos el join a través de la plantilla, como sugeriste
        .join(RespuestasFormulario.plantilla) 
        .join(PlantillaFormulario.rol)
        # Y filtramos por el nombre del rol en la plantilla
        .filter(Rol.nombre == ROL_DOCENTE)
        .options(
            # Aún necesitamos estos para no hacer N+1 queries en la API
            joinedload(RespuestasFormulario.usuario),
            joinedload(RespuestasFormulario.plantilla)
        )
        .order_by(RespuestasFormulario.fecha_completado.desc())
        .all()
    )

def obtener_informe_sintetico_por_id(db: Session, informe_id: int) -> Optional[RespuestasFormulario]:
    """
    Obtiene un único informe sintético por su ID.
    """
    return (
        db.query(RespuestasFormulario)
        .filter(RespuestasFormulario.id == informe_id)
        .options(
            joinedload(RespuestasFormulario.usuario).joinedload(Usuario.rol), 
            joinedload(RespuestasFormulario.plantilla),
            joinedload(RespuestasFormulario.respuestas_individuales).joinedload(Respuesta.pregunta),
            joinedload(RespuestasFormulario.respuestas_individuales).joinedload(Respuesta.opcion)
        )
        .first()
    )