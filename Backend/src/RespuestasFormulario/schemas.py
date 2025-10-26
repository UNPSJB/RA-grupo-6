from __future__ import annotations  

from typing import List
from datetime import date
from pydantic import BaseModel, ConfigDict

from src.Materias.schemas import Materia
from src.Usuarios.schemas import Usuario
from src.Respuesta.schemas import Respuesta

class RespuestasFormularioBase(BaseModel):
    materia_id: str
    usuario_id: int
    instrumento_id: int
    fecha_envio: date

class RespuestasFormularioCreate(RespuestasFormularioBase):
    pass


class RespuestasFormulario(RespuestasFormularioBase):
    id: int
    materia: Materia
    usuario: 'UsuarioBase'
    respuestas: List['Respuesta'] = []  

    model_config = ConfigDict(from_attributes=True)



from src.Respuesta.schemas import Respuesta
from src.Usuarios.schemas import UsuarioBase
RespuestasFormulario.model_rebuild()
