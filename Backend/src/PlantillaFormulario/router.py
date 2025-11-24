from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.Usuarios.auth import require_role
from src.database import get_db
from src.PlantillaFormulario import services, schemas
router = APIRouter(prefix="/formularios", tags=["Formularios"])

#Rutas de Formularios 

@router.post("/")
def crear_plantilla_formulario(formulario: schemas.FormularioCreate, db: Session = Depends(get_db)):
    return services.crear_plantilla_formulario(db, formulario)

@router.get("/", response_model=list[schemas.PlantillaFormulario])
def leer_plantilla_formulario(db: Session = Depends(get_db)) -> list[schemas.PlantillaFormulario]:
    return services.listar_plantilla_formularios(db)

@router.get("/{formulario_id}", response_model=schemas.PlantillaFormulario)
def leer_un_plantilla_formulario(formulario_id: int, db: Session = Depends(get_db)) -> schemas.PlantillaFormulario:
    return services.obtener_plantilla_formulario(db, formulario_id)

@router.get("/EstadisticasFormularios/rol_{rol_id}", response_model=list)
def get_Estadisticas_Formularios(rol_id: int, db: Session = Depends(get_db)):
    return services.getComparacionPlantillas(db, rol_id)

@router.get("/MejorPlantilla/rol_{rol_id}", response_model=Optional[schemas.PlantillaFormulario])
def get_mejor_plantilla(rol_id: int, db: Session = Depends(get_db)):
    return services.getMejorPlantilla(db, rol_id)

@router.get("/TasaRespuestasPlantillas/rol_{rol_id}", response_model=float)
def get_tasa_resp_plantillas(rol_id: int, db: Session = Depends(get_db)):
    return services.getTasaRespuestasPlantillas(db, rol_id)

@router.get("/rol/{rol_id}", response_model= list[schemas.PlantillaFormulario])
def get_plantillas_rol(rol_id:int, db:Session = Depends(get_db)) -> list[schemas.PlantillaFormulario]:
    return services.get_plantillas_rol(db, rol_id)
