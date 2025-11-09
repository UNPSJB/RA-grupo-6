from click import Option
from pydantic import BaseModel, Field
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
    multiple_respuestas: bool
    grupo_cuadro_id: Optional[int] = Field(default=None)
    orden_en_grupo: Optional[int] = Field(default=None)
    pregunta_fuente_id: Optional[int] = Field(default=None)

class PreguntaAbiertaCreate(PreguntaBase):
    tipo :EnumTipoPregunta = EnumTipoPregunta.abierta


class PreguntaCerradaCreate(PreguntaBase):
    opciones: list[int]  
    tipo : EnumTipoPregunta = EnumTipoPregunta.cerrada

class PreguntaUpdate(BaseModel):
    texto: str
    opciones: Optional[List[int]] = None
    grupo_pregunta_id: int
    grupo_cuadro_id: Optional[int] = Field(default=None)
    orden_en_grupo: Optional[int] = Field(default=None)
    multiple_respuestas: Optional[bool] = None


class PreguntaDelete(BaseModel):
    id: int


class Pregunta(PreguntaBase):
    id: int
    opciones: List[Opcion] = []
    puede_eliminarse: bool = True
    puede_modificarse: bool = True
    grupo_pregunta: GrupoPregunta
    grupo_cuadro_id: Optional[int] = None
    orden_en_grupo: Optional[int] = None
    pregunta_fuente: Optional["Pregunta"] = None

    model_config = {
        "from_attributes": True, 
        "use_enum_values": True
    } # Habilita la conversión desde ORM a Pydantic




