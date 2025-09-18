from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..dependencies import get_db
from . import services
from . import schemas

router = APIRouter(prefix="/materias", tags=["materias"])

@router.get("/", response_model=List[schemas.Materia])
async def listar_materias(db: Session = Depends(get_db)):
    return services.get_materias(db)