from click import Option
from pydantic import BaseModel
from typing import List, Optional
from src.Opciones.schemas import Opcion
from src.GrupoPregunta.schemas import GrupoPregunta
from .models import EnumTipoPregunta 

class PreguntaBase(BaseModel):
    texto: str
    tipo: Optional[str] = None 
    opciones: Optional[List[int]] = None
    grupo_pregunta_id: int
    estadistica: bool
    rol_id: int     

class PreguntaAbiertaCreate(PreguntaBase):
    tipo :EnumTipoPregunta = EnumTipoPregunta.abierta


class PreguntaCerradaCreate(PreguntaBase):
    opciones: list[int]  
    tipo : EnumTipoPregunta = EnumTipoPregunta.cerrada

class PreguntaUpdate(BaseModel):
    texto: str
    opciones: Optional[List[int]] = None
    grupo_pregunta_id: int
    # grupo_pregunta: GrupoPregunta


class PreguntaDelete(BaseModel):
    id: int


class Pregunta(PreguntaBase):
    id: int
    opciones: List[Opcion] = []
    puede_eliminarse: bool = True
    puede_modificarse: bool = True
    grupo_pregunta: GrupoPregunta

    model_config = {
        "from_attributes": True, 
        "use_enum_values": True
    } # Habilita la conversión desde ORM a Pydantic




