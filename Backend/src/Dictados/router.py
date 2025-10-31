from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.Dictados import schemas, services



router = APIRouter(prefix="/Dictados", tags=["Dictados"])


@router.post("/", response_model=schemas.Dictado)
def create_dictado(dictado: schemas.DictadoCreate, db:Session = Depends(get_db)):
    return services.create_dictado(db, dictado)