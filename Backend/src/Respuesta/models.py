from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from src.Pregunta.models import Pregunta, Opcion

class Respuesta(ModeloBase):
    __tablename__ = "respuestas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    texto: Mapped[str] = mapped_column(String(250), nullable=True)  # para respuestas abiertas
    opcion_id: Mapped[int | None] = mapped_column(ForeignKey("opciones.id"), nullable=True)  # para respuestas cerradas
    pregunta_id: Mapped[int] = mapped_column(ForeignKey("preguntas.id"), nullable=False)

    pregunta: Mapped["Pregunta"] = relationship("Pregunta", back_populates="respuestas")
    opcion: Mapped["Opcion"] = relationship("Opcion")