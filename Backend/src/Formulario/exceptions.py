from src.exceptions import NotFound
from src.Formulario.constants import ErrorMessages

class FormularioNoEncontrado(NotFound):
    DETAIL = ErrorMessages.Formulario_NO_ENCONTRADO