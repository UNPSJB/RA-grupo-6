from src.exceptions import NotFound
from src.PlantillaFormulario.constants import ErrorMessages

class FormularioNoEncontrado(NotFound):
    DETAIL = ErrorMessages.Formulario_NO_ENCONTRADO