from pydantic import BaseModel
from datetime import date
from typing import List

#para lista de informes
class InformeListSchema(BaseModel):
    id: int 
    titulo_informe: str
    docente_nombre: str
    fecha_completado: date

    class Config:
        orm_mode = True

#para una respuesta individual (pregunta y respuesta)
class RespuestaDetalleSchema(BaseModel):
    pregunta: str
    respuesta: str

    class Config:
        orm_mode = True

#para ver el contenido completo de un informe
class InformeDetailSchema(InformeListSchema):
    respuestas: List[RespuestaDetalleSchema]

    class Config:
        orm_mode = True
