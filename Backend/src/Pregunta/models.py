from __future__ import annotations 
import enum
from pickle import TRUE
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
    
    #Atributos
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    texto: Mapped[str] = mapped_column(String(250), nullable=False)
    tipo: Mapped[EnumTipoPregunta] = mapped_column(Enum(EnumTipoPregunta),   nullable=False, default=EnumTipoPregunta.abierta)
    obligatoria: Mapped[bool] = mapped_column(Boolean, nullable=True)
    orden_en_grupo: Mapped[int] = mapped_column(Integer, nullable=True)
    estadistica: Mapped[bool] = mapped_column(Boolean, nullable= False)
    obligatoria: Mapped[bool] = mapped_column(Boolean, nullable= False)
    multiple_respuestas : Mapped[bool] = mapped_column(Boolean, nullable= False)
    tipo_respuesta: Mapped[str] = mapped_column(String, nullable=True)


    #Foraneas
    pregunta_fuente_id: Mapped[Optional[int]] = mapped_column(ForeignKey("preguntas.id"), nullable=True)
    grupo_cuadro_id: Mapped[Optional[int]] = mapped_column(ForeignKey("grupos_cuadro.id"), nullable=True)
    grupo_pregunta_id: Mapped[int] = mapped_column(ForeignKey("grupos_pregunta.id"), nullable=False)
    rol_id: Mapped[int] = mapped_column(ForeignKey("roles.id"), nullable=False)


    #Relaciones
    formularios: Mapped[list["PlantillaFormulario"]] = relationship( "PlantillaFormulario", secondary="formulario_pregunta", back_populates="preguntas")
    opciones: Mapped[list["Opcion"]] = relationship( "Opcion", secondary=pregunta_opcion, back_populates="preguntas")
    respuestas: Mapped[list["Respuesta"]] = relationship( "Respuesta", back_populates="pregunta", cascade="all, delete-orphan")
    preguntas_que_la_usan: Mapped[list["Pregunta"]] = relationship("Pregunta", back_populates="pregunta_fuente", foreign_keys=[pregunta_fuente_id])
    grupo_cuadro: Mapped[Optional["GrupoCuadro"]] = relationship(back_populates="preguntas")
    rol: Mapped["Rol"] = relationship("Rol", back_populates="preguntas")
    grupo_pregunta: Mapped["GrupoPregunta"] = relationship(back_populates="preguntas")
    pregunta_fuente: Mapped[Optional["Pregunta"]] = relationship("Pregunta", remote_side=[id], foreign_keys=[pregunta_fuente_id], back_populates="preguntas_que_la_usan",
        uselist=False
    )



