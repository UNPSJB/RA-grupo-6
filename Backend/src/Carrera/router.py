from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.Carrera import schemas, services

router = APIRouter(prefix="/carreras", tags=["carreras"])

#Rutas para Carrera
@router.get("/", response_model=list[schemas.CarreraSimple])
def read_carreras(db: Session = Depends(get_db)):
    return services.listar_carreras(db)