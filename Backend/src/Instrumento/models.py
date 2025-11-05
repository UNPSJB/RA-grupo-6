import enum
from sqlalchemy import Enum, ForeignKey, Integer, String, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, Optional
from datetime import date


from src.PlantillaFormulario.models import PlantillaFormulario
from src.RespuestasFormulario.models import RespuestasFormulario 
from src.Materias.models import Materia
from src.models import ModeloBase

from src.Dictados.models import Dictado


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

    #Atributos
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    fecha_inicio: Mapped[date] = mapped_column(Date, nullable=False)
    fecha_cierre: Mapped[date] = mapped_column(Date, nullable=False)
    tipo: Mapped[TipoInstrumento] = mapped_column(Enum(TipoInstrumento), nullable=False)

    #Foraneas
    plantilla_formulario_id: Mapped[int] = mapped_column(ForeignKey("plantilla_formularios.id"), nullable=False)
    materia_id: Mapped[str] = mapped_column(ForeignKey("materia.id"), nullable=False)
    dictado_id: Mapped[int] = mapped_column(ForeignKey("dictados.id"))
    instrumento_fuente_id: Mapped[Optional[int]] = mapped_column(ForeignKey("instrumento.id"), unique=True, nullable=True)
    
    #Relaciones
    plantilla_formulario: Mapped["PlantillaFormulario"] = relationship(back_populates="instrumentos")
    materia: Mapped["Materia"] = relationship(back_populates="instrumentos")
    respuestas_formulario: Mapped[List["RespuestasFormulario"]] = relationship(back_populates="instrumento")
    dictado: Mapped["Dictado"] = relationship("Dictado", back_populates="instrumentos")
    
    # relación para obtener el instrumento "derivado" de este.
    instrumento_derivado: Mapped[Optional["Instrumento"]] = relationship(back_populates="instrumento_fuente", uselist=False)

    # relación para obtener el instrumento "fuente" de este.
    instrumento_fuente: Mapped[Optional["Instrumento"]] = relationship(back_populates="instrumento_derivado", remote_side=[id])
    
    
    def titulo(self):
        return f'Informe Sintético N°{self.id}'
    
    def get_tipo_display(self) -> str:
        """Devuelve el nombre legible para el tipo de instrumento."""
        # Simplemente accedemos a la propiedad 'display' de nuestro enum
        if self.tipo:
            return self.tipo.display
        return "Tipo no definido"

