from src.exceptions import NotFound
from src.Informes.constants import ErrorMessages

class InformeNoEncontrado(NotFound):
    DETAIL = ErrorMessages.INFORME_NO_ENCONTRADO