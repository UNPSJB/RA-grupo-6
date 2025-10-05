# En tu archivo RespuestasFormulario/models.py

from __future__ import annotations
# from ast import List  <-- INCORRECTO
from typing import TYPE_CHECKING, List # <--- CORRECTO: List viene de typing
from datetime import date
from sqlalchemy import Integer, String, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase

if TYPE_CHECKING:
    # from src.Respuesta.schemas import Respuesta <-- INCORRECTO
    from src.Respuesta.models import Respuesta # <--- CORRECTO: Importamos el Modelo
    from src.Usuarios.models import Usuario
    from src.PlantillaFormulario.models import PlantillaFormulario
    
class RespuestasFormulario(ModeloBase):
    __tablename__ = "respuestas_formulario" 
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    fecha_completado: Mapped[date] = mapped_column(Date, default=date.today)
    
    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"))
    usuario: Mapped["Usuario"] = relationship(back_populates="respuestas_formulario") 
    
    plantilla_formulario_id: Mapped[int] = mapped_column(ForeignKey("plantilla_formularios.id"))
    plantilla: Mapped["PlantillaFormulario"] = relationship()

    # Ahora el type hint Mapped[List[Respuesta]] usa la clase correcta
    respuestas_individuales: Mapped[List["Respuesta"]] = relationship(back_populates="respuesta_formulario")