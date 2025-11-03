from typing import TYPE_CHECKING, List, Optional
from pydantic import BaseModel, field_validator, ConfigDict

from src.Roles.schemas import Rol
from src.PeriodoVinculado.schemas import PeriodoVinculado

if TYPE_CHECKING:
    from src.RespuestasFormulario.schemas import RespuestasFormulario

class UsuarioBase(BaseModel):
    id: int
    nombre: str
    apellido: str
    email: str
    rol: Rol
    legajo: int
    periodo_vinculado: Optional[PeriodoVinculado] = None
    model_config = ConfigDict(from_attributes =  True)


class Usuario(UsuarioBase):
    respuestas_formulario: List['RespuestasFormulario'] = None
    model_config = ConfigDict(from_attributes =  True)

from src.RespuestasFormulario.schemas import RespuestasFormulario

Usuario.model_rebuild()


