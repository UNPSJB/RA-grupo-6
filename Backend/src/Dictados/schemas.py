
from datetime import date
from typing import List
from pydantic import BaseModel
from src.Materias.schemas import Materia

class DictadoBase(BaseModel):
    fecha_inicio: date
    fecha_cierre: date
    materias: List[Materia] = None

class DictadoCreate(DictadoBase):
    pass

class Dictado(DictadoBase):
    id: int
    
    model_config = {"from_attributes": True}
    pass