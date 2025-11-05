import enum
from typing import TYPE_CHECKING, List, Optional

from src.models import ModeloBase
from sqlalchemy import Column, Date, ForeignKey, Integer, Table, String
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from src.Materias.models import Materia
    from src.Instrumento.models import Instrumento 


# materia_dictado = Table(
#     'materia_dictado',
#     ModeloBase.metadata,
#     Column("materia_id", String, ForeignKey("materia.id"), primary_key=True),
#     Column("dictados_id", Integer, ForeignKey("dictados.id"), primary_key=True)
# )

class MateriaDictado(ModeloBase):
    __tablename__ = "materias_dictados"

    materia_id: Mapped[str] = mapped_column(ForeignKey("materia.id"), primary_key= True)
    dictado_id: Mapped[int] = mapped_column(ForeignKey("dictados.id"), primary_key = True)


    materia: Mapped["Materia"] = relationship("Materia", back_populates="materias_dictados")
    dictado: Mapped["Dictado"] = relationship("Dictado", back_populates="materias_dictados")




class Dictado(ModeloBase):
    __tablename__ = "dictados"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    
    fecha_inicio: Mapped[date] = mapped_column(Date, nullable=False)
    fecha_cierre: Mapped[date] = mapped_column(Date, nullable=False)

    # materias: Mapped[list["Materia"]] = relationship(
    #     "Materia",
    #     secondary=materia_dictado,
    #     back_populates="dictados"
    # )
    materias_dictados: Mapped[Optional[List["MateriaDictado"]]] = relationship("MateriaDictado", back_populates="dictado")
    
    instrumentos: Mapped[Optional[List["Instrumento"]]] = relationship("Instrumento", back_populates="dictado")
    