from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from src.database import get_db
from src.Usuarios.auth import get_current_user_from_cookie
from src.Home import services, schemas

router = APIRouter(prefix="/home", tags=["Home"])

@router.get("/", response_model=schemas.Home)
def obtener_estadisticas_home(usuario_id: int,db: Session = Depends(get_db)):
    return services.get_home_estadisticas(db, usuario_id)
