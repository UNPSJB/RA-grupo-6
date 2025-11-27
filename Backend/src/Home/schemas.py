from pydantic import BaseModel
from typing import Optional

class Home(BaseModel):
    nombre_completo: str
    rol: str

    materias_inscriptas: Optional[int] = None
    encuestas_pendientes: Optional[int] = None
    encuestas_completadas: Optional[int] = None

    materias_dictadas: Optional[int] = None
    informes_pendientes: Optional[int] = None
    informes_completados: Optional[int] = None

    materias_departamento: Optional[int] = None
    docentes_departamento: Optional[int] = None
    informes_sinteticos: Optional[int] = None

    total_estudiantes: Optional[int] = None
    total_docentes: Optional[int] = None
    total_carreras: Optional[int] = None