from click import Option
from pydantic import BaseModel
from typing import List, Optional
from src.Opciones.schemas import Opcion
from .models import EnumTipoPregunta 

class PreguntaBase(BaseModel):
    texto: str
    tipo: Optional[EnumTipoPregunta] = None
    opciones: Optional[List[int]] = None
    grupo_pregunta_id: int



class PreguntaAbiertaCreate(PreguntaBase):
    tipo :EnumTipoPregunta = EnumTipoPregunta.abierta


class PreguntaCerradaCreate(PreguntaBase):
    opciones: list[int]  
    tipo : EnumTipoPregunta = EnumTipoPregunta.cerrada


class PreguntaUpdate(PreguntaBase):
    pass


class PreguntaDelete(BaseModel):
    id: int


class Pregunta(PreguntaBase):
    id: int
    opciones: List[Opcion] = []

    model_config = {
        "from_attributes": True 
    } # Habilita la conversión desde ORM a Pydantic




