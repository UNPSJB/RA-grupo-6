from click import Option
from pydantic import BaseModel
from typing import List, Optional
from src.Opciones.schemas import Opcion


class PreguntaBase(BaseModel):
    texto: str
    tipo: Optional[str] = None  # abierta, cerrada
    opciones: Optional[List[int]] = None


class PreguntaAbiertaCreate(PreguntaBase):
    tipo : str = "Abierta"


class PreguntaCerradaCreate(PreguntaBase):
    opciones: list[int]  
    tipo :str = "Cerrada"
    grupo_pregunta_id: int


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




