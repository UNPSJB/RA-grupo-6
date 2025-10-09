import enum
from sqlalchemy import Enum, ForeignKey, Integer, String, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, Optional
from datetime import date

# Asumo que tenés una clase base como esta
from sqlalchemy.ext.declarative import declarative_base

from src.PlantillaFormulario.models import PlantillaFormulario
from src.RespuestasFormulario.schemas import RespuestasFormulario
from src.materias.models import Materia
from src.models import ModeloBase

class TipoInstrumento(str, enum.Enum):
    ENCUESTA_ESTUDIANTE = "ENCUESTA_ESTUDIANTE"
    INFORME_CATEDRA = "INFORME_CATEDRA"
    INFORME_SINTETICO = "INFORME_SINTETICO"

class Instrumento(ModeloBase):
    __tablename__ = "instrumento"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    fecha_inicio: Mapped[date] = mapped_column(Date, nullable=False)
    fecha_cierre: Mapped[date] = mapped_column(Date, nullable=False)
    tipo: Mapped[TipoInstrumento] = mapped_column(Enum(TipoInstrumento), nullable=False)

    plantilla_formulario_id: Mapped[int] = mapped_column(ForeignKey("plantilla_formularios.id"), nullable=False)
    materia_id: Mapped[str] = mapped_column(ForeignKey("materia.id"), nullable=False)

    instrumento_padre_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("instrumento.id"), unique=True, nullable=True
    )
    
    instrumento_hijo: Mapped[Optional["Instrumento"]] = relationship(
        back_populates="instrumento_padre", uselist=False
    )

    instrumento_padre: Mapped[Optional["Instrumento"]] = relationship(
        back_populates="instrumento_hijo", remote_side=[id]
    )
    
    # --- Relaciones ---
    plantilla_formulario: Mapped["PlantillaFormulario"] = relationship(back_populates="instrumentos")
    materia: Mapped["Materia"] = relationship(back_populates="instrumentos")
    respuestas_formulario: Mapped[List["RespuestasFormulario"]] = relationship(back_populates="instrumento")

    def titulo(self):
        return f'Informe Sintético N°{self.id}'