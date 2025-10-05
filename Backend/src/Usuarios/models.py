
from src.Roles.schemas import Rol
from src.models import ModeloBase
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, ForeignKey
from typing import TYPE_CHECKING, List

if TYPE_CHECKING:
    from src.Roles.models import Rol
    from src.RespuestasFormulario.models import RespuestasFormulario
    
class Usuario(ModeloBase):
    __tablename__ = "usuarios"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    nombre: Mapped[str] = mapped_column(String(50))
    apellido: Mapped[str] = mapped_column(String(50))
    legajo: Mapped[int] = mapped_column(Integer, unique=True)
    email: Mapped[str] = mapped_column(String(50), unique=True)
    
    rol_id: Mapped[int] = mapped_column(ForeignKey("roles.id"))
    rol: Mapped["Rol"] = relationship(back_populates="usuarios")

    respuestas_formulario: Mapped[List["RespuestasFormulario"]] = relationship(back_populates="usuario")
