

from __future__ import annotations 
from sqlalchemy import Column, Integer, String, ForeignKey, Date, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.Pregunta.models import Pregunta
from src.Usuarios.models import Usuario
from src.Respuesta.models import Respuesta
from src.Roles.models import Rol
from src.models import ModeloBase


class PlantillaEncuesta(ModeloBase):
    __tablename__ = "plantillas_encuesta"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    titulo: Mapped[str] = mapped_column(String(255))
    
    rol_id: Mapped[int] = mapped_column(ForeignKey("roles.id"))
    rol: Mapped["Rol"] = relationship("Rol", back_populates="plantillas")
    
    preguntas: Mapped[list["Pregunta"]] = relationship("Pregunta", back_populates="plantilla")


class RespuestaEncuesta(ModeloBase):
    __tablename__ = "respuestas_encuesta"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    fecha_completado: Mapped[Date] = mapped_column(Date)
    estado: Mapped[str] = mapped_column(String(50), default="COMPLETADO")
    
    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"))
    usuario: Mapped["Usuario"] = relationship("Usuario", back_populates="respuestas_encuesta")
    
    plantilla_id: Mapped[int] = mapped_column(ForeignKey("plantillas_encuesta.id"))
    plantilla: Mapped["PlantillaEncuesta"] = relationship("PlantillaEncuesta")

    respuestas_individuales: Mapped[list["Respuesta"]] = relationship("Respuesta", back_populates="respuesta_encuesta")