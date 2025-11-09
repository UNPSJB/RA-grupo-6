from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from .tasks import iniciar_programador, enviar_recordatorios_diarios
from .services import enviar_recordatorios_automaticos
import logging

router = APIRouter(prefix="/email", tags=["Email"])
logger = logging.getLogger(__name__)

programador_activo = False

@router.on_event("startup")
def iniciar_programador_automatico():
    global programador_activo
    if not programador_activo:
        iniciar_programador()
        programador_activo = True

@router.get("/estado-programador")
def estado_programador():
    return {
        "automatico": programador_activo,
        "programado": "Todos los días a las 08:00",
        "funcionalidad": "Envío automático de recordatorios de encuestas"
    }

@router.post("/recordatorios/ejecutar-ahora")
def ejecutar_recordatorios_manual(db: Session = Depends(get_db)):
    resultado = enviar_recordatorios_automaticos(db, dias_antes=7)
    logger.info(f"✅ Resultado: {resultado['enviados']} enviados, {resultado['fallidos']} fallidos")
    return resultado
