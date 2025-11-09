from typing import List
from src.exceptions import NotFound, BadRequest
from src.Respuesta.constants import ErrorMessages

class RespuestaNoEncontrada(NotFound):
    DETAIL = ErrorMessages.RESPUESTA_NO_ENCONTRADA

class RespuestaInvalida(NotFound):
    DETAIL = ErrorMessages.RESPUESTA_INVALIDA

class PreguntaNoEncontrada(NotFound):
    DETAIL = ErrorMessages.PREGUNTA_NO_ENCONTRADA