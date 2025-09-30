from src.models import ModeloBase
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, ForeignKey

class Usuario(ModeloBase):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String(50), index=False)
    apellido: Mapped[str] = mapped_column(String(30), index=False)
    legajo: Mapped[int] = mapped_column(Integer, index=False)
    email: Mapped[str] = mapped_column(String(30), index=False)
    rol_id: Mapped[int] = mapped_column(ForeignKey("roles.id"))

    rol: Mapped["src.Roles.models.Rol"] = relationship("src.Roles.models.Rol", back_populates="usuarios")