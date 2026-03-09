
from datetime import date
from typing import TYPE_CHECKING
from sqlalchemy import Date, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase


if TYPE_CHECKING:  
    from src.Materias.models import Materia
    from src.Usuarios.models import Usuario

class PeriodoVinculado(ModeloBase):

    __tablename__ = "periodo_vinculado"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    fecha_desde: Mapped[date] = mapped_column(Date)
    fecha_hasta: Mapped[date] = mapped_column(Date, nullable=True)

    materia_id: Mapped[str] = mapped_column(ForeignKey("materia.id"))
    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"))

    materia: Mapped["Materia"] = relationship("Materia", back_populates="periodos_vinculados")
    usuario: Mapped["Usuario"] = relationship("Usuario", back_populates="periodo_vinculado")
    