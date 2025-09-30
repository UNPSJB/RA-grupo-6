from src.models import ModeloBase
from typing import List, Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String

from datetime import date

class Rol(ModeloBase):
    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String(50), index=False)
    fecha_creacion: Mapped[date] = mapped_column(index=False)

    usuarios: Mapped[Optional[List["src.Usuarios.models.Usuario"]]] = relationship("src.Usuarios.models.Usuario", back_populates="rol")