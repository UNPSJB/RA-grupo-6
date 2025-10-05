
from sqlalchemy.orm import Session
from src.database import get_db 
from fastapi import APIRouter, Depends
from src.database import get_db 
from src.RespuestasFormulario import schemas, services


router = APIRouter(prefix="/RespuestasFormulario", tags=["Respuestas Formulario"] )

@router.post("/")
def crear_respuestas_formulario(respuestas_formulario: schemas.RespuestasFormulario, db: Session = Depends(get_db)):
    return services.crear_respuestas_formulario(db, respuestas_formulario)

@router.get("/", response_model=list[schemas.RespuestasFormulario])
def leer_respuestas_formulario(db: Session = Depends(get_db)) -> list[schemas.RespuestasFormulario]:
    return services.listar_respuestas_formulario(db)