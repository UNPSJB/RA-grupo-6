# En tu archivo de servicios (ej: src/Informes/services.py)

from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from src.Respuesta.models import Respuesta
from src.Roles.models import Rol
from src.Usuarios.models import Usuario
from src.RespuestasFormulario.models import RespuestasFormulario
from src import models

# El nombre del rol que nos interesa ahora
ROL_DEPARTAMENTO = "DEPARTAMENTO" # Asegúrate que este sea el nombre exacto en tu DB

def listar_informes_sinteticos(db: Session) -> List[RespuestasFormulario]:
    """
    Obtiene de la DB todos los formularios completados por usuarios
    con el rol de 'DEPARTAMENTO'.
    """
    return (
        db.query(RespuestasFormulario)
        .join(Usuario)
        .join(Rol)
        .filter(Rol.nombre == ROL_DEPARTAMENTO) # <--- ÚNICO CAMBIO EN LA LÓGICA
        .options(
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
    # Esta función puede ser la misma que la anterior, ya que solo busca por ID.
    # Pero es buena práctica tener una separada por si la lógica cambia en el futuro.
    return (
        db.query(RespuestasFormulario)
        .filter(RespuestasFormulario.id == informe_id)
        .options(
            joinedload(RespuestasFormulario.usuario).joinedload(models.Usuario.rol), # Validamos el rol
            joinedload(RespuestasFormulario.plantilla),
            joinedload(RespuestasFormulario.respuestas_individuales).joinedload(Respuesta.pregunta),
            joinedload(RespuestasFormulario.respuestas_individuales).joinedload(Respuesta.opcion)
        )
        .first()
    )