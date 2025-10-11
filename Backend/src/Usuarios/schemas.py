from pydantic import BaseModel, field_validator

from src.Roles.schemas import Rol


class UsuarioBase(BaseModel):
    nombre: str
    apellido: str
    email: str
    rol: Rol
    legajo: int

class Usuario(UsuarioBase):
    model_config = {"from_attributes": True}



