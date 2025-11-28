from pydantic import BaseModel
from typing import List, Optional
from src.Pregunta.schemas import Pregunta
from src.Roles.schemas import Rol
from .models import CicloMateria
class PlantillaFormularioBase(BaseModel):
    titulo: str
    rol: int

class FormularioCreate(PlantillaFormularioBase):
    preguntas: Optional[List[int]] = []
    ciclo: Optional[CicloMateria]

class PlantillaFormularioUpdate(PlantillaFormularioBase):
    preguntas: Optional[List[int]] = []

class PlantillaFormularioDelete(BaseModel):
    id: int

class PlantillaFormulario(PlantillaFormularioBase):
    id: int
    rol: "Rol"
    preguntas: List[Pregunta] = []

    model_config = {
        "from_attributes": True 
    }    