from pydantic import BaseModel

class MateriaBase(BaseModel):
    id: str
    nombre: str

class Materia(MateriaBase):
    class Config:
        orm_mode = True