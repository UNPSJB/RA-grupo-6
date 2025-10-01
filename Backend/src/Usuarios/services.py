from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.Usuarios.models import Usuario
from src.Usuarios import schemas


def leer_usuario(db: Session, usuario_id: int) -> schemas.Usuario:
    return db.scalar(select(Usuario).where(Usuario.id == usuario_id))