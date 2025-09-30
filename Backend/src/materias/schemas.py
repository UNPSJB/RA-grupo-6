from pydantic import BaseModel, field_validator
from src.materias import exceptions

# Los siguientes schemas contienen atributos sin muchas restricciones de tipo.
# Podemos crear atributos con ciertas reglas mediante el uso de un "Field" adecuado.
# https://docs.pydantic.dev/latest/concepts/fields/


class MateriaBase(BaseModel):
    id: str
    nombre: str


class Materia(MateriaBase):
    model_config = {"from_attributes": True}
    pass
