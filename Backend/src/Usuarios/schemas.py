from typing import TYPE_CHECKING, List, Optional
from pydantic import BaseModel, field_validator, ConfigDict

from src.Roles.schemas import Rol
from src.PeriodoVinculado.schemas import PeriodoVinculado


class UsuarioBase(BaseModel):
    id: int
    username: str
    nombre: str
    apellido: str
    email: str
    rol: Rol
    legajo: int
    periodo_vinculado: Optional[PeriodoVinculado] = None
    model_config = ConfigDict(from_attributes =  True)


class UsuarioSchema(UsuarioBase):
    respuestas_formulario: List['RespuestasFormulario'] = None
    model_config = ConfigDict(from_attributes =  True)

from src.RespuestasFormulario.schemas import RespuestasFormulario
UsuarioSchema.model_rebuild()


class AuthUsuarioSchema(BaseModel):
    username: str
    hashed_password: str
    disabled: Optional[bool] = None
    is_active: bool
    model_config = ConfigDict(from_attributes =  True)
    

class UserCreateSchema(BaseModel):
    username: str
    email: str
    nombre: str
    apellido: str
    legajo: int
    password: str
    

