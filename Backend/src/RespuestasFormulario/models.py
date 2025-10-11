from typing import List
from sqlalchemy import Date, Integer, ForeignKey 
from sqlalchemy.orm import relationship, Mapped, mapped_column
from src.models import ModeloBase
from datetime import date 


class RespuestasFormulario(ModeloBase):
    __tablename__ = "respuestas_formulario"

    id: Mapped[int] = mapped_column(Integer, primary_key = True, index=True)
    fecha_envio: Mapped[date] = mapped_column(Date)

    materia_id: Mapped[str] = mapped_column(ForeignKey("materia.id"), nullable=False)
    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"), nullable=False)

    respuestas: Mapped[List["src.Respuesta.models.Respuesta"]] = relationship(back_populates="formulario")
    materia: Mapped["src.materias.models.Materia"] = relationship(back_populates="respuestas_formulario")
    usuario: Mapped["src.Usuarios.models.Usuario"] = relationship(back_populates="respuestas_formulario")
