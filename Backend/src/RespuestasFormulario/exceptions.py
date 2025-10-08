from src.exceptions import NotFound
from src.RespuestasFormulario.constants import ErrorCode

class RespuestasNoEncontradas(NotFound):
    DETAIL = ErrorCode.RESPUESTAS_NO_ENCONTRADAS 

