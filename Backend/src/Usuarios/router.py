from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.Usuarios import schemas, services

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

@router.get("/{usuario_id}", response_model= list[dict])
def leer_respuestas_de_usuario(usuario_id: int , db: Session = Depends(get_db)):
    return services.leer_respuestas_usuario(db, usuario_id)