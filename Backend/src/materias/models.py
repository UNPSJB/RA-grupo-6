from typing import List, Optional
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase

class Materia(ModeloBase):
    __tablename__ = "materia"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)

    respuestas_formulario: Mapped[Optional[List["src.RespuestasFormulario.models.RespuestasFormulario"]]] = relationship(back_populates='materia')
