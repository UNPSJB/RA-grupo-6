from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models import ModeloBase

if TYPE_CHECKING:
    from src.Instrumento.exceptions import Instrumento
class Materia(ModeloBase):
    __tablename__ = "materia"
    instrumentos: Mapped[List["Instrumento"]] = relationship(back_populates="materia")
    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)

    respuestas_formulario: Mapped[Optional[List["src.RespuestasFormulario.models.RespuestasFormulario"]]] = relationship(back_populates='materia')
