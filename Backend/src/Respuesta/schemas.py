from pydantic import BaseModel

from src.Opciones.schemas import Opcion
from src.Pregunta.schemas import Pregunta

class RespuestaBase(BaseModel):
    texto: str | None = None  # para respuestas abiertas
    opcion_id: int | None = None  # para respuestas cerradas
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

    model_config = {
        "from_attributes": True
    }