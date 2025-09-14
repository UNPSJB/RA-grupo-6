from pydantic import BaseModel

class PreguntaBase(BaseModel):
    texto: str
    tipo: str  # abierta, cerrada

class PreguntaAbiertaCreate(PreguntaBase):
    tipo : str = "abierta"

class PreguntaCerradaCreate(PreguntaBase):
    tipo : str = "cerrada"
    opciones: list[int]  

    

class PreguntaUpdate(PreguntaBase):
    pass

class PreguntaDelete(BaseModel):
    id: int

class Pregunta(PreguntaBase):
    id: int

    model_config = {
        "from_attributes": True 
    } # Habilita la conversión desde ORM a Pydantic

class OpcionBase(BaseModel):
    texto: str

class OpcionCreate(OpcionBase):
    pass

class OpcionUpdate(OpcionBase):
    pass

class OpcionDelete(BaseModel):
    id: int

class Opcion(OpcionBase):
    id: int

    model_config = {
        "from_attributes": True
    } 



