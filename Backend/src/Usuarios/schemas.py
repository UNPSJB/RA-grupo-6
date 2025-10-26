from typing import TYPE_CHECKING, List
from pydantic import BaseModel, field_validator, ConfigDict

from src.Roles.schemas import Rol

if TYPE_CHECKING:
    from src.RespuestasFormulario.schemas import RespuestasFormulario

class UsuarioBase(BaseModel):
    id: int
    nombre: str
    apellido: str
    email: str
    rol: Rol
    legajo: int
    model_config = ConfigDict(from_attributes =  True)


class Usuario(UsuarioBase):
    respuestas_formulario: List['RespuestasFormulario']
    model_config = ConfigDict(from_attributes =  True)

from src.RespuestasFormulario.schemas import RespuestasFormulario
Usuario.model_rebuild()


