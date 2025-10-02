from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
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
def leer_un_plantilla_formulario(fomulario_id: int, db: Session = Depends(get_db)) -> schemas.PlantillaFormulario:
    return services.obtener_plantilla_formulario(db, fomulario_id)
