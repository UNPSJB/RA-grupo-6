from src.Materias.constants import ErrorCode
from typing import List
from src.exceptions import NotFound, BadRequest
from src.Materias.constants import ErrorCode

#Definir las excepciones. 
class MateriaSinDocente(NotFound):
    DETAIL = ErrorCode.Materia_Sin_Docente