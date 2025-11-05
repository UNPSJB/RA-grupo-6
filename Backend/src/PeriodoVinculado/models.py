
from datetime import date
from sqlalchemy import Date, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase

class PeriodoVinculado(ModeloBase):

    __tablename__ = "periodo_vinculado"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    fecha_desde: Mapped[date] = mapped_column(Date)
    fecha_hasta: Mapped[date] = mapped_column(Date)

    materia_id: Mapped[int] = mapped_column(ForeignKey("materia.id"))
    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"))

    materia: Mapped["src.materias.models.Materia"] = relationship("src.materias.models.Materia", back_populates="periodo_vinculado")
    usuario: Mapped["src.Usuarios.models.Usuario"] = relationship("src.Usuarios.models.Usuario", back_populates="periodo_vinculado")

