from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase

class GrupoPregunta(ModeloBase):
    __tablename__ = "grupos_pregunta"

    letra: Mapped[str] = mapped_column(String(1), primary_key=True, index=True)
    titulo: Mapped[str] = mapped_column(String)

    preguntas: Mapped["src.Pregunta.models.Pregunta"] = relationship(back_populates="grupo_pregunta")