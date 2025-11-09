from typing import TYPE_CHECKING, List
from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase

if TYPE_CHECKING:
    from src.Materias.models import Materia
    from src.Departamento.models import Departamento
class Carrera(ModeloBase):
    __tablename__ = "carrera"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)

    departamento_id: Mapped[int] = mapped_column(ForeignKey("departamento.id"))
    materias: Mapped[List["Materia"]] = relationship(
        "Materia", 
        back_populates="carrera",
        lazy="noload"  
    )
    departamento: Mapped["Departamento"] = relationship(
        "Departamento", 
        back_populates="carreras",
        lazy="noload"  
    )