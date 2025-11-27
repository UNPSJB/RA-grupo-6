from datetime import date
from sqlalchemy import Date, ForeignKey, Integer, Nullable
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from src.PlantillaFormulario.models import PlantillaFormulario

class Parametros(ModeloBase):
    __tablename__ = "parametros"
    
    id: Mapped[int] = mapped_column(Integer, primary_key = True)

    #Fechas de dictados
    inicio_primer_dictado: Mapped[date] = mapped_column(Date, nullable=False)
    cierre_primer_dictado: Mapped[date] = mapped_column(Date, nullable=False)
    inicio_segundo_dictado: Mapped[date] = mapped_column(Date, nullable=False)
    cierre_segundo_dictado: Mapped[date] = mapped_column(Date, nullable=False)

    #Plantillas de formularios
    plantilla_estudiante_basico: Mapped[int] = mapped_column(ForeignKey("plantilla_formularios.id")) 
    plantilla_estudiante_superior: Mapped[int] = mapped_column(ForeignKey("plantilla_formularios.id")) 
    plantilla_docente: Mapped[int] = mapped_column(ForeignKey("plantilla_formularios.id"), nullable=False)
    plantilla_departamento: Mapped[int] = mapped_column(ForeignKey("plantilla_formularios.id"), nullable=False)

    #Dias que estara disponible el formulario
    disponibilidad_estudiante: Mapped[int] = mapped_column(Integer, nullable=False)
    disponibilidad_docente: Mapped[int] = mapped_column(Integer, nullable=False)
    disponibilidad_departamento: Mapped[int] = mapped_column(Integer, nullable=False)

    #Relaciones
    obj_plantilla_estudiante_basico = relationship("PlantillaFormulario", foreign_keys=[plantilla_estudiante_basico])
    obj_plantilla_estudiante_superior = relationship("PlantillaFormulario", foreign_keys=[plantilla_estudiante_superior])
    obj_plantilla_docente: Mapped["PlantillaFormulario"] = relationship("PlantillaFormulario", back_populates="parametro_plantilla_doc", foreign_keys=[plantilla_docente])
    obj_plantilla_departamento: Mapped["PlantillaFormulario"] = relationship("PlantillaFormulario", back_populates="parametro_plantilla_dep", foreign_keys=[plantilla_departamento])