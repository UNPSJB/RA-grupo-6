from pydantic import BaseModel
from typing import Optional
class PreguntaBase(BaseModel):
    texto: str
    tipo: Optional[str] = None  # abierta, cerrada

class PreguntaAbiertaCreate(PreguntaBase):
    tipo : str = "abierta"

class PreguntaCerradaCreate(PreguntaBase):
    opciones: list[int]  
    tipo :str = "cerrada"

    

class PreguntaUpdate(PreguntaBase):
    pass

class PreguntaDelete(BaseModel):
    id: int

class Pregunta(PreguntaBase):
    id: int

    model_config = {
        "from_attributes": True 
    } # Habilita la conversión desde ORM a Pydantic




