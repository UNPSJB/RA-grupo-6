from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from enum import auto, StrEnum
from src.models import ModeloBase

class Materia(ModeloBase):
    __tablename__ = "materia"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)

