from typing import TYPE_CHECKING, Optional
from pydantic import BaseModel

if TYPE_CHECKING:
    from src.Departamento.schemas import Departamento

class CarreraBase(BaseModel):
    id: int
    nombre: str


class Carrera(CarreraBase):
    departamento_id: int
    departamento: Optional["Departamento"] = None
    model_config = {
        "from_attributes": True,
        "json_schema_mode_override": "serialization"
    }

class CarreraSimple(BaseModel):
    id: int
    nombre: str
    departamento_id: int

    class Config:
        from_attributes = True

# Importación pospuesta para evitar circularidad
from src.Departamento.schemas import Departamento
Carrera.model_rebuild()