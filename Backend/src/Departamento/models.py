from typing import TYPE_CHECKING, List
from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models import ModeloBase

if TYPE_CHECKING:
    from src.Materias.models import Materia
    from src.Carrera.models import Carrera
    from src.UsuarioDepartamento.models import UsuarioDepartamento
    from src.Instrumento.models import Instrumento
    
class Departamento(ModeloBase):
    __tablename__ = "departamento"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)

    materias: Mapped[List["Materia"]] = relationship(
        "Materia", 
        back_populates="departamento",
        lazy="noload"  
    )
    carreras: Mapped[List["Carrera"]] = relationship(
        "Carrera", 
        back_populates="departamento",
        lazy="noload" 
    )
    usuarios_info: Mapped[List["UsuarioDepartamento"]] = relationship(
        "UsuarioDepartamento",
        back_populates="departamento"
    )

    instrumentos: Mapped[List["Instrumento"]] = relationship(
        "Instrumento",
        back_populates="departamento",
        lazy="noload"
    )

    sede: Mapped[str] = mapped_column(String, index=False)