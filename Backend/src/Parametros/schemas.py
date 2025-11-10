from datetime import date
from pydantic import BaseModel

class ParametrosBase(BaseModel):

    inicio_primer_dictado: date
    cierre_primer_dictado: date
    inicio_segundo_dictado: date
    cierre_segundo_dictado: date

    plantilla_estudiante_id: int
    plantilla_docente_id: int
    plantilla_departamento_id: int

    #Dias que estara disponible el formulario
    disponibilidad_estudiante: int
    disponibilidad_docente: int
    disponibilidad_departamento: int


class Parametros(ParametrosBase):
    model_config = {"from_attributes": True}
    pass
    