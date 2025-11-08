from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.Planificacion import services, schemas

router = APIRouter(prefix="/Planificaciones", tags=["Planificaciones"])

@router.post("/", response_model=schemas.Planificacion)
def crear_planificacion(planificacion: schemas.Planificacion, db: Session = Depends(get_db)):
    return services.crearPlanificacion(db, planificacion)

@router.get("/get_proximos_periodos", response_model=list[schemas.Planificacion])
def get_proximos_periodos(db:Session = Depends(get_db)) -> list[schemas.Planificacion]:
    return services.get_proximos_periodos(db)

@router.get("/get_proximos_periodos/{rol_id}", response_model=list[schemas.Planificacion])
def get_proximos_periodos_rol(rol_id:int, db:Session = Depends(get_db)) -> list[schemas.Planificacion]:
    return services.get_proximos_periodos_rol(rol_id, db)