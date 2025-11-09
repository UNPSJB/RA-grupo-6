from datetime import date
from typing import Optional
from pydantic import BaseModel


class PeriodoVinculadoBase(BaseModel):
    id: int
    fecha_desde: date
    fecha_hasta: Optional[date] = None

class PeriodoVinculado(PeriodoVinculadoBase):
    model_config = {"from_attributes": True}
    pass

