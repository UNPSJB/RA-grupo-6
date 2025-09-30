from typing import List
from src.exceptions import NotFound, BadRequest
from src.Pregunta.constants import ErrorMessages
from src.Opciones.constants import ErrorMessage

class OpcionNoEncontrada(NotFound):
    DETAIL = ErrorMessages.OPCION_NO_ENCONTRADA 

class OpcionNoEliminable(NotFound):
    DETAIL = ErrorMessage.OPCION_NO_ELIMINABLE