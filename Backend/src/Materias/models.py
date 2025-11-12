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
    from src.Dictados.models import MateriaDictado

class EnumTipoDictado(str, enum.Enum):
    PRIMER_CUATRIMESTRE = "primer_cuatrimestre"
    SEGUNDO_CUATRIMESTRE = "segundo_cuatrimestre"
    ANUAL = "anual"

class EnumTipoCiclo(str, enum.Enum):
    CICLO_BASICO = "Ciclo_Basico"
    CICLO_SUPERIOR = "Ciclo_Superior"

class Materia(ModeloBase):
    __tablename__ = "materia"

    #Atributos
    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)
    dictado: Mapped[EnumTipoDictado] = mapped_column(Enum(EnumTipoDictado, native_enum=False), nullable=False)
    ciclo: Mapped[EnumTipoCiclo] = mapped_column(Enum(EnumTipoCiclo, native_enum= False), nullable=False)

    #Foraneas
    departamento_id: Mapped[int] = mapped_column(ForeignKey("departamento.id"))
    carrera_id: Mapped[int] = mapped_column(ForeignKey("carrera.id"))

    #Relaciones
    instrumentos: Mapped[List["Instrumento"]] = relationship(back_populates="materia")
    departamento: Mapped["Departamento"] = relationship("Departamento", back_populates="materias")
    carrera: Mapped["Carrera"] = relationship("Carrera", back_populates="materias")
    periodos_vinculados: Mapped[Optional[List["PeriodoVinculado"]]] = relationship("PeriodoVinculado", back_populates="materia")
    materias_dictados: Mapped[Optional[List["MateriaDictado"]]] = relationship("MateriaDictado", back_populates="materia")



