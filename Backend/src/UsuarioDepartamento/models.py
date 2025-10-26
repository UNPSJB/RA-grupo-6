from sqlalchemy import Enum, ForeignKey, Integer, String, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, Optional
from datetime import date

from src.Departamento.models import Departamento
from src.Usuarios.models import Usuario
from src.models import ModeloBase



class UsuarioDepartamento(ModeloBase):
    __tablename__ = "usuario_departamento"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    
    fecha_desde: Mapped[date] = mapped_column(Date, nullable=False, default=date.today)
    fecha_hasta: Mapped[Optional[date]] = mapped_column(Date, nullable=True)

    usuario_id: Mapped[int] = mapped_column(
        ForeignKey("usuarios.id"), unique=True, nullable=False, index=True
    )
    departamento_id: Mapped[int] = mapped_column(
        ForeignKey("departamento.id"), nullable=False, index=True
    )

    usuario: Mapped["Usuario"] = relationship(
        "Usuario",
        back_populates="departamento_info"
    )
    
    departamento: Mapped["Departamento"] = relationship(
        "Departamento",
        back_populates="usuarios_info"
    )