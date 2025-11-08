from datetime import date
from sqlalchemy import select
from sqlalchemy.orm import Session
from src.PlantillaFormulario.models import PlantillaFormulario
from src.Roles.models import Rol


from src.Planificacion.models import Planificacion
from src.Planificacion import schemas

def crearPlanificacion(db:Session, planificacion: schemas.Planificacion) -> schemas.Planificacion:
    _nueva_planificacion = Planificacion(**planificacion.model_dump())

    db.add(_nueva_planificacion)
    db.commit()
    db.refresh(_nueva_planificacion)
    return _nueva_planificacion


def get_proximos_periodos(db:Session) -> list[schemas.Planificacion]:
    db_proximos_periodos = db.scalars(select(Planificacion).where(Planificacion.fecha_inicio >= date.today())).all()

    return db_proximos_periodos


def get_proximos_periodos_rol(rol_id: int, db:Session) -> list[schemas.Planificacion]:
    db_proximos_periodos = db.scalars(select(Planificacion)
                                    .join(Planificacion.plantilla_formulario)
                                    .join(PlantillaFormulario.rol)
                                    .where((Planificacion.fecha_inicio >= date.today()) & 
                                            (Rol.id == rol_id))).all()

    return db_proximos_periodos