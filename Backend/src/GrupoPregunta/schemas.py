from pydantic import BaseModel

class GrupoPreguntaBase(BaseModel):
    letra: str
    titulo: str

class GrupoPregunta(GrupoPreguntaBase):
    model_config = {"from_attributes": True}
    pass