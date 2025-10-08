from typing import List
from datetime import date
from pydantic import BaseModel

from src.Respuesta.schemas import Respuesta

class RespuestasFormularioBase(BaseModel):
    materia_id: str
    usuario_id: int
    fecha_envio: date
    respuestas: List[Respuesta]


class RespuestasFormulario(RespuestasFormularioBase):

    model_config = {
        "from_attributes": True
    }