from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import select
from src.Roles.models import Rol
from src.PlantillaFormulario import schemas, exceptions
from src.PlantillaFormulario.models import PlantillaFormulario
from src.Pregunta.models import Pregunta
from src.Instrumento.services import getTasaRespuestasInstrumentos, getCompletitud

def crear_plantilla_formulario(db: Session, plantilla_formulario: schemas.FormularioCreate):
    
    preguntas_validas = db.query(Pregunta).filter(Pregunta.id.in_([preg for preg in plantilla_formulario.preguntas if preg > 0])).all()
    
    _nuevo_plantilla_formulario = PlantillaFormulario(titulo = plantilla_formulario.titulo, rol_id = plantilla_formulario.rol)
    _nuevo_plantilla_formulario.preguntas = preguntas_validas

    db.add(_nuevo_plantilla_formulario)
    db.commit()
    db.refresh(_nuevo_plantilla_formulario)
    return _nuevo_plantilla_formulario

def listar_plantilla_formularios(db: Session) -> List[schemas.PlantillaFormulario]:
    return db.scalars(select(PlantillaFormulario)).all()

def obtener_plantilla_formulario(db: Session, formulario_id: int) -> schemas.PlantillaFormulario:
    db_plantilla_formulario = db.scalar(select(PlantillaFormulario).where(PlantillaFormulario.id == formulario_id))
    if db_plantilla_formulario is None:
        raise exceptions.FormularioNoEncontrado()
    return db_plantilla_formulario


def getComparacionPlantillas(db:Session, rol_id:int) -> list:
    db_plantilla_formulario = db.scalars(select(PlantillaFormulario).where(PlantillaFormulario.rol_id == rol_id)).all()

    estadisticas = []

    for plantilla  in db_plantilla_formulario:
        
        estadisticas.append({
            "Titulo": plantilla.titulo,  
            "CantPreguntas": len(plantilla.preguntas),
            "CantObligatorias": len([pregunta for pregunta in plantilla.preguntas if pregunta.obligatoria]),
            "Grupos": len(set([pregunta.grupo_pregunta.id for pregunta in plantilla.preguntas])),
            "TasaRespuestas": getTasaRespuestasInstrumentos(db, plantilla.instrumentos, plantilla.rol_id),
            "Completitud": getCompletitud(db, plantilla.instrumentos),
        })
        
    return estadisticas

def getMejorPlantilla(db:Session, rol_id:int) -> schemas.PlantillaFormulario:
    db_plantilla_formulario = db.scalars(select(PlantillaFormulario).where(PlantillaFormulario.rol_id == rol_id)).all()

    if len(db_plantilla_formulario) == 0:
        return None

    mejorPlantilla = db_plantilla_formulario[0]
    mejorScore = (0.55 * getTasaRespuestasInstrumentos(db, mejorPlantilla.instrumentos, rol_id)) + (0.45 * getCompletitud(db, mejorPlantilla.instrumentos))
    
    for plantilla in db_plantilla_formulario:
        
        scorePlantilla = (0.55 * getTasaRespuestasInstrumentos(db, plantilla.instrumentos, rol_id)) + (0.45 * getCompletitud(db, plantilla.instrumentos))
        
        if (scorePlantilla > mejorScore):
            mejorScore = scorePlantilla
            mejorPlantilla = plantilla
            
    print(mejorPlantilla)
    return mejorPlantilla


def getTasaRespuestasPlantillas(db:Session, rol_id:int) -> float:
    db_plantilla_formulario = db.scalars(select(PlantillaFormulario).where(PlantillaFormulario.rol_id == rol_id)).all()

    instrumentos = []

    for plantilla in db_plantilla_formulario:
        
        instrumentos = instrumentos + (plantilla.instrumentos)

    return getTasaRespuestasInstrumentos(db, instrumentos, rol_id)



