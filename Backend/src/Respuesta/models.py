from __future__ import annotations
from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from typing import TYPE_CHECKING, Optional
from src.RespuestasFormulario.models import RespuestasFormulario
if TYPE_CHECKING:
    
    from src.Pregunta.models import Pregunta
    from src.Opciones.models import Opcion

class Respuesta(ModeloBase):
    __tablename__ = "respuestas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    texto: Mapped[Optional[str]] = mapped_column(String(500))
    
    pregunta_id: Mapped[int] = mapped_column(ForeignKey("preguntas.id"))
    pregunta: Mapped["Pregunta"] = relationship(back_populates="respuestas")
    
    opcion_id: Mapped[Optional[int]] = mapped_column(ForeignKey("opciones.id"))
    opcion: Mapped[Optional["Opcion"]] = relationship()
    
    # VÍNCULO FÍSICO: Indica a esta respuesta a qué "entrega" general pertenece.
    respuesta_formulario_id: Mapped[int] = mapped_column(ForeignKey("respuestas_formulario.id"))

    # VÍNCULO LÓGICO: esto permite navegar desde una respuesta a la entrega completa.
    respuesta_formulario: Mapped["RespuestasFormulario"] = relationship(back_populates="respuestas_individuales")