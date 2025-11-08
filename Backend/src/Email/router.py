from fastapi import APIRouter, Depends, Query, BackgroundTasks
from sqlalchemy.orm import Session
from src.database import get_db
from . import services, schemas, tasks

router = APIRouter(prefix="/email", tags=["Email"])

@router.post("/recordatorios/automaticos", response_model=schemas.ResultadoEnvio)
def enviar_recordatorios_automaticos(
    dias_antes: int = Query(7, description="Días antes del cierre para enviar recordatorio"),
    departamento_id: int = Query(None, description="Filtrar por departamento"),
    db: Session = Depends(get_db)
):
    return services.enviar_recordatorios_automaticos(db, dias_antes, departamento_id)

@router.post("/recordatorios/ejecutar-ahora", response_model=schemas.ResultadoEnvio)  # AGREGAR response_model
def ejecutar_recordatorios_ahora(db: Session = Depends(get_db)):
    # EJECUCIÓN  INMEDIATA (testing)
    return services.enviar_recordatorios_automaticos(db, dias_antes=7)

@router.get("/estado-programador")
def obtener_estado_programador():
    return {
        "automatico": True,
        "programado": "Diario a las 08:00",
        "funcionalidad": "Recordatorios se envían automáticamente"
    }