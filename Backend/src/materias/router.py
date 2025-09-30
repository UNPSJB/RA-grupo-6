from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.materias import schemas, services

router = APIRouter(prefix="/materias", tags=["materias"])

# Rutas para Materias
@router.get("/", response_model=list[schemas.Materia])
def read_materias(db: Session = Depends(get_db)):
    return services.listar_materias(db)


