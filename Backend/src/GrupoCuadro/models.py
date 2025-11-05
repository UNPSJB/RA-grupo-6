from __future__ import annotations 
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, TYPE_CHECKING
from src.models import ModeloBase

if TYPE_CHECKING:
    from src.Pregunta.models import Pregunta

class GrupoCuadro(ModeloBase):
    __tablename__ = "grupos_cuadro"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String(250), nullable=False)
    descripcion: Mapped[str] = mapped_column(String(500), nullable=True)
    orden: Mapped[int] = mapped_column(Integer, nullable=False)

    preguntas: Mapped[List["Pregunta"]] = relationship(back_populates="grupo_cuadro", order_by="Pregunta.orden_en_grupo" )