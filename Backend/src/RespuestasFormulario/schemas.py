from __future__ import annotations  

from typing import TYPE_CHECKING, List
from datetime import date
from pydantic import BaseModel, ConfigDict
from src.Respuesta.schemas import Respuesta

if TYPE_CHECKING:
    from src.Usuarios.schemas import UsuarioBase

class RespuestasFormularioBase(BaseModel):
    # materia_id: str
    usuario_id: int
    instrumento_id: int
    fecha_envio: date

class RespuestasFormularioCreate(RespuestasFormularioBase):
    pass


class RespuestasFormulario(RespuestasFormularioBase):
    id: int
    # materia: Materia
    respuestas: List['Respuesta'] = []  
    usuario: 'UsuarioBase'
    model_config = ConfigDict(from_attributes=True)



from src.Respuesta.schemas import Respuesta
from src.Usuarios.schemas import UsuarioBase
RespuestasFormulario.model_rebuild()
