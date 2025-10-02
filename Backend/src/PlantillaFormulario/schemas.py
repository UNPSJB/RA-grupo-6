from pydantic import BaseModel
from typing import List, Optional
from src.Pregunta.schemas import Pregunta
from src.Roles.schemas import Rol

class PlantillaFormularioBase(BaseModel):
    titulo: str
    rol: int

class FormularioCreate(PlantillaFormularioBase):
    preguntas: Optional[List[int]] = []
    

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