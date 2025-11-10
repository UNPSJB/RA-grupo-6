from __future__ import annotations
from typing import TYPE_CHECKING, List
from sqlalchemy import Integer, String, Date, ForeignKey, Column, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from datetime import date



if TYPE_CHECKING:
    from src.Instrumento.exceptions import Instrumento
    from src.Pregunta.models import Pregunta
    from src.Roles.models import Rol
    from src.Parametros.models import Parametros

formulario_pregunta = Table(
    "formulario_pregunta",
    ModeloBase.metadata,
    Column("plantilla_formulario_id", Integer, ForeignKey("plantilla_formularios.id"), primary_key=True),
    Column("pregunta_id", Integer, ForeignKey("preguntas.id"), primary_key=True)
)

class PlantillaFormulario(ModeloBase):
    __tablename__ = "plantilla_formularios"
    id: Mapped[int] = mapped_column(Integer, primary_key= True, index=True)
    titulo: Mapped[str] = mapped_column(String(50), nullable= False)
    fecha_creacion: Mapped[date] = mapped_column(Date, default=date.today, nullable= False)
    preguntas: Mapped[list["Pregunta"]] = relationship(
        "Pregunta",
        secondary= formulario_pregunta,
        back_populates="formularios"
    )
    instrumentos: Mapped[List["Instrumento"]] = relationship(back_populates="plantilla_formulario")
    rol_id: Mapped[int] = mapped_column(ForeignKey("roles.id"), nullable=False) 
    rol: Mapped["Rol"] =relationship("Rol", back_populates="Plantillaformularios")

    parametro_plantilla_est : Mapped["Parametros"] = relationship("Parametros", back_populates="obj_plantilla_estudiante", foreign_keys="Parametros.plantilla_estudiante")
    parametro_plantilla_doc : Mapped["Parametros"] = relationship("Parametros", back_populates="obj_plantilla_docente", foreign_keys="Parametros.plantilla_docente")
    parametro_plantilla_dep : Mapped["Parametros"] = relationship("Parametros", back_populates="obj_plantilla_departamento", foreign_keys="Parametros.plantilla_departamento")
    
