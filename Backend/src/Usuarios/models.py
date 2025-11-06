from typing import List, Optional

from src.RespuestasFormulario.models import RespuestasFormulario
from src.models import ModeloBase
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, ForeignKey



from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.UsuarioDepartamento.models import UsuarioDepartamento
    
class Usuario(ModeloBase):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String(50), index=False)
    apellido: Mapped[str] = mapped_column(String(30), index=False)
    legajo: Mapped[int] = mapped_column(Integer, index=False)
    email: Mapped[str] = mapped_column(String(30), index=False)
    rol_id: Mapped[int] = mapped_column(ForeignKey("roles.id"))

    rol: Mapped["src.Roles.models.Rol"] = relationship("src.Roles.models.Rol", back_populates="usuarios")
    respuestas_formulario: Mapped[List["RespuestasFormulario"]] = relationship(back_populates="usuario")

    periodo_vinculado: Mapped["src.PeriodoVinculado.models.PeriodoVinculado"] = relationship("src.PeriodoVinculado.models.PeriodoVinculado", back_populates="usuario")

    departamento_info: Mapped[Optional["UsuarioDepartamento"]] = relationship(
        "UsuarioDepartamento",
        back_populates="usuario",
        uselist=False,
        cascade="all, delete-orphan"
    )
    username: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    disabled: Mapped[Optional[bool]] = mapped_column(Integer, nullable=True, default=None)
    hashed_password: Mapped[str] = mapped_column(String(100), nullable=False)
    is_active: Mapped[bool] = mapped_column(Integer, nullable=False, default=1)