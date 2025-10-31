from pydantic import BaseModel

from src.UsuarioDepartamento.schemas import UsuarioDepartamentoRead

class DepartamentoBase(BaseModel):
    id: int
    nombre: str
    usuarios_info: UsuarioDepartamentoRead

class Departamento(DepartamentoBase):
    model_config = {"from_attributes": True}
    pass