from __future__ import annotations 
import enum
from sqlalchemy import Enum,Column, Integer, String, ForeignKey, Table, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from src.Opciones.models import Opcion

from typing import TYPE_CHECKING, Optional

if TYPE_CHECKING:  
    from src.PlantillaFormulario.models import PlantillaFormulario
    from src.Respuesta.models import Respuesta
    from src.GrupoPregunta.models import GrupoPregunta
    from src.Roles.models import Rol
    from src.GrupoCuadro.models import GrupoCuadro 

class EnumTipoPregunta(str, enum.Enum):
    abierta = "abierta"
    cerrada = "cerrada"

pregunta_opcion = Table(
    'pregunta_opcion',
    ModeloBase.metadata,
    Column("pregunta_id", Integer, ForeignKey("preguntas.id"), primary_key=True),
    Column("opcion_id", Integer, ForeignKey("opciones.id"), primary_key=True)
)

class Pregunta(ModeloBase):
    __tablename__ = "preguntas"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    texto: Mapped[str] = mapped_column(String(250), nullable=False)
    tipo: Mapped[EnumTipoPregunta] = mapped_column(
        Enum(EnumTipoPregunta),  
        nullable=False,
        default=EnumTipoPregunta.abierta
    )

    grupo_pregunta_id: Mapped[int] = mapped_column(ForeignKey("grupos_pregunta.id"), nullable=False)

    grupo_pregunta: Mapped["GrupoPregunta"] = relationship(back_populates="preguntas")

    rol_id: Mapped[int] = mapped_column(ForeignKey("roles.id"), nullable=False)

    rol: Mapped["Rol"] = relationship("Rol", back_populates="preguntas")

    grupo_cuadro_id: Mapped[Optional[int]] = mapped_column(ForeignKey("grupos_cuadro.id"), nullable=True)

    grupo_cuadro: Mapped[Optional["GrupoCuadro"]] = relationship(back_populates="preguntas")

    orden_en_grupo: Mapped[int] = mapped_column(Integer, nullable=True)

    formularios: Mapped[list["PlantillaFormulario"]] = relationship(
    "PlantillaFormulario",
    secondary="formulario_pregunta",
    back_populates="preguntas"
    )

    opciones: Mapped[list["Opcion"]] = relationship(
        "Opcion",
        secondary=pregunta_opcion,
        back_populates="preguntas"
    )
    respuestas: Mapped[list["Respuesta"]] = relationship(
        "Respuesta",
        back_populates="pregunta",
        cascade="all, delete-orphan"
    )

    estadistica: Mapped[bool] = mapped_column(Boolean, nullable= False)

    multiple_respuestas : Mapped[bool] = mapped_column(Boolean, nullable= False)



    


