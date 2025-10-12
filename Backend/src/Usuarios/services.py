from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.Usuarios.models import Usuario
from src.Usuarios import schemas
from src.Usuarios.exceptions import Usuario_No_Encontrado

def leer_usuario(db: Session, usuario_id: int) -> schemas.Usuario:

    db_usuario = db.scalar(select(Usuario).where(Usuario.id == usuario_id))

    if (db_usuario == None):
        raise Usuario_No_Encontrado()

    return db_usuario