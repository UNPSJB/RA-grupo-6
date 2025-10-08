from typing import TYPE_CHECKING, List
from sqlalchemy import Date, Integer, ForeignKey 
from sqlalchemy.orm import relationship, Mapped, mapped_column

from src.models import ModeloBase
from datetime import date

if TYPE_CHECKING:
    from src.Instrumento.exceptions import Instrumento

class RespuestasFormulario(ModeloBase):
    __tablename__ = "respuestas_formulario"

    id: Mapped[int] = mapped_column(Integer, primary_key = True, index=True)
    fecha_envio: Mapped[date] = mapped_column(Date)

    materia_id: Mapped[int] = mapped_column(ForeignKey("materia.id"), nullable=False) # TODO YA NO ES NECESARIA , BORRAR
    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"), nullable=False)

    respuestas: Mapped[List["src.Respuesta.models.Respuesta"]] = relationship(back_populates="formulario")
    
    instrumento_id: Mapped[int] = mapped_column(ForeignKey("instrumento.id"), nullable=False)
    instrumento: Mapped["Instrumento"] = relationship(back_populates="respuestas_formulario")

