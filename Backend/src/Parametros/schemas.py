from datetime import date
from pydantic import BaseModel

from src.PlantillaFormulario.schemas import PlantillaFormulario

class ParametrosBase(BaseModel):

    inicio_primer_dictado: date
    cierre_primer_dictado: date
    inicio_segundo_dictado: date
    cierre_segundo_dictado: date

    plantilla_estudiante: int
    plantilla_docente: int
    plantilla_departamento: int

    #Dias que estara disponible el formulario
    disponibilidad_estudiante: int
    disponibilidad_docente: int
    disponibilidad_departamento: int

    #Relaciones
    obj_plantilla_estudiante: PlantillaFormulario
    obj_plantilla_docente: PlantillaFormulario
    obj_plantilla_departamento: PlantillaFormulario


class Parametros(ParametrosBase):
    model_config = {"from_attributes": True}
    pass
    