
from src.exceptions import NotFound
from src.Roles.constants import ErrorCode

class RolNoEncontrado(NotFound):
    DETAIL = ErrorCode.ROL_NO_ENCONTRADO