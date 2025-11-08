from datetime import date
from pydantic import BaseModel
from src.PlantillaFormulario.schemas import PlantillaFormulario


class PlanificacionBase(BaseModel):
    fecha_inicio: date
    fecha_cierre: date
    plantilla_formulario_id: int
    plantilla_formulario: PlantillaFormulario


class Planificacion(PlanificacionBase):
    model_config = {"from_attributes": True}
    pass
    