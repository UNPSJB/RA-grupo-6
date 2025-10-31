import enum
from typing import TYPE_CHECKING, List, Optional

from src.models import ModeloBase
from sqlalchemy import Column, Date, ForeignKey, Integer, Table, String
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from src.Materias.models import Materia



materia_dictado = Table(
    'materia_dictado',
    ModeloBase.metadata,
    Column("materia_id", String, ForeignKey("materia.id"), primary_key=True),
    Column("dictados_id", Integer, ForeignKey("dictados.id"), primary_key=True)
)


class Dictado(ModeloBase):
    __tablename__ = "dictados"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    
    fecha_inicio: Mapped[date] = mapped_column(Date, nullable=False)
    fecha_cierre: Mapped[date] = mapped_column(Date, nullable=False)

    materias: Mapped[list["Materia"]] = relationship(
        "Materia",
        secondary=materia_dictado,
        back_populates="dictados"
    )
