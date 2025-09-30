from pydantic import BaseModel, field_validator

class RolBase(BaseModel):
    nombre: str

class Rol(RolBase):
    model_config = {"from_attributes": True}