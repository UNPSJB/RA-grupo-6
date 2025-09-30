from pydantic import BaseModel, field_validator


class UsuarioBase(BaseModel):
    nombre: str
    apellido: str
    email: str
    rol_id: int
    legajo: int

class Usuario(UsuarioBase):
    model_config = {"from_attributes": True}



