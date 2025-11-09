from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import date

class DetalleEnvio(BaseModel):
    estudiante: str
    email: str
    materia: str
    fecha_cierre: str
    dias_restantes: int
    estado: str

class ResultadoEnvio(BaseModel):
    enviados: int
    fallidos: int
    total_estudiantes: int
    detalles: List[DetalleEnvio]

class InstrumentoProximo(BaseModel):
    id: int
    materia_nombre: str
    fecha_cierre: date
    dias_para_vencer: int
    estudiantes_pendientes: int

class EstudiantePendiente(BaseModel):
    id: int
    nombre: str
    apellido: str
    email: str
    legajo: int