from pydantic import BaseModel

class CarreraBase(BaseModel):
    id: int
    nombre: str

class Carrera(CarreraBase):
    model_config = {"from_attributes": True}
    pass