from sqlalchemy.orm import Session
from src.database import get_db 
from fastapi import APIRouter, Depends, Query
from src.RespuestasFormulario import schemas, services


router = APIRouter(prefix="/RespuestasFormulario", tags=["Respuestas Formulario"])

@router.post("/", response_model=schemas.RespuestasFormulario)
def crear_respuestas_formulario(
    respuestas_formulario: schemas.RespuestasFormularioCreate,  # Cambiado aquí
    db: Session = Depends(get_db)
):
    return services.crear_respuestas_formulario(db, respuestas_formulario)

@router.get("/{respuestas_formulario_id}", response_model=dict)
def leer_respuestas_formulario(
    respuestas_formulario_id: int, 
    db: Session = Depends(get_db)
):
    return services.obtener_respuestas_formulario(db, respuestas_formulario_id)

##Buscar RespuestasFormulario por instrumento_id y/o usuario_id
@router.get("/buscar/")
def buscar_respuestas_formulario(
    instrumento_id: int = Query(None),
    usuario_id: int = Query(None),
    db: Session = Depends(get_db)
):
    return services.buscar_respuestas_formulario(db, instrumento_id, usuario_id)