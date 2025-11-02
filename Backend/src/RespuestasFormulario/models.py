from typing import TYPE_CHECKING, List
from sqlalchemy import Date, Integer, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from datetime import date
from src.models import ModeloBase

if TYPE_CHECKING:
    from src.Instrumento.models import Instrumento
    from src.Usuarios.models import Usuario
    from src.Respuesta.models import Respuesta
    from src.Materias.models import Materia

class RespuestasFormulario(ModeloBase):
    __tablename__ = "respuestas_formulario"

    #Atributos
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    fecha_envio: Mapped[date] = mapped_column(Date, nullable=True)

    #Foraneas
    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"), nullable=False)
    instrumento_id: Mapped[int] = mapped_column(ForeignKey("instrumento.id"), nullable=False)

    #Relaciones
    respuestas: Mapped[List["Respuesta"]] = relationship(back_populates="formulario")
    usuario: Mapped["Usuario"] = relationship(back_populates="respuestas_formulario")
    instrumento: Mapped["Instrumento"] = relationship(back_populates="respuestas_formulario")

    # TODO: Recordar borrar esta columna y hacer la migración en la base de datos
    # materia_id: Mapped[str] = mapped_column(ForeignKey("materia.id"), nullable=False)
    # materia: Mapped["Materia"] = relationship(back_populates="respuestas_formulario")
    