from typing import Optional
from pydantic import BaseModel

class GrupoCuadroBase(BaseModel):
    nombre: str
    descripcion: Optional[str] | None = None
    orden: int

class GrupoCuadroCreate(GrupoCuadroBase):
    pass

class GrupoCuadroUpdate(GrupoCuadroBase):
    pass

class GrupoCuadroDelete(BaseModel):
    id: int

class GrupoCuadro(GrupoCuadroBase):
    id: int

    model_config = {
        "from_attributes": True
    } 