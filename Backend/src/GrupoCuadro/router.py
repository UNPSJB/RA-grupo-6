from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.GrupoCuadro import services, schemas

router = APIRouter(prefix="/grupos_cuadro", tags=["GrupoCuadros"])

# Crear grupo cuadro
@router.post("/", response_model=schemas.GrupoCuadro)
def crear_grupo_cuadro(opcion: schemas.GrupoCuadroCreate, db: Session = Depends(get_db)):
    return services.crear_grupo_cuadro(db, opcion)

# Listar todas los grupos cuadros
@router.get("/", response_model=list[schemas.GrupoCuadro])
def leer_grupos_cuadros(db: Session = Depends(get_db)) -> list[schemas.GrupoCuadro]:
    return services.listar_grupo_cuadro(db)

