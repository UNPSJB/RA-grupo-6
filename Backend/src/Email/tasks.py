from datetime import date, datetime
from src.utils import get_today
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from pytest import param
from sqlalchemy.orm import Session
from src.Parametros.router import getParametros
from src.Dictados.services import CrearDictadosAnuales
from src.database import SessionLocal
from .services import enviar_recordatorios_automaticos
from apscheduler.triggers.date import DateTrigger
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

#Inicia el programador de tareas automáticas
scheduler = BackgroundScheduler()

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


def ActualizarFechas(db: Session):
    parametros = getParametros(db)

    hoy = get_today()
    parametros.inicio_primer_dictado = date(hoy.year + 1, 1,1)
    parametros.cierre_primer_dictado = date(hoy.year + 1, 3,1)
    parametros.inicio_segundo_dictado = date(hoy.year + 1, 7,1)
    parametros.cierre_segundo_dictado = date(hoy.year + 1, 10,1)

    parametros.plantilla_estudiante_basico=0
    parametros.plantilla_estudiante_superior=0
    parametros.plantilla_docente=0
    parametros.plantilla_departamento=0

    parametros.disponibilidad_estudiante=30
    parametros.disponibilidad_docente=30
    parametros.disponibilidad_departamento=30

    parametros.obj_plantilla_estudiante_basico=None
    parametros.obj_plantilla_estudiante_superior=None
    parametros.obj_plantilla_docente=None
    parametros.obj_plantilla_departamento=None
    
    db.commit()
    db.refresh(parametros)

def tareasAnuales():
    db: Session = SessionLocal()
    CrearDictadosAnuales(db)
    ActualizarFechas(db)


def iniciar_programador():

    if scheduler.running:
        logger.info("El scheduler esta corriendo")
        return

    # add_job para que se ejecute todos los días a las 08:00
    scheduler.add_job(
        enviar_recordatorios_diarios,
        trigger=CronTrigger(hour=8, minute=0),
        id='recordatorios_diarios',
        replace_existing=True
    )

    scheduler.add_job(
        tareasAnuales,
        trigger='cron',
        month=1, 
        day=1,   
        hour=0,  
        minute=0,
        id="tareas_anuales",
        replace_existing=True   
    )

    scheduler.start()
    logger.info("Programador de recordatorios iniciado")