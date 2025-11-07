from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.Departamento import schemas, services

router = APIRouter(prefix="/departamentos", tags=["departamentos"])

#Rutas para Departamento
@router.get("/", response_model=list[schemas.DepartamentoBase]) # Antes era schemas.Departamento
def read_departamentos(db: Session = Depends(get_db)):
    return services.listar_departamentos(db)
