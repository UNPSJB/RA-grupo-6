from datetime import date
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.Parametros.schemas import Parametros
from src.database import get_db
from src.Parametros import services, schemas

router = APIRouter(prefix="/Parametros", tags=["Parametros"])

@router.get("/", response_model=schemas.Parametros)
def getParametros(db: Session = Depends(get_db)) -> schemas.Parametros:
    return services.getParametros(db)

#Fechas
@router.put("/actualizar/", response_model=schemas.Parametros)
def actualizar_parametros(parametros : Parametros, db: Session = Depends(get_db)) -> schemas.Parametros:
    return services.actualizar_parametros(db, parametros)
