
from src.exceptions import NotFound
from src.Usuarios.constants import ErrorCode

class Usuario_No_Encontrado(NotFound):
    DETAIL = ErrorCode.USUARIO_NO_ENCONTRADO