
from datetime import date
from typing import TYPE_CHECKING, List
from pydantic import BaseModel


if TYPE_CHECKING:
    from src.Materias.schemas import Materia

class DictadoBase(BaseModel):
    fecha_inicio: date
    fecha_cierre: date
    materias: List["Materia"] | None = None

class DictadoCreate(DictadoBase):
    pass


class Dictado(DictadoBase):
    id: int
    
    model_config = {"from_attributes": True}
    pass

class MateriaDictado(BaseModel):
    materia: "Materia"
    dictado: "Dictado"

from src.Materias.schemas import Materia
Dictado.model_rebuild()
MateriaDictado.model_rebuild()

