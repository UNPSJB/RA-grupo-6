from typing import List, TYPE_CHECKING
from pydantic import BaseModel
from src.Carrera.schemas import Carrera
from src.PeriodoVinculado.schemas import PeriodoVinculado
from src.Departamento.schemas import Departamento
from .models import EnumTipoCiclo

# Los siguientes schemas contienen atributos sin muchas restricciones de tipo.
# Podemos crear atributos con ciertas reglas mediante el uso de un "Field" adecuado.
# https://docs.pydantic.dev/latest/concepts/fields/



class MateriaBase(BaseModel):
    id: str
    nombre: str
    periodos_vinculados: List[PeriodoVinculado]
    departamento: Departamento
    carrera: Carrera
    ciclo: EnumTipoCiclo

class Materia(MateriaBase):
    model_config = {"from_attributes": True,
                    "recursive_guard": True,}
    pass

Materia.model_rebuild()

