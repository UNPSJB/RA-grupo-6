from typing import List
from pydantic import BaseModel, ConfigDict

# ====================
#      ESQUEMAS OPCIÓN
# ====================
class OpcionBase(BaseModel):
    texto: str

class OpcionCreate(OpcionBase):
    pass

class OpcionUpdate(OpcionBase):
    pass

class Opcion(OpcionBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)

class OpcionDelete(Opcion):
    pass

# ====================
#    ESQUEMAS PREGUNTA
# ====================
class PreguntaBase(BaseModel):
    texto: str

class PreguntaAbiertaCreate(PreguntaBase):
    """Esquema para crear una pregunta de tipo 'abierta'. Solo necesita el texto."""
    pass

class PreguntaCerradaCreate(PreguntaBase):
    """Esquema para crear una pregunta de tipo 'cerrada'. Requiere una lista de IDs de opciones."""
    opciones: List[int]

class PreguntaUpdate(PreguntaBase):
    """Esquema para actualizar el texto de una pregunta existente."""
    pass

class Pregunta(PreguntaBase):
    """Esquema para mostrar una pregunta, incluyendo sus opciones si las tiene."""
    id: int
    tipo: str
    opciones: List[Opcion] = [] # La lista estará vacía para preguntas abiertas
    
    model_config = ConfigDict(from_attributes=True)

class PreguntaDelete(Pregunta):
    pass


