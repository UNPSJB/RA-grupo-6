from __future__ import annotations
from pydantic import BaseModel
from datetime import date
from typing import TYPE_CHECKING, List, Optional

from src.Dictados.schemas import Dictado
from src.Departamento.schemas import Departamento
from src.RespuestasFormulario.schemas import RespuestasFormulario
from src.PlantillaFormulario.schemas import PlantillaFormulario
from src.Materias.schemas import Materia

from .models import TipoInstrumento 

if TYPE_CHECKING:
    from src.RespuestasFormulario.schemas import RespuestasFormulario


class InstrumentoBase(BaseModel):
    fecha_inicio: date
    fecha_cierre: date
    tipo: TipoInstrumento
    plantilla_formulario_id: int
    materia_id: str
    materia: Materia
    plantilla_formulario: PlantillaFormulario
    respuestas_formulario: List[RespuestasFormulario]

class InstrumentoCreate(InstrumentoBase):
    pass 

class InstrumentoUpdate(BaseModel):
    fecha_inicio: Optional[date] = None
    fecha_cierre: Optional[date] = None
    tipo: Optional[TipoInstrumento] = None
    plantilla_formulario_id: Optional[int] = None
    materia_id: Optional[str] = None

class Instrumento(InstrumentoBase):
    id: int
    
    materia: Materia
    plantilla_formulario: PlantillaFormulario
    
    class Config:
        from_attributes = True

class InstrumentoParaListado(BaseModel):
    id: int
    fecha_inicio: date
    fecha_cierre: date
    tipo: TipoInstrumento
    
    materia: Materia
    plantilla_formulario: PlantillaFormulario

    class Config:
        from_attributes = True


class RespuestaDetalle(BaseModel):
    pregunta_texto: str
    respuesta_texto: Optional[str] = None
    opcion_seleccionada: Optional[str] = None

class InstrumentoDetalle(BaseModel):
    id: int
    titulo_formulario: str
    # autor_nombre: str
    fecha_completado: Optional[date]
    plantilla_formulario_id: int
    respuestas: List[RespuestaDetalle]
    respuestas_formulario: List[RespuestasFormulario] 
    plantilla_formulario: PlantillaFormulario
    materia: Materia 
    departamento: Departamento
    tipo: TipoInstrumento
    dictado: Dictado

# cómo se ve cada opción con su conteo?
class EstadisticaOpcion(BaseModel):
    texto_opcion: str
    cantidad: int

# estadísticas para una pregunta completa
class EstadisticaPregunta(BaseModel):
    pregunta_id: int
    pregunta_texto: str
    opciones: List[EstadisticaOpcion]


class TasaRespuesta(BaseModel):
    no_respondieron: int
    respondidos: int

InstrumentoBase.model_rebuild()
InstrumentoDetalle.model_rebuild()