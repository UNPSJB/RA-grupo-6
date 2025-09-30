from __future__ import annotations
from typing import TYPE_CHECKING
from sqlalchemy import Integer, String, Date, ForeignKey, Column, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from datetime import date
from src.Pregunta.models import Pregunta

if TYPE_CHECKING:
    from src.Pregunta.models import Pregunta

formulario_pregunta = Table(
    "formulario_pregunta",
    ModeloBase.metadata,
    Column("formulario_id", Integer, ForeignKey("formularios.id"), primary_key=True),
    Column("pregunta_id", Integer, ForeignKey("preguntas.id"), primary_key=True)
)

class Formulario(ModeloBase):
    __tablename__ = "formularios"
    id: Mapped[int] = mapped_column(Integer, primary_key= True, index=True)
    titulo: Mapped[str] = mapped_column(String(50), nullable= False)
    fecha_creacion: Mapped[date] = mapped_column(Date, default=date.today, nullable= False)
    preguntas: Mapped[list["Pregunta"]] = relationship(
        "Pregunta",
        secondary= formulario_pregunta,
        back_populates="formularios"
    )