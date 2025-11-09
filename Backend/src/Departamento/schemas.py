from typing import List, Optional, TYPE_CHECKING
from pydantic import BaseModel

from src.UsuarioDepartamento.schemas import UsuarioDepartamentoRead

if TYPE_CHECKING:
    from src.Carrera.schemas import Carrera

class DepartamentoBase(BaseModel):
    id: int
    nombre: str

class Departamento(DepartamentoBase):
    usuarios_info: Optional[List[UsuarioDepartamentoRead]] = []
    carreras: List["Carrera"] = []
    model_config = {
        "from_attributes": True,
        "json_schema_mode_override": "serialization"
    }

class DepartamentoSimple(BaseModel):
    id: int
    nombre: str


# Importación pospuesta para evitar circularidad  
from src.Carrera.schemas import Carrera
Departamento.model_rebuild()