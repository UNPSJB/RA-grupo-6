from typing import Optional
from pydantic import BaseModel

from src.Opciones.schemas import Opcion
from src.Pregunta.schemas import Pregunta

class RespuestaBase(BaseModel):
    texto: str | None = None  
    opcion_id: int | None = None  
    pregunta_id: int
    formulario_id: int

class RespuestaCreate(RespuestaBase):
    pass

class RespuestaUpdate(RespuestaBase):
    pass

class RespuestaDelete(BaseModel):
    id: int

class Respuesta(RespuestaBase):
    id: int
    pregunta: Pregunta
    opcion: Optional[Opcion] = None 

    model_config = {
        "from_attributes": True
    }