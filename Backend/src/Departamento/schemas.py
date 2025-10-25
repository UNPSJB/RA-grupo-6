from pydantic import BaseModel

class DepartamentoBase(BaseModel):
    id: int
    nombre: str

class Departamento(DepartamentoBase):
    model_config = {"from_attributes": True}
    pass