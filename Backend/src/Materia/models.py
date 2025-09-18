from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, List
from src.database import Base

class Materia(Base):
    __tablename__ = "materias"
    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)
    
    #para rel con inscripciones
    #inscripciones: Mapped[List["Inscripcion"]] = relationship(back_populates="materia")