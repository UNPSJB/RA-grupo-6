from typing import TYPE_CHECKING, List, Optional
from pydantic import BaseModel, field_validator, ConfigDict

from src.Roles.schemas import Rol


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


class User(BaseModel):
    username: str
    email: Optional[str] = None
    nombre: Optional[str] = None
    
    disabled: Optional[bool] = None

class UserInDB(User):
    hashed_password: str

class UserCreate(BaseModel):
    username: str
    email: str
    nombre: str
    apellido: str
    legajo: str
    password: str


