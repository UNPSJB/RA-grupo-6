from datetime import date
from sqlalchemy import Date, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from src.PlantillaFormulario.models import PlantillaFormulario

class Planificacion(ModeloBase):
    __tablename__ = "planificaciones"
    
    id: Mapped[int] = mapped_column(Integer, primary_key = True)
    fecha_inicio: Mapped[date] = mapped_column(Date, nullable=False)
    fecha_cierre: Mapped[date] = mapped_column(Date, nullable=False)
    plantilla_formulario_id: Mapped[date] = mapped_column(ForeignKey("plantilla_formularios.id"), nullable=False)

    plantilla_formulario: Mapped["PlantillaFormulario"] = relationship("PlantillaFormulario", back_populates="planificaciones")
    