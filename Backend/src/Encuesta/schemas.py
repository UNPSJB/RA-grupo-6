# En tu archivo de schemas (ej: src/Informes/schemas.py)

from pydantic import BaseModel
from datetime import date
from typing import List, Optional

# Este schema lo podemos reutilizar de la vez anterior
class RespuestaDetalleSchema(BaseModel):
    pregunta_texto: str
    respuesta_texto: Optional[str] = None
    opcion_seleccionada: Optional[str] = None

    class Config:
        orm_mode = True

# Schema para la lista de informes sintéticos
class InformeSinteticoListSchema(BaseModel):
    id: int
    titulo_formulario: str
    autor_nombre: str # Lo hacemos más genérico que "docente_nombre"
    fecha_completado: date

    class Config:
        orm_mode = True

# Schema para ver el detalle completo de un informe sintético
class InformeSinteticoDetailSchema(InformeSinteticoListSchema):
    respuestas: List[RespuestaDetalleSchema]

    class Config:
        orm_mode = True