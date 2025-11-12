from __future__ import annotations
import enum
from sqlalchemy import Enum, ForeignKey, Integer, String, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING, List, Optional
from datetime import date
from src.models import ModeloBase

if TYPE_CHECKING:
    from src.PlantillaFormulario.models import PlantillaFormulario
    from src.RespuestasFormulario.models import RespuestasFormulario 
    from src.Materias.models import Materia
    from src.Dictados.models import Dictado
    from src.Departamento.models import Departamento

class TipoInstrumento(str, enum.Enum):
    def __new__(cls, value, display_name):
        obj = str.__new__(cls, value)
        obj._value_ = value
        obj.display = display_name
        return obj

    ENCUESTA_ESTUDIANTE = ("ENCUESTA_ESTUDIANTE", "Encuesta de Estudiante")
    INFORME_CATEDRA = ("INFORME_CATEDRA", "Informe de Cátedra")
    INFORME_SINTETICO = ("INFORME_SINTETICO", "Informe Sintético")


class Instrumento(ModeloBase):
    __tablename__ = "instrumento"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    fecha_inicio: Mapped[date] = mapped_column(Date, nullable=False)
    fecha_cierre: Mapped[date] = mapped_column(Date, nullable=False)
    tipo: Mapped[TipoInstrumento] = mapped_column(Enum(TipoInstrumento), nullable=False)


    plantilla_formulario_id: Mapped[int] = mapped_column(ForeignKey("plantilla_formularios.id"), nullable=False)
    materia_id: Mapped[str] = mapped_column(ForeignKey("materia.id"), nullable=False)
    dictado_id: Mapped[int] = mapped_column(ForeignKey("dictados.id"))
    departamento_id: Mapped[Optional[int]] = mapped_column(ForeignKey("departamento.id"), nullable=True)
    

    instrumento_fuente_id: Mapped[Optional[int]] = mapped_column(ForeignKey("instrumento.id"), nullable=True)


    plantilla_formulario: Mapped["PlantillaFormulario"] = relationship(back_populates="instrumentos")
    materia: Mapped["Materia"] = relationship(back_populates="instrumentos")
    respuestas_formulario: Mapped[List["RespuestasFormulario"]] = relationship(back_populates="instrumento")
    dictado: Mapped["Dictado"] = relationship("Dictado", back_populates="instrumentos")
    departamento: Mapped[Optional["Departamento"]] = relationship("Departamento", back_populates="instrumentos")


    instrumento_fuente: Mapped[Optional["Instrumento"]] = relationship(
        "Instrumento",
        remote_side=lambda: [Instrumento.id],
        back_populates="instrumentos_derivados",
    )

    instrumentos_derivados: Mapped[List["Instrumento"]] = relationship(
        "Instrumento",
        back_populates="instrumento_fuente",
        cascade="all, delete-orphan",
    )

    def titulo(self):
        return f'Informe Sintético N°{self.id}'
    
    def get_tipo_display(self) -> str:
        """Devuelve el nombre legible para el tipo de instrumento."""
        if self.tipo:
            return self.tipo.display
        return "Tipo no definido"

