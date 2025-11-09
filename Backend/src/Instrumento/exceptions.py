from src.exceptions import NotFound
from src.Instrumento.constants import ErrorMessages

class Instrumento_Sin_Respuestas(NotFound):
    DETAIL = ErrorMessages.INSTRUMENTO_SIN_RESPUESTAS

class Instrumento_Sin_Asignar(NotFound):
    DETAIL = ErrorMessages.INSTRUMENTO_SIN_ASIGNACIONES
