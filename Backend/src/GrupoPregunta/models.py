from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from src.Pregunta.models import Pregunta
class GrupoPregunta(ModeloBase):
    __tablename__ = "grupos_pregunta"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    letra: Mapped[str] = mapped_column(String(1))
    titulo: Mapped[str] = mapped_column(String)

    preguntas: Mapped["Pregunta"] = relationship(back_populates="grupo_pregunta")