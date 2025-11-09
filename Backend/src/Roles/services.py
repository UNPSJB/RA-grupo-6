from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.Roles import exceptions
from src.Roles.models import Rol
from src.Roles import schemas

def listar_roles(db: Session) -> List[schemas.Rol]:
    return db.scalars(select(Rol)).all()

def leer_rol(db: Session, rol_id: int) -> schemas.Rol:

    db_rol = db.scalar(select(Rol).where(Rol.id == rol_id))

    if(db_rol == None):
        raise exceptions.RolNoEncontrado()

    return db_rol

def create_role(db: Session, name: str, description: str = "") -> Rol:
    """Crea un nuevo rol."""
    db_role = Rol(name=name, description=description)
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role