from typing import List, Optional

from src.RespuestasFormulario.models import RespuestasFormulario
from src.models import ModeloBase
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, ForeignKey

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.UsuarioDepartamento.models import UsuarioDepartamento
    from src.Roles.models import Rol
    from src.PeriodoVinculado.models import PeriodoVinculado

class Usuario(ModeloBase):
    __tablename__ = "usuarios"

    #Atributos 
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String(50), index=False)
    apellido: Mapped[str] = mapped_column(String(30), index=False)
    legajo: Mapped[int] = mapped_column(Integer, index=False)
    email: Mapped[str] = mapped_column(String(30), index=False)

    #Foraneas
    rol_id: Mapped[int] = mapped_column(ForeignKey("roles.id"))

    #Relaciones

    rol: Mapped["Rol"] = relationship("Rol", back_populates="usuarios")
    
    respuestas_formulario: Mapped[List["RespuestasFormulario"]] = relationship(back_populates="usuario")
    
    periodo_vinculado: Mapped["PeriodoVinculado"] = relationship("PeriodoVinculado", back_populates="usuario")

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