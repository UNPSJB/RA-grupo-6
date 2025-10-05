from src.exceptions import NotFound
from src.Encuesta.constants import ErrorMessages

class InformeNoEncontrado(NotFound):
    DETAIL = ErrorMessages.INFORME_NO_ENCONTRADO