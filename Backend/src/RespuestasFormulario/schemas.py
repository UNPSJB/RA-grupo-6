from typing import List
from datetime import date
from pydantic import BaseModel


class RespuestasFormularioBase(BaseModel):
    materia_id: int
    usuario_id: int
    fecha_envio: date
    respuestas: List[int]



class RespuestasFormulario(RespuestasFormularioBase):

    model_config = {
        "from_attributes": True
    }