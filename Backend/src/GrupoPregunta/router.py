from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db 
from src.GrupoPregunta import services, schemas

router = APIRouter(prefix="/GrupoPregunta", tags=["GrupoPregunta"])

#Rutas de Grupo de Pregunta

@router.get("/", response_model=list[schemas.GrupoPregunta])
def leer_grupo_pregunta(db: Session = Depends(get_db)) -> list[schemas.GrupoPregunta]:
    return services.listar_grupos_pregunta(db)

@router.get("/{grupo_pregunta_id}", response_model=schemas.GrupoPregunta)
def leer_un_grupo_pregunta(grupo_pregunta_id: str, db: Session = Depends(get_db)) -> schemas.GrupoPregunta:
    return services.obtener_grupo_pregunta(db, grupo_pregunta_id)    