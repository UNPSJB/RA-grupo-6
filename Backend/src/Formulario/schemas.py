from pydantic import BaseModel
from typing import List, Optional
from src.Pregunta.schemas import Pregunta

class FormularioBase(BaseModel):
    titulo: str

class FormularioCreate(FormularioBase):
    preguntas: Optional[List[int]] = []

class FormularioUpdate(FormularioBase):
    preguntas: Optional[List[int]] = []

class FormularioDelete(BaseModel):
    id: int

class Formulario(FormularioBase):
    id: int
    preguntas: List[Pregunta] = []

    model_config = {
        "from_attributes": True 
    }    