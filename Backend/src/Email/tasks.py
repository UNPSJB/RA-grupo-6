from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlalchemy.orm import Session
from src.database import SessionLocal
from .services import enviar_recordatorios_automaticos
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def enviar_recordatorios_diarios():
    #Tarea programada que se ejecuta automáticamente cada día
    db: Session = SessionLocal()
    try:
        logger.info("Ejecutando recordatorios automáticos...")
        resultado = enviar_recordatorios_automaticos(db, dias_antes=7)
        
        logger.info(f"Recordatorios enviados: {resultado['enviados']} exitosos, {resultado['fallidos']} fallidos")
            
    except Exception as e:
        logger.error(f"Error en recordatorios automáticos: {e}")
    finally:
        db.close()

def iniciar_programador():
    #Inicia el programador de tareas automáticas
    scheduler = BackgroundScheduler()
    
    # add_job para que se ejecute todos los días a las 08:00
    scheduler.add_job(
        enviar_recordatorios_diarios,
        trigger=CronTrigger(hour=8, minute=0),
        id='recordatorios_diarios',
        replace_existing=True
    )

    scheduler.start()
    logger.info("Programador de recordatorios iniciado")