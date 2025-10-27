from datetime import date
from pydantic import BaseModel, field_validator
from src.Usuarios.schemas import Usuario
from src.Materias.schemas import Materia
from src.PeriodoVinculado import exceptions

class PeriodoVinculadoBase(BaseModel):
    id: int
    fecha_desde: date
    fecha_hasta: date
    usuario: Usuario
    materia: Materia
    

class PeriodoVinculado(PeriodoVinculadoBase):
    model_config = {"from_attributes": True}
    pass
