from sqlalchemy import Session
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.date import DateTrigger
from datetime import date, datetime


def CrearDictados(db:Session):    
    pass

def CrearPlanificaciones(db:Session):
    pass

def CrearInstrumentos(db:Session):
    pass

def tareasAnuales():
    CrearDictados()
    CrearPlanificaciones()

    inicio_anio = datetime(date.today().year + 1, 1, 1).date()
    trigger = DateTrigger(run_date=inicio_anio)
    scheduler.add_job(tareasAnuales, trigger)


scheduler = BackgroundScheduler()
inicio_anio = datetime(date.today().year + 1, 1, 1).date()
trigger = DateTrigger(run_date=inicio_anio)

#Planificacion de tareas
scheduler.add_job(tareasAnuales, trigger)

scheduler.start()

