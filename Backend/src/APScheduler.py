from fastapi import Depends
from Backend.src.Dictados.models import Dictado
from src.database import get_db
from sqlalchemy import Session, select
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.date import DateTrigger
from datetime import date, datetime


def CrearDictados(db:Session = Depends(get_db)):
    db_dictados = db.scalars(select(Dictado).where(Dictado.fecha_inicio.year == date.today().year))
    

    #Planificar la creacion de los instrumentos    
    CrearInstrumentos()



def CrearInstrumentos(db:Session):
    pass

def tareasAnuales():
    CrearDictados()

    inicio_anio = datetime(date.today().year + 1, 1, 1).date()
    trigger = DateTrigger(run_date=inicio_anio)
    scheduler.add_job(tareasAnuales, trigger)


scheduler = BackgroundScheduler()
inicio_anio = datetime(date.today().year + 1, 1, 1).date()
trigger = DateTrigger(run_date=inicio_anio)

#Planificacion de tareas
scheduler.add_job(tareasAnuales, trigger)

scheduler.start()

