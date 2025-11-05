from datetime import date
from pydantic import BaseModel


class PeriodoVinculadoBase(BaseModel):
    id: int
    fecha_desde: date
    fecha_hasta: date

class PeriodoVinculado(PeriodoVinculadoBase):
    model_config = {"from_attributes": True}
    pass

