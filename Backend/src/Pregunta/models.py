from __future__ import annotations 
from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models import ModeloBase
from src.Opciones.models import Opcion
from typing import TYPE_CHECKING

if TYPE_CHECKING:  
    from src.Respuesta.models import Respuesta
    from src.Encuesta.models import PlantillaEncuesta
pregunta_opcion = Table(
    'pregunta_opcion',
    ModeloBase.metadata,
    Column("pregunta_id", Integer, ForeignKey("preguntas.id"), primary_key=True),
    Column("opcion_id", Integer, ForeignKey("opciones.id"), primary_key=True)
)

class Pregunta(ModeloBase):
    __tablename__ = "preguntas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    texto: Mapped[str] = mapped_column(String(250), nullable=False)
    tipo: Mapped[str] = mapped_column(String(50), nullable=False, default="abierta")

    plantilla_id: Mapped[int] = mapped_column(ForeignKey("plantillas_encuesta.id"))

    # vinculo lógico para saber a qué plantilla pertenece la pregunta
    plantilla: Mapped["PlantillaEncuesta"] = relationship(
        "PlantillaEncuesta",
        back_populates="preguntas"
    )
    opciones: Mapped[list["Opcion"]] = relationship(
        "Opcion",
        secondary=pregunta_opcion,
        back_populates="preguntas"
    )
    respuestas: Mapped[list["Respuesta"]] = relationship(
        "Respuesta",
        back_populates="pregunta",
        cascade="all, delete-orphan"
    )
