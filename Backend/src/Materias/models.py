import enum

from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import String, Enum,ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.Dictados.models import Dictado
from src.models import ModeloBase

if TYPE_CHECKING:
    from src.Instrumento.models import Instrumento
    from src.RespuestasFormulario.models import RespuestasFormulario
    from src.Departamento.models import Departamento
    from src.Carrera.models import Carrera
    from src.PeriodoVinculado.models import PeriodoVinculado


class EnumTipoDictado(str, enum.Enum):
    PRIMER_CUATRIMESTRE = "primer_cuatrimestre"
    SEGUNDO_CUATRIMESTRE = "segundo_cuatrimestre"
    ANUAL = "anual"


class Materia(ModeloBase):
    __tablename__ = "materia"
    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)
    departamento_id: Mapped[int] = mapped_column(ForeignKey("departamento.id"))
    carrera_id: Mapped[int] = mapped_column(ForeignKey("carrera.id"))

    instrumentos: Mapped[List["Instrumento"]] = relationship(back_populates="materia")
    respuestas_formulario: Mapped[Optional[List["RespuestasFormulario"]]] = relationship(back_populates='materia')
    departamento: Mapped["Departamento"] = relationship("Departamento", back_populates="materias")
    carrera: Mapped["Carrera"] = relationship("Carrera", back_populates="materias")

    periodos_vinculados: Mapped[Optional[List["PeriodoVinculado"]]] = relationship("PeriodoVinculado", back_populates="materia")

    dictados: Mapped[list["Dictado"]] = relationship(
        "Dictado",
        secondary="materia_dictado",
        back_populates="materias"
    )

    dictado: Mapped[EnumTipoDictado] = mapped_column(Enum(EnumTipoDictado), nullable=False)

