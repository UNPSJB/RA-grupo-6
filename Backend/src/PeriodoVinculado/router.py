from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.PeriodoVinculado import schemas, services

router = APIRouter(prefix="/periodo_vinculado", tags=["periodo_vinculado"])

# Rutas para Periodos
@router.get("/", response_model=list[schemas.PeriodoVinculado])
def read_periodos(db: Session = Depends(get_db)):
    return services.listar_periodos(db)

