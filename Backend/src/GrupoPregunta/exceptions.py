from src.exceptions import NotFound
from src.GrupoPregunta.constants import ErrorMessages

class GrupoPreguntaNoEncontrado(NotFound):
    DETAIL = ErrorMessages.GRUPO_PREGUNTA_NO_ENCONTRADO
