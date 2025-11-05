from src.exceptions import NotFound
from src.Dictados.constants import ErrorCode

class DictadoNoEncontrado(NotFound):
    DETAIL = ErrorCode.DICTADO_NO_ENCONTRADO

class PrimerDictadoAnualExiste(NotFound):
    DETAIL = ErrorCode.PRIMER_DICTADO_EXISTE

class SegundoDictadoAnualExiste(NotFound):
    DETAIL = ErrorCode.SEGUNDO_DICTADO_EXISTE
    
class FechasInvalidas(NotFound):
    DETAIL = ErrorCode.FECHAS_INVALIDAS

class DictadoPasado(NotFound):
    DETAIL = ErrorCode.DICTADO_PASADO

class DictadoEnPeriodoInvalido(NotFound):
    DETAIL = ErrorCode.PERIODO_INVALIDO    