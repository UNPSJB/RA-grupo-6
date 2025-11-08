from fastapi import HTTPException
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.Roles.models import Rol
from src.Usuarios.models import Usuario
from src.Usuarios import schemas
from src.Usuarios.exceptions import Usuario_No_Encontrado
from passlib.context import CryptContext
from .schemas import UserCreateSchema
from typing import Optional

# definimos el contexto de hasheo de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str):
    """Genera el hash de una contraseña."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    """Verifica una contraseña contra su hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_user(db: Session, user_id: int) -> Optional[Usuario]:
    """
    Obtiene un usuario por su ID.
    (se reemplazo por 'leer_usuario' y 'get_user_by_id')
    """
    db_usuario = db.scalar(select(Usuario).where(Usuario.id == user_id))
    
    return db_usuario

def get_user_by_username(db: Session, username: str) -> Optional[Usuario]:
    """Obtiene un usuario por su username."""
    return db.scalar(select(Usuario).where(Usuario.username == username))

def get_user_by_email(db: Session, email: str) -> Optional[Usuario]:
    """Obtiene un usuario por su email."""
    return db.scalar(select(Usuario).where(Usuario.email == email))

def get_all_users(db: Session, skip: int = 0, limit: int = 100) -> list[Usuario]:
    """Obtiene todos los usuarios con paginación."""
    return db.scalars(select(Usuario).offset(skip).limit(limit)).all()

def create_user(db: Session, user: UserCreateSchema) -> Usuario:
    hashed_password = get_password_hash(user.password)
    
    # Buscamos el rol 'user' por defecto
    user_role = db.scalar(select(Rol).where(Rol.nombre == "user"))
    
    if not user_role:
        raise HTTPException(
            status_code=500, 
            detail="El rol 'user' por defecto no existe en la base de datos."
        )

    # Creamos el objeto Usuario
    db_user = Usuario(
        username=user.username,
        email=user.email,
        nombre=user.nombre,
        apellido=user.apellido,
        legajo=user.legajo,  
        hashed_password=hashed_password,
        is_active=True,
        rol_id=user_role.id 
        # Es posible asignar el objeto completo:
        # rol=user_role
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- Lógica de Autenticación ---

def authenticate_user(db: Session, username: str, password: str) -> Optional[Usuario]:
    """Autentica un usuario con username y contraseña."""
    user = get_user_by_username(db, username)
    if not user:
        return None  # Usuario no encontrado
    
    if not verify_password(password, user.hashed_password):
        return None  # Contraseña incorrecta
        
    return user
