import enum
from sqlalchemy import Enum, ForeignKey, Integer, String, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, Optional
from datetime import date

# Asumo que tenés una clase base como esta
from sqlalchemy.ext.declarative import declarative_base

from src.PlantillaFormulario.models import PlantillaFormulario
# Nota: Este import debería ser del modelo, no del schema
from src.RespuestasFormulario.models import RespuestasFormulario 
from src.materias.models import Materia
from src.models import ModeloBase

class TipoInstrumento(str, enum.Enum):
    
    def __new__(cls, value, display_name):
        # Esta parte crea el objeto como un string normal
        obj = str.__new__(cls, value)
        # Le asignamos el valor que se guardará en la BD
        obj._value_ = value
        # Le añadimos nuestra propiedad personalizada
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

    # --- RELACIÓN RECURSIVA ---
    # columna que apunta al instrumento "fuente" o "base".
    instrumento_fuente_id: Mapped[Optional[int]] = mapped_column( 
        ForeignKey("instrumento.id"), unique=True, nullable=True
    )
    
    # relación para obtener el instrumento "derivado" de este.
    instrumento_derivado: Mapped[Optional["Instrumento"]] = relationship(
        back_populates="instrumento_fuente", uselist=False 
    )

    # relación para obtener el instrumento "fuente" de este.
    instrumento_fuente: Mapped[Optional["Instrumento"]] = relationship(
        back_populates="instrumento_derivado", remote_side=[id]
    )
    
    plantilla_formulario: Mapped["PlantillaFormulario"] = relationship(back_populates="instrumentos")
    materia: Mapped["Materia"] = relationship(back_populates="instrumentos")
    respuestas_formulario: Mapped[List["RespuestasFormulario"]] = relationship(back_populates="instrumento")

    def titulo(self):
        return f'Informe Sintético N°{self.id}'
    
    def get_tipo_display(self) -> str:
        """Devuelve el nombre legible para el tipo de instrumento."""
        # Simplemente accedemos a la propiedad 'display' de nuestro enum
        if self.tipo:
            return self.tipo.display
        return "Tipo no definido"

