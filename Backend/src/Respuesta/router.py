from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db 
from src.Respuesta import services, schemas

router = APIRouter(prefix="/respuestas", tags=["Respuestas"])

#Rutas de Respuestas

@router.post("/respuestas")
def crear_respuesta(respuesta: schemas.RespuestaCreate, db: Session = Depends(get_db)):
    return services.crear_respuesta(db, respuesta)

@router.get("/", response_model=list[schemas.Respuesta])
def leer_respuesta(db: Session = Depends(get_db)) -> list[schemas.Respuesta]:
    return services.listar_respuestas(db)

@router.get("/{respuesta_id}", response_model=schemas.Respuesta)
def leer_una_respuesta(respuesta_id: int, db: Session = Depends(get_db)) -> schemas.Respuesta:
    return services.obtner_respuesta(db, respuesta_id)    

@router.put("/{respuesta_id}", response_model=schemas.Respuesta)
def actualizar_respuesta(respuesta_id: int, respuesta: schemas.RespuestaUpdate, db: Session = Depends(get_db)) -> schemas.Respuesta:
    return services.modificar_respuesta(db, respuesta_id, respuesta)

@router.delete("/{respuesta_id}", response_model=schemas.RespuestaDelete)
def borrar_respuesta(respuesta_id: int, db: Session = Depends(get_db)) -> schemas.RespuestaDelete:
    return services.eliminar_respuesta(db, respuesta_id)  