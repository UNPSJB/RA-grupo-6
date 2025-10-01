from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.Usuarios import schemas, services

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

@router.get("/{usuario_id}", response_model= schemas.Usuario)
def read_usuario(usuario_id: int , db: Session = Depends(get_db)):
    return services.leer_usuario(db, usuario_id)